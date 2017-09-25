import moment = require('moment');
import _ = require('lodash');
var vsprintf = require('sprintf-js').vsprintf;


const locales = {
    de: {
        translation: require('../locales/de').default,
        moment: require('moment/locale/de'),
    },
};

export const currentLocaleId = 'de';

// Cache current translation
const currentLocale = locales[currentLocaleId];

// Set up moment locale globally
moment.locale(currentLocaleId, currentLocale.moment);

function rawTranslation(key) {
    if (key in currentLocale.translation) {
        return currentLocale.translation[key];
    }

    let keyParts = key.split('.');
    let subTranslation = currentLocale.translation;
    for (let i = 0; i < keyParts.length; i++) {
        let keyPart = keyParts[i];
        if (keyPart in subTranslation) {
            subTranslation = subTranslation[keyPart];
        } else {
            //console.warn('Missing translation:', `'${key}'`, `(${currentLocale})`);
            return key;
        }
    }
    return subTranslation;
}

export class I18N {

    

    public static t(key, ...args) {
        if (!key) return null;
        let translation = rawTranslation(key);

        if (_.isString(translation)) {
            return vsprintf(translation, args);
        } else if (_.isNumber(translation)) {
            return translation;
        }
        return null;
    }

    public static n(key, number) {
        if (number === 0) {
            return this.t(`${key}_ZERO`);
        } else if (number === 1) {
            return this.t(`${key}_ONE`);
        }
        return this.t(`${key}_MULTIPLE`);

        //return t(key, number);
    }
}


