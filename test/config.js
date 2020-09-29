 const logistics_cred = require('./logistic_env')
 const product_cred = require('./product_env')
 const freight_cred = require('./freight_env')
 const vcap = logistics_cred.system_env_json.VCAP_SERVICES;
 const vcap2 = freight_cred.system_env_json.VCAP_SERVICES;
 const logistics_appenv = logistics_cred.application_env_json.VCAP_APPLICATION;
 const product_appenv = product_cred.application_env_json.VCAP_APPLICATION;
 const freight_appenv = freight_cred.application_env_json.VCAP_APPLICATION;


module.exports = {
    "token_url": vcap.xsuaa[0].credentials.url + '/oauth/token',
    "logistic_service_url": 'https://' + logistics_appenv.application_uris[0],
    "product_service_url": 'https://' + product_appenv.application_uris[0],
    "freight_service_url": 'https://' + freight_appenv.application_uris[0],
    "xsuaa": {
        "grant_type": "password",
        "client_id": vcap.xsuaa[0].credentials.clientid,
        "client_secret": vcap.xsuaa[0].credentials.clientsecret,
        "username": process.env.pusername,
        "password": process.env.puserpwd
    },
    "freight_service_config": {
        "grant_type": "client_credentials",
        "client_id": vcap.xsuaa[0].credentials.clientid,
        "client_secret": vcap.xsuaa[0].credentials.clientsecret
    }
}
