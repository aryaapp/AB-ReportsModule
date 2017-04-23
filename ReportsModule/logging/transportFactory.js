"use strict";
var consoleOptions = require("./transportOptions/consoleTransportOptions");
var fileOptions = require("./transportOptions/fileTransportOptions");
var mailOptions = require("./transportOptions/mailTransportOptions");
var amqpOptions = require("./transportOptions/amqpTransportOptions");
var winston = require('winston');
require('winston-mail').Mail;
var amqp = require('winston-amqp').AMQP;
/*enum for logg output types
- console log
- sending mail with logs
- write logs to the file
- send logs to AMQP (RabbitMQ) for further processing
*/
var LoggerTypes;
(function (LoggerTypes) {
    LoggerTypes[LoggerTypes["Console"] = 0] = "Console";
    LoggerTypes[LoggerTypes["Mail"] = 1] = "Mail";
    LoggerTypes[LoggerTypes["File"] = 2] = "File";
    LoggerTypes[LoggerTypes["AMQP"] = 3] = "AMQP";
})(LoggerTypes = exports.LoggerTypes || (exports.LoggerTypes = {}));
/*Factory pattern for transport types*/
var TransportFactory = (function () {
    function TransportFactory() {
        throw new Error("Can't instantiate TransportFactory class");
    }
    TransportFactory.createTransport = function (type, settingsFilePath) {
        var conf = require('nconf').argv().env().file('logger', settingsFilePath);
        switch (type) {
            case LoggerTypes.File:
                {
                    var useFileLogger = conf.get('useFileLogger');
                    if (useFileLogger !== null && useFileLogger !== undefined && useFileLogger !== false) {
                        var filePathForFileLogger = conf.get('filePathForFileLogger');
                        var fileLoggerLevel = conf.get('fileLoggerLevel');
                        var fileParams = new fileOptions.FileTransportOptions(fileLoggerLevel, filePathForFileLogger);
                        return new winston.transports.File(fileParams);
                    }
                    else
                        return null;
                }
            case LoggerTypes.Mail:
                {
                    var useMailLogger = conf.get('useMailLogger');
                    if (useMailLogger !== null && useMailLogger !== undefined && useMailLogger !== false) {
                        var mailLoggerLevel = conf.get('mailLoggerLevel');
                        var mailTo = conf.get('mailTo');
                        var mailFrom = conf.get('mailFrom');
                        var smtpHost = conf.get('smtpHost');
                        var smtpPort = conf.get('smtpPort');
                        var smtpUserName = conf.get('smtpUserName');
                        var smtpPassword = conf.get('smtpPassword');
                        var smtpSsl = conf.get('smtpSsl');
                        var mailSubject = conf.get('mailSubject');
                        var mailParams = new mailOptions.MailTransportOptions(mailLoggerLevel, mailTo, mailFrom, smtpHost, smtpPort, smtpUserName, smtpPassword, smtpSsl, mailSubject);
                        return new winston.transports.Mail(mailParams);
                    }
                    else
                        return null;
                }
            case LoggerTypes.AMQP:
                {
                    var useAmpqLogger = conf.get('useAmpqLogger');
                    if (useAmpqLogger !== null && useAmpqLogger !== undefined && useAmpqLogger !== false) {
                        var amqpLevel = conf.get('ampqLevel');
                        var amqpExchange = conf.get('amqpExchange');
                        var amqpHost = conf.get('amqpHost');
                        var amqpPort = conf.get('amqpPort');
                        var amqpVhost = conf.get('amqpVhost');
                        var amqpLogin = conf.get('amqpLogin');
                        var amqpPassword = conf.get('amqpPassword');
                        var amqpParams = new amqpOptions.AmqpTransportOptions(amqpLevel, amqpHost, amqpPort, amqpLogin, amqpPassword, amqpExchange, amqpVhost);
                        winston.transports.AMQP = amqp;
                        return new winston.transports.AMQP(amqpParams);
                    }
                    else
                        return null;
                }
            default:
                {
                    var useConsoleLogger = conf.get('useConsoleLogger');
                    if (useConsoleLogger !== null && useConsoleLogger != undefined && useConsoleLogger !== false) {
                        var consoleLoggerLevel = conf.get('consoleLoggerLevel');
                        var consoleParams = new consoleOptions.ConsoleTransportOptions(consoleLoggerLevel);
                        return new winston.transports.Console(consoleParams);
                    }
                    else
                        return null;
                }
        }
    };
    return TransportFactory;
}());
exports.TransportFactory = TransportFactory;
//# sourceMappingURL=transportFactory.js.map