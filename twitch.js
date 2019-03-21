const request = require('request')
let clientId = 'fmjgn1bqxpw7p0xgvryoe6027483ve'

let options = {
    headers: {
        'Client-ID': clientId,
        'User-Agent': 'request',
    }
}

module.exports = {

    getStreams: (gameId, cb) => {
        let opts = Object.assign({}, options, {
            url: 'https://api.twitch.tv/helix/streams',
            qs: {
                game_id: gameId,
                first: 10,
            },
        })
        request(opts, (error, resp, rawBody) => {
            let body = JSON.parse(rawBody)
            if (resp.statusCode !== 200) {
                console.log('%s: %s', body.error, body.message)
                process.exit()
            }
            cb(error, body)
        })
    },

    getGame: (game, cb) => {
        let opts = Object.assign({}, options, {
            url: 'https://api.twitch.tv/helix/games',
            qs: {
                name: game,
            },
        })
        request(opts, (error, resp, rawBody) => {
            let body = JSON.parse(rawBody)
            if (resp.statusCode !== 200) {
                console.log('%s: %s', body.error, body.message)
                process.exit()
            }
            cb(error, body)
        })
    },

}