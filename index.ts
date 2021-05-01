import express = require('express');
import fetch from 'node-fetch';
import { Body } from './github-format';
import * as gformat from './gchat-format';
const app = express();

const generateMessage = (body: Body, event: string) => {
    const header = {
        title: `GitHub Update`,
        subtitle: `For ${body.repository.full_name}`,
        imageUrl: 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png'
    }
    const section1: gformat.Section = {
        widgets: [
            {
                keyValue: {
                    topLabel: "Repo Owner",
                    content: body.repository.owner.login,
                    iconUrl: body.repository.owner.avatar_url,
                    contentMultiline: false, 
                    onClick: {
                        openLink: {
                            url: body.repository.owner.html_url
                        }
                    }, 
                    button: {
                        textButton: {
                            text: "Open Profile",
                            onClick: {
                                openLink: {
                                    url: body.repository.owner.html_url
                                }
                            }
                        }
                    },
                    bottomLabel: body.repository.owner.html_url
                }
            },
            {
                textParagraph: {
                    text: `<b>${body.repository.name}:</b><br>'${body.repository.description}'<br>Written in <u>${body.repository.language}</u>`
                }
            },
            {
                keyValue: {
                    topLabel: body.repository.name,
                    content: `${body.repository.open_issues_count} open issue${(body.repository.open_issues_count===0||body.repository.open_issues_count>1)?'s':''}, ${body.repository.forks_count} fork${(body.repository.forks_count===0||body.repository.forks_count>1)?'s':''}`,
                    bottomLabel: `${body.repository.watchers_count} watcher${(body.repository.watchers_count===0||body.repository.watchers_count>1)?'s':''}, ${body.repository.stargazers_count} stargazer${(body.repository.stargazers_count===0||body.repository.stargazers_count>1)?'s':''}`,
                    icon: 'MEMBERSHIP',
                    button: {
                        textButton: {
                            text: 'Open Repo',
                            onClick: {
                                openLink: {
                                    url: body.repository.html_url
                                }
                            }
                        }
                    }
                }
            }
        ]
    }
    const section2: gformat.Section = {
        widgets: [
            {
                textParagraph: {
                    text: `This update was triggered by the <b>${event}</b> event.`
                }
            },
            {
                keyValue: {
                    topLabel: `Event Sender`,
                    content: body.sender.login,
                    iconUrl: body.sender.avatar_url,
                    onClick: {
                        openLink: {
                            url: body.sender.html_url
                        }
                    },
                    button: {
                        textButton: {
                            text: 'Open Profile',
                            onClick: {
                                openLink: {
                                    url: body.sender.html_url
                                }
                            }
                        }
                    },
                    bottomLabel: body.sender.html_url
                }
            }
        ]
    }
    const card: gformat.Card = {
        header: header, 
        sections: [
            section1,
            section2
        ]
    }
    const msg: gformat.CardMessage = {
        cards: [
            card
        ]
    }
    return async (url: string) => {
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8'
            },
            body: JSON.stringify(msg)
        });
        return res;
    }
}

app.use(express.json())

app.post('/', async (req, res)=>{
    try { 
        if (!req.query.url) throw `Please specify a URL to send to`;
        const url: string = `${req.query.url as string}&token=${req.query.token}`
        const tstping = await fetch(url)
        if (tstping.status!==401) throw `Invalid URL: Expected test ping response of 401, got ${tstping.status}`;
        const sendMessage = generateMessage(req.body as Body, req.header("X-GitHub-Event"))
        const whres = await sendMessage(url);
        res.status(whres.status).send(`URL: ${whres.url} \n Repsonse: ${whres.status}: ${whres.statusText} \n Response Body: ${whres.body.read()}`)
    } catch (error) {
        res.status(400).send(`Bad Request: ${error}`)
    }
})

app.listen(8000)