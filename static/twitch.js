// const twitchDevId = 'fmjgn1bqxpw7p0xgvryoe6027483ve'

let clientId = 'fmjgn1bqxpw7p0xgvryoe6027483ve';
let redirectURI = 'http://localhost:8081';
let scope = 'chat:read';
let ws;

function parseFragment(hash) {
    let hashMatch = function(expr) {
        let match = hash.match(expr);
        return match ? match[1] : null;
    };
    let state = hashMatch(/state=(\w+)/);
    if (sessionStorage.twitchOAuthState == state)
        sessionStorage.twitchOAuthToken = hashMatch(/access_token=(\w+)/);
    return
};

function authUrl() {
    sessionStorage.twitchOAuthState = nonce(15);
    let url = 'https://api.twitch.tv/kraken/oauth2/authorize' +
        '?response_type=token' +
        '&client_id=' + clientId +
        '&redirect_uri=' + redirectURI +
        '&state=' + sessionStorage.twitchOAuthState +
        '&scope=' + scope;
    return url
}

// Source: https://www.thepolyglotdeveloper.com/2015/03/create-a-random-nonce-string-using-javascript/
function nonce(length) {
    let text = "";
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

function heartbeat() {
    message = {
        type: 'PING'
    };
    $('.ws-output').append('SENT: ' + JSON.stringify(message) + '\n');
    ws.send(JSON.stringify(message));
}

function listen(topic) {
    message = {
        type: 'LISTEN',
        nonce: nonce(15),
        data: {
            topics: [topic],
            auth_token: sessionStorage.twitchOAuthToken
        }
    };
    $('.ws-output').append('SENT: ' + JSON.stringify(message) + '\n');
    ws.send(JSON.stringify(message));
}

function connect() {
    let heartbeatInterval = 1000 * 60; //ms between PING's
    let reconnectInterval = 1000 * 3; //ms to wait before reconnect
    let heartbeatHandle;

    ws = new WebSocket('wss://pubsub-edge.twitch.tv');

    ws.onopen = function(event) {
        $('.ws-output').append('INFO: Socket Opened\n');
        heartbeat();
        heartbeatHandle = setInterval(heartbeat, heartbeatInterval);
    };

    ws.onerror = function(error) {
        $('.ws-output').append('ERR:  ' + JSON.stringify(error) + '\n');
    };

    ws.onmessage = function(event) {
        message = JSON.parse(event.data);
        $('.ws-output').append('RECV: ' + JSON.stringify(message) + '\n');
        if (message.type == 'RECONNECT') {
            $('.ws-output').append('INFO: Reconnecting...\n');
            setTimeout(connect, reconnectInterval);
        }
    };

    ws.onclose = function() {
        $('.ws-output').append('INFO: Socket Closed\n');
        clearInterval(heartbeatHandle);
        $('.ws-output').append('INFO: Reconnecting...\n');
        setTimeout(connect, reconnectInterval);
    };

}

$(function() {
    if (document.location.hash.match(/access_token=(\w+)/))
        parseFragment(document.location.hash);
    if (sessionStorage.twitchOAuthToken) {
        connect();
        $('.socket').show()
        $.ajax({
            url: "https://api.twitch.tv/helix/users",
            method: "GET",
            data: {login: 'rhyolight_'},
            headers: {
                "Client-ID": clientId,
                "Authorization": "OAuth " + sessionStorage.twitchOAuthToken
            }})
            .done(function(user) {
                console.log(user)
            });
    } else {
        let url = authUrl()
        $('#auth-link').attr("href", url);
        $('.auth').show()
    }
});

$('#topic-form').submit(function() {
    listen($('#topic-text').val());
    event.preventDefault();
});

