"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var transOptions = require("./transportOptions");
/*options for files*/
var FileTransportOptions = (function (_super) {
    __extends(FileTransportOptions, _super);
    function FileTransportOptions(level, filename) {
        var _this = _super.call(this, level) || this;
        _this.parseParametres(level, filename);
        return _this;
    }
    FileTransportOptions.prototype.parseParametres = function (level, filename) {
        if (level !== null && level !== undefined)
            this.setLevel(level);
        else
            this.setLevel('error');
        if (filename !== null && filename !== undefined)
            this.filename = filename;
        else
            this.filename = filename;
    };
    FileTransportOptions.prototype.getFileName = function () {
        return this.filename;
    };
    FileTransportOptions.prototype.setFileName = function (filename) {
        this.filename = filename;
    };
    return FileTransportOptions;
}(transOptions.transportOptions));
exports.FileTransportOptions = FileTransportOptions;
//# sourceMappingURL=fileTransportOptions.js.map