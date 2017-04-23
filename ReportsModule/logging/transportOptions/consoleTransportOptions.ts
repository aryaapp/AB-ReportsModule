import transpOptions = require('./transportOptions');

export class ConsoleTransportOptions extends transpOptions.transportOptions{
    constructor(level: string) {
        super(level);
    }

    
}