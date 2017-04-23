import transOptions = require('./transportOptions');

/*options for mail transport*/
export class MailTransportOptions extends transOptions.transportOptions {
    //mail to
    private to: string;
    //mail from
    private from: string;
    //smtp host
    private host: string;
    //smtp port
    private port: number;
    //smtp username
    private username: string;
    //smtp password
    private password: string;
    //smtp ssl
    private ssl: boolean;
    //mail subject
    private subject: string;

    constructor(level: string, to:string, from:string=null,host:string=null,port:number=null,username:string=null,password:string=null,ssl:boolean=null,subject:string=null) {
        if (to === null) throw new Error('to is required');
        super(level);
        this.parseParametres(level, to, from, host, port, username, password, ssl,subject);

    }
    
    /*parse and sets parameters*/
    private parseParametres(level:string,to:string,from:string,host:string,port:number,username:string,password:string,ssl:boolean,subject:string): void {
        if (level !== null && level !== undefined)
            this.setLevel(level);
        else
            this.setLevel('error');
        if (to !== undefined)
            this.to = to;
        if (from !== null && from !== undefined)
            this.from = from;
        if (host !== null && host !== undefined)
            this.host = host;
        if (port !== null && port !== undefined)
            this.port = port;
        if (username !== null && username !== undefined)
            this.username = username;
        if (password !== null && password !== undefined)
            this.password = password;
        if (ssl !== null && ssl !== undefined)
            this.ssl = ssl;
        if (subject !== null && subject !== undefined)
            this.subject = subject;
    }

    public getTo(): string {
        return this.to;
    }

    public setTo(to: string): void {
        this.to = to;
    }

    public getFrom(): string {
        return this.from;
    }

    public setFrom(from: string): void {
        this.from = from;
    }

    public getHost(): string {
        return this.host;
    }

    public setHost(host: string): void {
        this.host = host;
    }

    public getPort(): number {
        return this.port;
    }

    public setPort(port: number): void {
        this.port = port;
    }

    public getUsername(): string {
        return this.username;
    }

    public setUserName(username: string): void {
        this.username = username;
    }

    public getPassword(): string {
        return this.password;
    }

    public setPassword(password: string): void {
        this.password = password;
    }

    public getSSL(): boolean {
        return this.ssl;
    }

    public setSSL(enableSSL: boolean): void {
        this.ssl = enableSSL;
    }
}