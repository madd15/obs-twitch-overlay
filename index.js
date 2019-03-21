let express = require('express')
let twitch = require('./twitch')

let liveStreams = []
let webHookSubs = {}

const app = express()
const port = 8081
const baseUrl = 'http://893c9f0a.ngrok.io'

app.use(express.static('static'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

function updateWebhookSubscriptions() {
    liveStreams.forEach(stream => {
        if (webHookSubs[stream.name]) {
            // nothing
        } else {
            // create a new one
            request.post({
                url: '', formData: {
                    hub: {
                        callback: baseUrl + '/_twitch_webhooks',
                        mode: 'subscribe',

                    }
                }
            })
        }
    })
}

twitch.getGame('Science & Technology', (err, scienceAndTech) => {

    let updateLiveStreams = () => {
        console.log('')
        twitch.getStreams(scienceAndTech.data[0].id, (streamError, streams) => {
            liveStreams = streams.data
            console.table(
                liveStreams,
                ['viewer_count', 'user_name', 'started_at', 'title']
            )
        })
    }

    updateLiveStreams()

    setInterval(updateLiveStreams, 10000)
})

