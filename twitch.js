// const request = require('request');
// const twitchDevId = 'fmjgn1bqxpw7p0xgvryoe6027483ve'
// const options = {
//     headers: {
//         'User-Agent': 'request',
//         'Client-ID': twitchDevId,
//     }
// };
//
// function connect() {
//     let opts = Object.assign({}, options, {
//         url: 'https://api.twitch.tv/helix/streams'
//     })
//     request(opts, (error, response, body) {
//         if (!error && response.statusCode == 200) {
//             const info = JSON.parse(body);
//             console.log(info)
//             // console.log(info.stargazers_count + " Stars");
//             // console.log(info.forks_count + " Forks");
//         }
//     });
// }


const pubSubUri = 'wss://pubsub-edge.twitch.tv'
const WebSocket = require('ws');

// const ws = new WebSocket('ws://www.host.com/path');
// function heartbeat() {
//     clearTimeout(this.pingTimeout);
//
//     // Use `WebSocket#terminate()` and not `WebSocket#close()`. Delay should be
//     // equal to the interval at which your server sends out pings plus a
//     // conservative assumption of the latency.
//     this.pingTimeout = setTimeout(() => {
//         this.terminate();
//     }, 30000 + 1000);
// }

class TwitchClient {
    constructor() {
        this.ws = new WebSocket(pubSubUri)
        while(this.ws.readyState !== WebSocket.OPEN) {
            console.log('Waiting for socket to open, currently %s', this.ws.readyState)
        }
    }
}

module.exports = TwitchClient