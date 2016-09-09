var winston = require('winston');
var config = require('../config/config.json');
var current_dir = config.env.current_dir;

var logFile = current_dir + '/appLog.log';
winston.emitErrs = true;
var logger = new winston.Logger({
    transports: [
        new winston.transports.File({
            level: 'info',
            filename: logFile,
            handleExceptions: true,
            //json: true,
            maxsize: 5242880, //5MB
            maxFiles: 5,
            colorize: false
        }),
        new winston.transports.Console({
            level: 'debug',
            handleExceptions: true,
            json: false,
            colorize: true
        })
    ],
    exitOnError: false
});


var SHOW_ALL = 30;
var HIDE_ALL = 0;

var config = require('../config/config.json');
var LOG_LEVEL = 30;//config.log_level;  // 0: Only super important stuff
                                   // 30: Everything

if(process.env.NODE_ENV === 'test'){
    LOG_LEVEL = SHOW_ALL;
}
                                        
function Log(message, module, level)
{
    // if(level < LOG_LEVEL){
        logger.info(module + ": " + message);
    // }
}

function setLogLevel(newLevel)
{
    LOG_LEVEL = newLevel;
};

exports.Log = Log;
exports.setLogLevel = setLogLevel;
exports.HIDE_ALL = HIDE_ALL;
exports.SHOW_ALL = SHOW_ALL;
