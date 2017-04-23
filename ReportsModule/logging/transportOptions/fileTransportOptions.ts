import transOptions = require('./transportOptions');

/*options for files*/
export class FileTransportOptions extends transOptions.transportOptions {

    //path to file with logs
    private filename: string;
    constructor(level: string,filename:string) {
        super(level);
        this.parseParametres(level,filename);
    }

    private parseParametres(level: string, filename: string): void {
        if (level !== null && level !== undefined)
            this.setLevel(level);
        else
            this.setLevel('error');
        if (filename !== null && filename !== undefined)
            this.filename = filename;
        else
            this.filename = filename;
    }

    public getFileName(): string {
        return this.filename;
    }

    public setFileName(filename: string) {
        this.filename = filename;
    }
}