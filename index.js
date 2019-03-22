let express = require('express')
let request = require('request')

let clientId = 'fmjgn1bqxpw7p0xgvryoe6027483ve'
let streamId = 'rhyolight_'
let userId = '53666502'

const app = express()
const port = process.env.PORT || 5000
const baseUrl = 'https://obs-twitch-overlay.herokuapp.com'

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
    console.log(opts)
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
    let code = req.query['hub.challenge']
    res.status(200).json({'hub.challenge': code})
})



function updateWebhookSubscriptions() {
    let callbackUrl = baseUrl + '/_twitch_webhooks'
    // create a new stream monitor
    console.log(`Creating stream webhook for ${callbackUrl}`)
    request.post({
        url: 'https://api.twitch.tv/helix/webhooks/hub',
        headers: {
            'Client-ID': clientId,
            'User-Agent': 'request',
        },
        json: {
            'hub.callback': callbackUrl,
            'hub.mode': 'subscribe',
            'hub.topic': `https://api.twitch.tv/helix/streams?user_id=${userId}`,
        },
    }, function (error, response, body) {
        console.log('error:', error); // Print the error if one occurred
        console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        console.log('body:', body); // Print the HTML for the Google homepage.
    })
}

updateWebhookSubscriptions()

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

