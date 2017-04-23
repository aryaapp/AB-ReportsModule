import transOptions = require('./transportOptions');

/*options for AMQP protocol*/
export class AmqpTransportOptions extends transOptions.transportOptions {

    //name of exchange to push logs to
    private exchange: string;
    //rabbitmq host
    private host: string;
    //rabbitmq port
    private port: number;
    //vhost for rabbitmq
    private vhost: string;
    //rabbitmq login
    private login: string;
    //rabbitmq pass
    private password: string;

    constructor(level: string,host:string=null,port:number=null,login:string=null,password:string=null,exchange:string=null,vhost:string=null) {
        super(level);
        this.parseParametres(level, host, port, login, password, exchange, vhost);
    }

    /*parse and sets parameters*/
    private parseParametres(level: string, host: string, port: number, login: string, password: string, exchange: string, vhost: string): void {
        if (level !== null && level !== undefined)
            this.setLevel(level);
        else
            this.setLevel('error');
        if (exchange !== null && exchange !== undefined)
            this.exchange = exchange;
        if (host !== null && host !== undefined)
            this.host = host;
        if (port !== null && port !== undefined)
            this.port = port;
        if (vhost !== null && vhost !== undefined)
            this.vhost = vhost;
        if (login !== null && login !== undefined)
            this.login = login;
        if (password !== null && password !== undefined)
            this.password = password;
    }

    public getExchange(): string {
        return this.exchange;
    }

    public setExchange(exchange: string): void {
        this.exchange = exchange;
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

    public getVhost(): string {
        return this.vhost;
    }

    public setVhost(vhost: string): void {
        this.vhost = vhost;
    }

    public getLogin(): string {
        return this.login;
    }

    public setLogin(login: string): void {
        this.login = login;
    }

    public getPassword(): string {
        return this.password;
    }

    public setPassword(password: string): void {
        this.password = password;
    }
}