
$(() => {

    let clientId = 'fmjgn1bqxpw7p0xgvryoe6027483ve'


    const api = {
        //
        // getUser: (login, cb) => {
        //     $.ajax('https://api.twitch.tv/helix/users', {
        //         login: login
        //     }, (resp) => {
        //         console.log(resp)
        //     })
        // },

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