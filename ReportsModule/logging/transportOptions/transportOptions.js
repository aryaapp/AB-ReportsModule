"use strict";
var transportOptions = (function () {
    function transportOptions(level) {
        this.level = level;
    }
    transportOptions.prototype.getLevel = function () {
        return this.level;
    };
    transportOptions.prototype.setLevel = function (level) {
        this.level = level;
    };
    return transportOptions;
}());
exports.transportOptions = transportOptions;
//# sourceMappingURL=transportOptions.js.map