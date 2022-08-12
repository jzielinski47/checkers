// @ts-nocheck
class Ui {

    constructor() {
        this.ui = document.getElementById('user-interface');

        this.render()
    }

    render = () => {

        this.input = document.createElement('input');
        this.input.name = 'username'; this.input.id = 'username';
        this.input.placeholder = 'username ->'; this.input.width = 500 + "px";

        this.login = document.createElement('button');
        this.login.innerHTML = 'login'; this.login.id = 'login';

        this.reset = document.createElement('button');
        this.reset.innerHTML = 'reset'; this.reset.id = 'reset';

        this.info = document.createElement('div');
        this.info.innerHTML = 'wybierz username'; this.info.id = 'info';

        this.ui.append(this.input, this.login, this.reset, this.info);
    }
}
