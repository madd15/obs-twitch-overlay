
$(() => {

    let clientId = 'fmjgn1bqxpw7p0xgvryoe6027483ve'


    const api = {

        getStream: (login, cb) => {
            $.ajax({
                url: '/_twitch',
                data: {
                    qs: {
                        turl: 'https://api.twitch.tv/helix/streams',
                        user_login: login
                    }
                },
                success: cb
            });
        }

    }

    window.twitch = api

})
