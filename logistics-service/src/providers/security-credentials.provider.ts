import * as xsenv from '@sap/xsenv';
const xsCredentials = xsenv.cfServiceCredentials({tag: 'xsuaa'});    
/**
 * exports client credentials from vcap
 */
export const ServiceCredentials = [{ "clientId": xsCredentials.clientid, "clientSecret": xsCredentials.clientsecret,"url": xsCredentials.url }];
