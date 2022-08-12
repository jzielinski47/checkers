const express = require("express")
const path = require("path")
const app = express()
const port = 3000;

app.use(express.static('static'))

let users = []
let usernames = []
let pionki = ['czarnymi', 'bialymi']

function serverResponse(req, res) {

    let data = '';
    req.on('data', chunk => { data += chunk; })
    req.on('end', () => {

        res.writeHead(200, { "Content-type": "text/plain;charset=utf-8" });
        handleResponse(data)

    })

    function handleResponse(data) {

        let json = JSON.parse(data)

        if (users.length < 2) {
            if (json.username.length > 0 && !usernames.includes(json.username)) {
                json.launch = false
                json.id = users.length
                json.message = 'oczekiwanie na drugiego gracza'
                users.push(json);
                usernames.push(json.username)
            }

            if (users.length < 2) {
                res.end(JSON.stringify(JSON.stringify(users[users.length - 1])))
            }

        }

        if (users.length == 2) {
            if (usernames.includes(json.username)) {
                if (!json.launch) {
                    for (let i = 0; i < users.length; i++) {
                        users[i].launch = true;
                        let oponent = ''
                        if (i == 0) { oponent = users[1].username } else { oponent = users[0].username }
                        users[i].message = users[i].username + ', grasz pionkami ' + pionki[i] + ' przeciwko ' + oponent
                    }

                    if (json.username == users[0].username) res.end(JSON.stringify(JSON.stringify(users[0])))
                    if (json.username == users[1].username) res.end(JSON.stringify(JSON.stringify(users[1])))
                }
            } else {
                res.end(JSON.stringify(JSON.stringify({ launch: true, id: 3, message: 'gra w toku' })))
            }
        }

        console.log(users, usernames, users.length)

    }

}

function serverReset(req, res) {
    users = []; usernames = [];
    console.log('reset', users, usernames)

    for (let i = 0; i < users.length; i++) {
        users[i].launch = false;
        console.log(JSON.stringify(users[i]))
    }

    res.end("{ message: 'reset' }")
}

app.post('/login', (req, res) => { serverResponse(req, res); });
app.post('/reset', (req, res) => { serverReset(req, res) });
app.get('/', function (req, res) { res.sendFile(path.join(__dirname + "/static/html/index.html")) });

app.listen(port, function () {
    console.log("start serwera na porcie " + port)
})