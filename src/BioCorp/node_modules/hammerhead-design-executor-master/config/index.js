var config;
if(process.env.NODE_ENV == 'development' || process.env.NODE_ENV == 'test') {
    config = require('./dev/config.json');
} else {
    config = require('./prod/config.json');
}

exports = module.exports = config;

