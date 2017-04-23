"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var transOptions = require("./transportOptions");
/*options for mail transport*/
var MailTransportOptions = (function (_super) {
    __extends(MailTransportOptions, _super);
    function MailTransportOptions(level, to, from, host, port, username, password, ssl, subject) {
        if (from === void 0) { from = null; }
        if (host === void 0) { host = null; }
        if (port === void 0) { port = null; }
        if (username === void 0) { username = null; }
        if (password === void 0) { password = null; }
        if (ssl === void 0) { ssl = null; }
        if (subject === void 0) { subject = null; }
        var _this = this;
        if (to === null)
            throw new Error('to is required');
        _this = _super.call(this, level) || this;
        _this.parseParametres(level, to, from, host, port, username, password, ssl, subject);
        return _this;
    }
    /*parse and sets parameters*/
    MailTransportOptions.prototype.parseParametres = function (level, to, from, host, port, username, password, ssl, subject) {
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
    };
    MailTransportOptions.prototype.getTo = function () {
        return this.to;
    };
    MailTransportOptions.prototype.setTo = function (to) {
        this.to = to;
    };
    MailTransportOptions.prototype.getFrom = function () {
        return this.from;
    };
    MailTransportOptions.prototype.setFrom = function (from) {
        this.from = from;
    };
    MailTransportOptions.prototype.getHost = function () {
        return this.host;
    };
    MailTransportOptions.prototype.setHost = function (host) {
        this.host = host;
    };
    MailTransportOptions.prototype.getPort = function () {
        return this.port;
    };
    MailTransportOptions.prototype.setPort = function (port) {
        this.port = port;
    };
    MailTransportOptions.prototype.getUsername = function () {
        return this.username;
    };
    MailTransportOptions.prototype.setUserName = function (username) {
        this.username = username;
    };
    MailTransportOptions.prototype.getPassword = function () {
        return this.password;
    };
    MailTransportOptions.prototype.setPassword = function (password) {
        this.password = password;
    };
    MailTransportOptions.prototype.getSSL = function () {
        return this.ssl;
    };
    MailTransportOptions.prototype.setSSL = function (enableSSL) {
        this.ssl = enableSSL;
    };
    return MailTransportOptions;
}(transOptions.transportOptions));
exports.MailTransportOptions = MailTransportOptions;
//# sourceMappingURL=mailTransportOptions.js.map