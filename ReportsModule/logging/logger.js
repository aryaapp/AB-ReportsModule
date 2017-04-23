"use strict";
var winston = require('winston');
require('winston-mail').Mail;
var amqp = require('winston-amqp').AMQP;
var transpFactory = require("../logging/transportFactory");
/*Winston logger wrapper as singleton
  uses nconf to load settings
 
*/
var Logger = (function () {
    function Logger(settingsPath) {
        if (Logger.Instance) {
            throw new Error("Error: Instantiation failed: Use Logger.getInstance() instead of new.");
        }
        this.SettingsPath = settingsPath;
        Logger.Instance = this;
    }
    /*Create instance of a logger based on json settings*/
    Logger.getInstance = function (settingsPath) {
        if (Logger.Instance === null) {
            Logger.Instance = new Logger(settingsPath);
            Logger.Instance.loadConfig();
        }
        return Logger.Instance;
    };
    Logger.prototype.loadConfig = function () {
        var console = transpFactory.TransportFactory.createTransport(transpFactory.LoggerTypes.Console, this.SettingsPath);
        var mail = transpFactory.TransportFactory.createTransport(transpFactory.LoggerTypes.Mail, this.SettingsPath);
        var file = transpFactory.TransportFactory.createTransport(transpFactory.LoggerTypes.File, this.SettingsPath);
        var amqp = transpFactory.TransportFactory.createTransport(transpFactory.LoggerTypes.AMQP, this.SettingsPath);
        var transports = new Array();
        if (console !== null)
            transports.push(console);
        if (mail !== null)
            transports.push(mail);
        if (file !== null)
            transports.push(file);
        if (amqp !== null)
            transports.push(amqp);
        var logg = new (winston.Logger)({
            exitOnError: false,
            exceptionHandlers: transports,
            transports: transports
        });
        Logger.LogObj = logg;
    };
    /*level - log level ie. error, warn, info
       message - message to log
       metadata - additional metadata (JSON)
    */
    Logger.prototype.log = function (level, message, metadata) {
        if (metadata === void 0) { metadata = null; }
        Logger.LogObj.log(level, message, metadata);
    };
    Logger.prototype.info = function (message, metadata) {
        if (metadata === void 0) { metadata = null; }
        Logger.LogObj.info(message, metadata);
    };
    Logger.prototype.error = function (message, metadata) {
        if (metadata === void 0) { metadata = null; }
        Logger.LogObj.error(message, metadata);
    };
    Logger.prototype.warning = function (message, metadata) {
        if (metadata === void 0) { metadata = null; }
        Logger.LogObj.warn(message, metadata);
    };
    return Logger;
}());
Logger.Instance = null;
exports.Logger = Logger;
//# sourceMappingURL=logger.js.map