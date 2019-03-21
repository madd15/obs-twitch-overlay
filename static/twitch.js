let clientId = 'fmjgn1bqxpw7p0xgvryoe6027483ve'


const api = {

    getUser: (login, cb) => {
        $.ajax('https://api.twitch.tv/helix/users', {
            login: login
        }, (resp) => {
            console.log(resp)
        })
    }

}

exports = api