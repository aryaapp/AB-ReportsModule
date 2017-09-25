"use strict";
var moment = require("moment");
var _ = require("lodash");
var vsprintf = require('sprintf-js').vsprintf;
var locales = {
    de: {
        translation: require('../locales/de').default,
        moment: require('moment/locale/de'),
    },
};
exports.currentLocaleId = 'de';
// Cache current translation
var currentLocale = locales[exports.currentLocaleId];
// Set up moment locale globally
moment.locale(exports.currentLocaleId, currentLocale.moment);
function rawTranslation(key) {
    if (key in currentLocale.translation) {
        return currentLocale.translation[key];
    }
    var keyParts = key.split('.');
    var subTranslation = currentLocale.translation;
    for (var i = 0; i < keyParts.length; i++) {
        var keyPart = keyParts[i];
        if (keyPart in subTranslation) {
            subTranslation = subTranslation[keyPart];
        }
        else {
            //console.warn('Missing translation:', `'${key}'`, `(${currentLocale})`);
            return key;
        }
    }
    return subTranslation;
}
var I18N = (function () {
    function I18N() {
    }
    I18N.t = function (key) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        if (!key)
            return null;
        var translation = rawTranslation(key);
        if (_.isString(translation)) {
            return vsprintf(translation, args);
        }
        else if (_.isNumber(translation)) {
            return translation;
        }
        return null;
    };
    I18N.n = function (key, number) {
        if (number === 0) {
            return this.t(key + "_ZERO");
        }
        else if (number === 1) {
            return this.t(key + "_ONE");
        }
        return this.t(key + "_MULTIPLE");
        //return t(key, number);
    };
    return I18N;
}());
exports.I18N = I18N;
//# sourceMappingURL=i18n.js.map