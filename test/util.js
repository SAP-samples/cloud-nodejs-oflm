'use strict';
const fetch = require('node-fetch');
const qs = require('qs');

class Util {

    static urlEncodeParams(params){
        return qs.stringify(params)
    }

    static parameteriseUrl(url,params){
        params = this.urlEncodeParams(params)
        return url+'?'+params
    }

    static async requestHandler(options){
        try {
            let res = await fetch(options.url, {
                method: options.method,
                headers: options.headers,
                body: options.body
            })
            return res;
            
        } catch (err) {
            throw err;
        }
    }
}

module.exports = Util