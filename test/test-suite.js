const config = require('./config')
const util = require('./util')

let xsuaa_access_token, access_token_freight_service;

async function getAuthTokenXSUAA(){
    const req_url = config.token_url
    const req_headers = { 'Content-Type': 'application/x-www-form-urlencoded' }
    console.log('REQUEST URL: POST', req_url)
    console.log('REQUEST HEADERS:', req_headers)
    try{
        const response = await util.requestHandler({
            url: req_url,
            method: 'POST',
            body: util.urlEncodeParams(config.xsuaa),
            headers: req_headers
        })
        console.log('RESPONSE STATUS:', response.status)
        const json = await response.json()
        console.log('RESPONSE BODY:',json)
        if(json.access_token) xsuaa_access_token = json.access_token
        return json
    } catch(err) {
        return err
    }
}

async function getProducts(){
    const req_url = config.product_service_url+'/getProducts'
    const req_headers = { 'Authorization':'Bearer '+ xsuaa_access_token }
    console.log('REQUEST URL: GET', req_url)
    try{
        const response = await util.requestHandler({
            url: req_url,
            method: 'GET',
            headers: req_headers
        })
        console.log('RESPONSE STATUS:', response.status)
        const json = await response.json()
        console.log('RESPONSE BODY:',json)
        return json
    }
    catch(err) {
        return err
    }
}

async function getStock(){
    let req_url = config.product_service_url+'/stock'
    const req_headers = { 'Authorization':'Bearer '+ xsuaa_access_token }
    let params = { productId: 'HT-1000', quantity: 1 }
    req_url = util.parameteriseUrl(req_url, params)
    console.log('REQUEST URL: GET', req_url)
    try {
        const response = await util.requestHandler({
            url: req_url,
            method: 'GET',
            headers: req_headers
        })
        console.log('RESPONSE STATUS:', response.status)
        const json = await response.json()
        console.log('RESPONSE BODY:',json)
        return json
    }
    catch(err){
        return err
    }
}

async function getQuote(){
    let req_url = config.logistic_service_url+'/getQuote'
    const req_headers = { 'Authorization':'Bearer '+ xsuaa_access_token }
    let params = {
        mode: 'RAIL',
        productId: 'HT-1000',
        quantity: 1,
        totalDistanceMeasured: 50,
        weight: 0.4,
        dimension: '0.2410,0.1050,0.1190'
    }
    req_url = util.parameteriseUrl(req_url,params)
    console.log('REQUEST URL: GET', req_url)
    try{
        const response = await util.requestHandler({
            url: req_url,
            method: 'GET',
            headers: req_headers
        })
        console.log('RESPONSE STATUS:', response.status)
        let json;
        if(response.status == '200') json = await response.json()
        else json = { 'error' : 'Product is out of stock'}
        console.log('RESPONSE BODY:',json)
        return json
    }
    catch(err){
        return err
    }
}

async function createOrder(){
    const req_url = config.logistic_service_url+'/order'
    const req_headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+xsuaa_access_token
    }
    const req_body = {
        "contactPerson":"Steve",
        "address":"444 ABC TOWN, MUNICH",
        "phone":"9876543210",
        "countryCode":"DU",
        "email":"steve.wozniak@sap.com",
        "totalDistanceMeasured":50,
        "productName":"ADSL progress T1",
        "productId":"HT-1117",
        "quantity":1,
        "grossWeight":0.4,
        "transportationMeansType":"RAIL",
        "lifecyclestatus":"A",
        "pickupdate":"20200721",
        "deliverydate":"20200721",
        "transportationCharges":970,
        "currencycode":"EUR"
    }
    console.log('REQUEST URL: POST', req_url)
    console.log('REQUEST BODY:', req_body)
    try{
        const response = await util.requestHandler({
            url: req_url,
            method: 'POST',
            headers: req_headers,
            body: JSON.stringify(req_body)
        })
        console.log('RESPONSE STATUS:', response.status)
        const text = await response.text()
        console.log('RESPONSE BODY:',text)
        return text
    }
    catch(err){
        return err
    }
}

async function updateStock(){
    let req_url = config.product_service_url+'/stock'
    const req_headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+xsuaa_access_token
    }
    let params = {
        productId : 'HT-1000',
        quantity : 1
    }
    req_url = util.parameteriseUrl(req_url,params)
    console.log('REQUEST URL: PUT', req_url)
    try{
        const response = await util.requestHandler({
            url: req_url,
            method: 'PUT',
            headers: req_headers
        })
        console.log('RESPONSE STATUS:', response.status)
        const text = await response.text()
        console.log('RESPONSE BODY:',text)
        return text
    }
    catch(err){
        return err
    }
}

async function getAuthTokenFreightService(){
    const req_url = config.token_url
    const req_headers = { 'Content-Type': 'application/x-www-form-urlencoded' }
    console.log('REQUEST URL: POST', req_url)
    console.log('REQUEST HEADERS:', req_headers)
    try{
        const response = await util.requestHandler({
            url: req_url,
            method: 'POST',
            body: util.urlEncodeParams(config.freight_service_config),
            headers: req_headers
        })
        console.log('RESPONSE STATUS:', response.status)
        const json = await response.json()
        console.log('RESPONSE BODY:',json)
        if(json.access_token) access_token_freight_service = json.access_token
        return json
    }
    catch(err){
        return err
    }
}

async function checkFreightService(){
    let req_url = config.freight_service_url+'/'
    const req_headers = { 'Authorization':'Bearer '+ access_token_freight_service }
    let params = {
        transportationmeans: 'RAIL',
        quantity: 1,
        totalDistanceMeasured: 50,
        weight: 0.4,
        dimension: '0.2410,0.1050,0.1190'
    }
    req_url = util.parameteriseUrl(req_url,params)
    console.log('REQUEST URL: GET', req_url)
    try{
        const response = await util.requestHandler({
            url: req_url,
            method: 'GET',
            headers: req_headers
        })
        console.log('RESPONSE STATUS:', response.status)
        const text = await response.text()
        console.log('RESPONSE BODY:',text)
        return text
    }
    catch(err){
        return err
    }
}

module.exports = { getAuthTokenXSUAA, getProducts, getStock, getQuote, createOrder, updateStock, getAuthTokenFreightService, checkFreightService }