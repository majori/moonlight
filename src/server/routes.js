var cfg = require('../config');

module.exports = function(app) {

    app.get('/app', (req, res, next) => {
        res.sendFile(cfg.publicPath + '/views/index.html');
    });

    app.get('*', (req, res, next) => {
        res.redirect('/app');
    });

};
