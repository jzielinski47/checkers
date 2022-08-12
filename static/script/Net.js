// @ts-nocheck

class Net {

    constructor() {
        this.input = document.getElementById('username'); //input
        this.login = document.getElementById('login'); //button
        this.reset = document.getElementById('reset'); //button

        let triggerReset = false;
        let letLogin = true;

        this.login.onclick = () => {

            this.username = this.input.value

            if (this.username.length > 0) {
                if (letLogin) {
                    let repeat = setInterval(() => {
                        let data = { username: this.username }
                        letLogin = false;
                        fetch("/login", { method: "post", body: JSON.stringify(data) })
                            .then(response => response.json())
                            .then(result => {
                                console.log(result)
                                this.serverResponse(result, repeat)
                            })
                            .catch(error => console.log(error));

                        if (triggerReset) clearInterval(repeat); triggerReset = false; letLogin = true;

                    }, 1000)
                }
            }

        }

        this.reset.onclick = () => {
            let res = fetch("/reset", { method: "post", body: "{}" });
            triggerReset = true;
            letLogin = true;
        }
    }


    serverResponse(result, interval) {

        if (result.length > 0) {
            document.getElementById('info').innerHTML = JSON.parse(result).message
            if (JSON.parse(result).message == 'oczekiwanie na drugiego gracza') {
                this.input.style.display = 'none'; this.login.style.display = 'none'; this.reset.style.display = 'none';
            }

            if (JSON.parse(result).launch == true) {
                document.getElementById('header').innerHTML = JSON.parse(result).message
                clearInterval(interval);

                if (JSON.parse(result).id == 0) { game.setCamera(50); game.setColor('black'); document.getElementById('user-interface').style.display = 'none'; }
                if (JSON.parse(result).id == 1) { game.setCamera(-50); game.setColor('white'); document.getElementById('user-interface').style.display = 'none'; }
                if (JSON.parse(result).id == 3) { document.getElementById('info').innerHTML = JSON.parse(result).message }
            }
        }
    }

}
