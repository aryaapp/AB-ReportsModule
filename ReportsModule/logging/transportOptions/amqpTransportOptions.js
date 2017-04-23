"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var transOptions = require("./transportOptions");
/*options for AMQP protocol*/
var AmqpTransportOptions = (function (_super) {
    __extends(AmqpTransportOptions, _super);
    function AmqpTransportOptions(level, host, port, login, password, exchange, vhost) {
        if (host === void 0) { host = null; }
        if (port === void 0) { port = null; }
        if (login === void 0) { login = null; }
        if (password === void 0) { password = null; }
        if (exchange === void 0) { exchange = null; }
        if (vhost === void 0) { vhost = null; }
        var _this = _super.call(this, level) || this;
        _this.parseParametres(level, host, port, login, password, exchange, vhost);
        return _this;
    }
    /*parse and sets parameters*/
    AmqpTransportOptions.prototype.parseParametres = function (level, host, port, login, password, exchange, vhost) {
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
    };
    AmqpTransportOptions.prototype.getExchange = function () {
        return this.exchange;
    };
    AmqpTransportOptions.prototype.setExchange = function (exchange) {
        this.exchange = exchange;
    };
    AmqpTransportOptions.prototype.getHost = function () {
        return this.host;
    };
    AmqpTransportOptions.prototype.setHost = function (host) {
        this.host = host;
    };
    AmqpTransportOptions.prototype.getPort = function () {
        return this.port;
    };
    AmqpTransportOptions.prototype.setPort = function (port) {
        this.port = port;
    };
    AmqpTransportOptions.prototype.getVhost = function () {
        return this.vhost;
    };
    AmqpTransportOptions.prototype.setVhost = function (vhost) {
        this.vhost = vhost;
    };
    AmqpTransportOptions.prototype.getLogin = function () {
        return this.login;
    };
    AmqpTransportOptions.prototype.setLogin = function (login) {
        this.login = login;
    };
    AmqpTransportOptions.prototype.getPassword = function () {
        return this.password;
    };
    AmqpTransportOptions.prototype.setPassword = function (password) {
        this.password = password;
    };
    return AmqpTransportOptions;
}(transOptions.transportOptions));
exports.AmqpTransportOptions = AmqpTransportOptions;
//# sourceMappingURL=amqpTransportOptions.js.map