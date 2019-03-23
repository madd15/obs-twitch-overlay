let express = require('express')
let request = require('request')

let clientId = 'fmjgn1bqxpw7p0xgvryoe6027483ve'
// let clientSecret = process.env.APP_SECRET
let clientSecret = 's1u6yj9aexfmn7pp0vvgeiwfktbmar'
let streamId = 'inabeta'
let appAccessToken

const deployed = process.env.DEPLOYED === 'true'
const app = express()
const port = process.env.PORT || 8081
let baseUrl = 'http://localhost'
if (deployed) baseUrl = 'https://obs-twitch-overlay.herokuapp.com'

// This serves the static files for the JS client program.
app.use(express.static('static'))
app.listen(port, () => {
    console.log(`${baseUrl}:${port}/index.html`)
})

app.get('/_twitch', (req, res) => {
    let query = req.query
    const turl = query.qs.turl
    delete query.qs.turl
    const options = {
        headers: {
            'Client-ID': clientId,
            'User-Agent': 'request',
        }
    }
    let opts = Object.assign({}, options, {
        url: turl,
        qs: query.qs,
    })
    console.log(`Proxy HTTP call to ${turl}...`)
    request(opts, (error, resp, rawBody) => {
        let body = JSON.parse(rawBody)
        if (resp.statusCode !== 200) {
            console.log('%s: %s', body.error, body.message)
            process.exit()
        }
        res.setHeader('Content-Type', 'application/json');
        res.end(rawBody);
    })
})

// For Twitch webhooks
app.get('/_twitch_webhooks', (req, res) => {
    console.warn('webhook received!')
    let q = req.query
    console.log(q)
    // this could be a subscription challenge
    if (q['hub.mode']) {
        let code = q['hub.challenge']
        console.log('returning hub.challenge')
        res.status(200).end(code)
    } else {
        console.log('UNKNOWN WEBHOOK PACKAGE:')
    }
})

function authenticate(cb) {
    if (! appAccessToken) {
        let opts = {
            url: 'https://www.reddit.com/r/funny.json',
            headers: {
                'Client-ID': clientId,
                'Authorization': `Bearer ${clientSecret}`,
            },
            json: {
                client_id: clientId,
                client_secret: clientSecret,
                grant_type: 'client_credentials',
                scope:'',
            }
        };
        request.post('https://id.twitch.tv/oauth2/token', opts, (error, resp, body) => {
            console.log('auth returned... storing access token')
            appAccessToken = body.access_token
            cb()
        })
    } else {
        cb()
    }
}


function getExistingSubs(cb) {
    authenticate(() => {
        let payload = {
            url: 'https://api.twitch.tv/helix/webhooks/subscriptions',
            headers: {
                'Client-ID': clientId,
                'Authorization': `Bearer ${appAccessToken}`,
            }
        }
        console.log('searching for existing webhooks...')
        console.log(payload)
        request(payload, (error, resp, rawBody) => {
            cb(JSON.parse(rawBody), payload)
        })
    })
}


function getUser(login, cb) {
    request('https://api.twitch.tv/helix/users', {
        headers: {
            'Client-ID': clientId,
            'User-Agent': 'request',
        },
        qs: {
            login: login,
        }
    }, (error, resp, rawBody) => {
        cb(JSON.parse(rawBody))
    })

}

function updateWebhookSubscriptions(login) {
    getUser(login, (user) => {
        getExistingSubs((subs) => {
            console.log('Webhooks:')
            console.log(subs)
            let callbackUrl = baseUrl + '/_twitch_webhooks'
            let hooksUrl = 'https://api.twitch.tv/helix/webhooks/hub'
            // create a new stream monitor
            console.log(`Creating ${hooksUrl} webhook for ${callbackUrl}`)
            request.post({
                url: hooksUrl,
                headers: {
                    'Client-ID': clientId,
                },
                json: {
                    'hub.callback': callbackUrl,
                    'hub.mode': 'subscribe',
                    'hub.lease_seconds': 864000,
                    'hub.topic': `https://api.twitch.tv/helix/streams?user_id=${user.id}`,
                },
            }, function (error, response, body) {
                if (response && response.statusCode === 202) {
                    console.log('Webhook subscription accepted... awaiting creation.')
                } else {
                    console.log(error)
                }
            })
        })
    })
}

updateWebhookSubscriptions(streamId)

// twitch.getGame('Science & Technology', (err, scienceAndTech) => {
//
//     let updateLiveStreams = () => {
//         console.log('')
//         twitch.getStreams(scienceAndTech.data[0].id, (streamError, streams) => {
//             liveStreams = streams.data
//             console.table(
//                 liveStreams,
//                 ['viewer_count', 'user_name', 'started_at', 'title']
//             )
//         })
//     }
//
//     updateLiveStreams()
//
//     setInterval(updateLiveStreams, 10000)
// })

