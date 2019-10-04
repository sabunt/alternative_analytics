'use strict'

import { version } from './package.json'
// const version = require('./package.json').version

class Analytics {

    
    constructor (options) {
        /**
         * Initialize a new `Analytics` with your
         * optional dictionary of `options`.
         *
         * @param {Object} [options] (optional)
         *   @property {Number} visit_ttl (default: 30)
         *   @property {Number} visitor_ttl (default: 535600)
         *   @property {String} host (default: 'http://localhost:3000')
         *   @property {String} statistic_url (default: '/analytics/create')
         *   @property {String} statistic_event_url (default: '/analytics_properties/create')
         *   @property {Boolean} enable (default: true)
         */


        options = options || {}

        self.visit_ttl = (options.visit_ttl || 30) // 30mins
        self.visitor_ttl = (options.visitor_ttl || 1 * 365 * 24 * 60) // 1 year
        self.can_stringify = typeof(JSON) != "undefined" && typeof(JSON.stringify) != "undefined"
        self.host = (options.host || window.location.hostname)
        self.utm = window.location.search.substring(1)
        self.statistic_url = (options.statistic_url || '/analytics/create')
        self.statistic_event_url= (options.statistic_event_url || '/analytics_properties/create')
        self.res_id = undefined
        Object.defineProperty(this, 'enable', {
            configurable: false,
            writable: false,
            enumerable: true,
            value: typeof options.enable === 'boolean' ? options.enable : true
        })
    }

    generate_id () {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r, v
            r = Math.random() * 16 | 0
            v = c === 'x' ? r : r & 0x3 | 0x8
            return v.toString(16)
        })
    }

    set_cookie (name, value, ttl) {
        var cookie_domain, date, expires
        if (ttl) {
            date = new Date
            date.setTime(date.getTime() + ttl * 60 * 1000)
            expires = '; expires=' + date.toGMTString()
        }
        cookie_domain = '; domain=' + domain
        return document.cookie = (name + "=") + escape(value) + expires + cookie_domain + '; path=/'

    }

    get_cookie (name) {
        var c, ca, i, name_eq
        name_eq = name + "="
        ca = document.cookie.split(';')
        i = 0
        while (i < ca.length) {
            c = ca[i]
            while (c.charAt(0) === ' ') {
            c = c.substring(1, c.length)
            }
            if (c.indexOf(name_eq) === 0) {
            return unescape(c.substring(name_eq.length, c.length))
            }
            i++
        }
        return null
    }

    destroy_cookie (name) {
        return set_cookie(name, '', -1)
    }

    bot_check () {
        var bot_pattern, re, user_agent
        bot_pattern = '(googlebot/|Googlebot-Mobile|Googlebot-Image|Google favicon|Mediapartners-Google|bingbot|slurp|java|wget|curl|Commons-HttpClient|Python-urllib|libwww|httpunit|nutch|phpcrawl|msnbot|jyxobot|FAST-WebCrawler|FAST Enterprise Crawler|biglotron|teoma|convera|seekbot|gigablast|exabot|ngbot|ia_archiver|GingerCrawler|webmon |httrack|webcrawler|grub.org|UsineNouvelleCrawler|antibot|netresearchserver|speedy|fluffy|bibnum.bnf|findlink|msrbot|panscient|yacybot|AISearchBot|IOI|ips-agent|tagoobot|MJ12bot|dotbot|woriobot|yanga|buzzbot|mlbot|yandexbot|purebot|Linguee Bot|Voyager|CyberPatrol|voilabot|baiduspider|citeseerxbot|spbot|twengabot|postrank|turnitinbot|scribdbot|page2rss|sitebot|linkdex|Adidxbot|blekkobot|ezooms|dotbot|Mail.RU_Bot|discobot|heritrix|findthatfile|europarchive.org|NerdByNature.Bot|sistrix crawler|ahrefsbot|Aboundex|domaincrawler|wbsearchbot|summify|ccbot|edisterbot|seznambot|ec2linkfinder|gslfbot|aihitbot|intelium_bot|facebookexternalhit|yeti|RetrevoPageAnalyzer|lb-spider|sogou|lssbot|careerbot|wotbox|wocbot|ichiro|DuckDuckBot|lssrocketcrawler|drupact|webcompanycrawler|acoonbot|openindexspider|gnam gnam spider|web-archive-net.com.bot|backlinkcrawler|coccoc|integromedb|content crawler spider|toplistbot|seokicks-robot|it2media-domain-crawler|ip-web-crawler.com|siteexplorer.info|elisabot|proximic|changedetection|blexbot|arabot|WeSEE:Search|niki-bot|CrystalSemanticsBot|rogerbot|360Spider|psbot|InterfaxScanBot|Lipperhey SEO Service|CC Metadata Scaper|g00g1e.net|GrapeshotCrawler|urlappendbot|brainobot|fr-crawler|binlar|SimpleCrawler|Livelapbot|Twitterbot|cXensebot|smtbot|bnf.fr_bot|A6-Indexer|ADmantX|Facebot|Twitterbot|OrangeBot|memorybot|AdvBot|MegaIndex|SemanticScholarBot|ltx71|nerdybot|xovibot|BUbiNG|Qwantify|archive.org_bot|Applebot|TweetmemeBot|crawler4j|findxbot|SemrushBot|yoozBot|lipperhey|y!j-asr|Domain Re-Animator Bot|AddThis)'
        re = new RegExp(bot_pattern, 'i')
        user_agent = navigator.userAgent
        if (re.test(user_agent)) {
            return true
        } else {
            return false
        }
    }

}