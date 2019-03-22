let express = require('express')
let request = require('request')

let twitch = require('./twitch')
let clientId = 'fmjgn1bqxpw7p0xgvryoe6027483ve'

let liveStreams = []
let webHookSubs = {}

const app = express()
const port = process.env.PORT || 5000
const baseUrl = 'http://localhost'

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


// function updateWebhookSubscriptions() {
//     liveStreams.forEach(stream => {
//         if (webHookSubs[stream.name]) {
//             // nothing
//         } else {
//             // create a new one
//             request.post({
//                 url: '', formData: {
//                     hub: {
//                         callback: baseUrl + '/_twitch_webhooks',
//                         mode: 'subscribe',
//
//                     }
//                 }
//             })
//         }
//     })
// }

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

