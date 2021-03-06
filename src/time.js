import { default as languages, fill as fillFallbacks } from './languages.js'
import { lookup } from './generated-lookup-time-format.js'

const lookupMapping = fillFallbacks(lookup);

export function intlMonths(lang, fmt) {
    if (lang === undefined) {
        lang = navigator.language;
    }
    let formatter = null;

    if (window.Intl !== undefined) {
        formatter = new Intl.DateTimeFormat(lang, {
            month: fmt,
            timeZone: 'UTC'
        });
    } else {
        formatter = {
            format: function(date) {
                return date.toUTCString().split(' ')[2]
            }
        }
    }
    return Array.apply(null, Array(12)).map(function(_, i) {
        return formatter.format(new Date(Date.UTC(2014, i, 7)));
    });
}

export function intlWeekday(lang, fmt) {
    if (lang === undefined) {
        lang = navigator.language;
    }
    let formatter = null;

    if (window.Intl !== undefined) {
        formatter = new Intl.DateTimeFormat(lang, {
            weekday: fmt,
            timeZone: 'UTC'
        });
    } else {
        formatter = {
            format: function(date) {
                return date.toUTCString().split(' ')[0].substring(0, 3)
            }
        }
    }
    return Array.apply(null, Array(7)).map(function(_, i) {
        return formatter.format(new Date(Date.UTC(2014, 1, i + 2)));
    });
}

export default function time(iso) {
    let lang = languages(iso);

    for (let i = 0; i < lang.length; ++i) {
        let key = lang[i];
        let fmt = lookupMapping[key];
        if (fmt) return { d3: fmt, iso639: key.replace('_', '-') };    
    }
    
    // default to US english
    return { d3: lookup.en_US, iso639: 'en-US'};
}
