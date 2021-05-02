import fetch from 'node-fetch';
import { Body } from './lib/github-format';
import { PushBody } from './lib/github-push-format';
import * as gformat from './lib/gchat-format';

/**
 * 
 * @param body A Body or PushBody to generate a header for
 * @returns A header 
 */
const makeHeader = (body: PushBody | Body): gformat.Header => {
    return {
        title: `GitHub Update`,
        subtitle: `For ${body.repository.full_name}`,
        imageUrl: 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png'
    }
}
/**
 * 
 * @param body A Body or PushBody to generate a repoinfo for
 * @returns A repoinfo section
 */
const makeRepoInfo = (body: PushBody |Body): gformat.Section => {
    return {
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
}
/**
 * 
 * @param body A Body to make basic event info for
 * @param event The event to make the basic event info for
 * @returns A basic event info section
 */
const makeBasicEventInfo = (body: Body, event: string): gformat.Section => {
    return {
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
}
/**
 * 
 * @param body A body to generate the default message for 
 * @param event The event that triggered the message
 * @returns An async function that sends the message
 */
export const generateDefaultMessage = (body: Body, event: string) => {
    const card: gformat.Card = {
        header: makeHeader(body), 
        sections: [
            makeRepoInfo(body),
            makeBasicEventInfo(body, event)
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

