var winston = require('winston');
require('winston-mail').Mail;
var amqp = require('winston-amqp').AMQP;

import transpFactory = require('../logging/transportFactory');
/*Winston logger wrapper as singleton
  uses nconf to load settings
 
*/
export class Logger{
    private static Instance: Logger = null;
    /*winston logger*/
    private static LogObj: any;
    /*path to JSON settings file*/
    private SettingsPath: string;

    constructor(settingsPath: string) {
        if (Logger.Instance) {
            throw new Error("Error: Instantiation failed: Use Logger.getInstance() instead of new.");
        }
        this.SettingsPath = settingsPath;
        Logger.Instance = this;
    }

    /*Create instance of a logger based on json settings*/
    public static getInstance(settingsPath: string): Logger {
        if (Logger.Instance === null) {
            Logger.Instance = new Logger(settingsPath);
            Logger.Instance.loadConfig();
        }
        return Logger.Instance;
    }


    private loadConfig(): void {

        var console = transpFactory.TransportFactory.createTransport(transpFactory.LoggerTypes.Console, this.SettingsPath);
        var mail = transpFactory.TransportFactory.createTransport(transpFactory.LoggerTypes.Mail, this.SettingsPath);
        var file = transpFactory.TransportFactory.createTransport(transpFactory.LoggerTypes.File, this.SettingsPath);
        var amqp = transpFactory.TransportFactory.createTransport(transpFactory.LoggerTypes.AMQP, this.SettingsPath);

        var transports = new Array();
        if (console !== null) transports.push(console);
        if (mail !== null) transports.push(mail);
        if (file !== null) transports.push(file);
        if (amqp !== null) transports.push(amqp);

        
        var logg = new (winston.Logger)(
            {
                exitOnError: false,
                exceptionHandlers: transports,
                transports: transports
            });
        Logger.LogObj = logg;
    }

    /*level - log level ie. error, warn, info
       message - message to log
       metadata - additional metadata (JSON)
    */
    public log(level: string, message: string, metadata: any=null): void{
        Logger.LogObj.log(level, message,metadata);
    }

    public info(message:string, metadata: any=null): void {
        Logger.LogObj.info(message,metadata);
    }

    public error(message: string, metadata: any= null): void {
        Logger.LogObj.error(message,metadata);
    }

    warning(message:string,metadata:any=null): void {
        Logger.LogObj.warn(message,metadata);
    }
}