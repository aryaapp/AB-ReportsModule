"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var transpOptions = require("./transportOptions");
var ConsoleTransportOptions = (function (_super) {
    __extends(ConsoleTransportOptions, _super);
    function ConsoleTransportOptions(level) {
        return _super.call(this, level) || this;
    }
    return ConsoleTransportOptions;
}(transpOptions.transportOptions));
exports.ConsoleTransportOptions = ConsoleTransportOptions;
//# sourceMappingURL=consoleTransportOptions.js.map