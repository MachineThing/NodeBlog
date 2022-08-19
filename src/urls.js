class Url {
    constructor(path, name=undefined) {
        this.path = '/'+path;
        if (name === undefined) {
            this.title = '';
        } else {
            this.title = ' - '+name;
        }
    }
}

module.exports  = {
    '':new Url('index.js'),
    'register':new Url('register.js', 'Register'),
    'login':new Url('login.js', 'Login')
}