import fetch from 'node-fetch';
import { Body } from './lib/github-format';
import { PushBody } from './lib/github-push-format';
import { PRBody } from './lib/github-pr-format'
import * as gformat from './lib/gchat-format';

/**
 * 
 * @param body A Body or PushBody to generate a header for
 * @returns A header 
 */
const makeHeader = (body: PushBody | Body | PRBody): gformat.Header => {
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
const makeRepoInfo = (body: PushBody | Body | PRBody): gformat.Section => {
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
 * @param body A Body or PushBody to generate a compact repoinfo for
 * @returns A compact repoinfo section
 */
const makeCompactRepoInfo = (body: PushBody | Body | PRBody): gformat.Section => {
    return {
        widgets: [
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
 * @param body A PushBody to generate detailed event info for
 * @returns A detailed event info section 
 */
const makePushEventInfo = (body: PushBody): gformat.Section => {
    return {
        widgets: [
            {
                textParagraph: {
                    text: `There was a${body.forced?' <b>forced</b>':'n <b>unforced</b>'} push by <b>${body.pusher.name}</b>`
                }
            },
            {
                keyValue: {
                    topLabel: 'Head Commit',
                    content: body.head_commit.message, 
                    bottomLabel: `By ${body.head_commit.committer.username} (${body.head_commit.committer.name})`,
                    button: {
                        textButton: {
                            text: 'View Commit',
                            onClick: {
                                openLink: {
                                    url: body.head_commit.url
                                }
                            }
                        }
                    }
                }
            },
            {
                textParagraph: {
                    text: `<b>${body.head_commit.added.length}</b> added, <b>${body.head_commit.modified.length}</b> modified, <b>${body.head_commit.removed.length}</b> removed (in head commit)`
                }
            },
            {
                textParagraph: {
                    text: `<b>${body.commits.length}</b> total commit${(body.commits.length===0||body.commits.length>1)?'s':''} in this push`
                }
            },
            {
                buttons: [
                    {
                        textButton: {
                            text: 'Compare Push',
                            onClick: {
                                openLink: {
                                    url: body.compare
                                }
                            }
                        }
                    },
                    {
                        imageButton: {
                            iconUrl: body.sender.avatar_url,
                            onClick: {
                                openLink: {
                                    url: body.sender.html_url
                                }
                            }
                        }
                    },
                    {
                        imageButton: {
                            icon: 'MEMBERSHIP',
                            onClick: {
                                openLink: {
                                    url: body.repository.url
                                }
                            }
                        }
                    }
                ]
            }
        ]
    }
}
/**
 * 
 * @param body A PRBody to generate a section for 
 * @returns A section
 */
const makePREventInfo = (body: PRBody): gformat.Section => {
    return {
        widgets: [
            {
                textParagraph: {
                    text: `Pull request <b>#${body.pull_request.number}</b> was <b>${body.action}</b> by <b>${body.sender.login}</b>`
                }
            },
            {
                keyValue: {
                    topLabel: `Pull Request #${body.pull_request.number}`,
                    content: body.pull_request.title,
                    bottomLabel: `By ${body.pull_request.user.login}`,
                    button: {
                        textButton: {
                            text: 'View Pull Request',
                            onClick: {
                                openLink: {
                                    url: body.pull_request.html_url
                                }
                            }
                        }
                    }
                }
            },
            {
                textParagraph: {
                    text: `Pull request overview:<br><b>${body.pull_request.base.label} <- ${body.pull_request.head.label}</b>`
                }
            },
            {
                textParagraph: {
                    text: `Changes:<br><b>${body.pull_request.commits}</b> commit${(body.pull_request.commits===0||body.pull_request.commits>1)?'s':''}<br><b>${body.pull_request.changed_files}</b> file${(body.pull_request.changed_files===0||body.pull_request.changed_files>1)?'s':''} changed<br><b>${body.pull_request.comments}</b> comment${(body.pull_request.comments===0||body.pull_request.comments>1)?'s':''}`
                }
            },
            {
                buttons: [
                    {
                        textButton: {
                            text: 'View Diff',
                            onClick: {
                                openLink: {
                                    url: body.pull_request.diff_url
                                }
                            }
                        }
                    },
                    {
                        imageButton: {
                            iconUrl: body.sender.avatar_url,
                            onClick: {
                                openLink: {
                                    url: body.sender.html_url
                                }
                            }
                        }
                    },
                    {
                        imageButton: {
                            icon: 'MEMBERSHIP',
                            onClick: {
                                openLink: {
                                    url: body.repository.html_url
                                }
                            }
                        }
                    }
                ]
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
    const msg: gformat.CardMessage = {
        cards: [
            {
                header: makeHeader(body), 
                sections: [
                    makeRepoInfo(body),
                    makeBasicEventInfo(body, event)
                ]
            }
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
/**
 * @param body A body to generate the push message for
 * @returns An async function that sends the message
 */
export const generatePushMessage = (body: PushBody) => {
    const msg: gformat.CardMessage = {
        cards: [
            {
                header: makeHeader(body), 
                sections: [
                    makeCompactRepoInfo(body),
                    makePushEventInfo(body)
                ]
            }
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
/**
 * 
 * @param body A body to generate a pull request message for
 * @returns An async function that sends the message
 */
export const generatePRMessage = (body: PRBody) => {
    const msg: gformat.CardMessage = {
         cards: [
             {
                 header: makeHeader(body),
                 sections: [
                     makeCompactRepoInfo(body),
                     makePREventInfo(body)
                 ]
             }
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

