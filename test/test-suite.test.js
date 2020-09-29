const tests = require('./test-suite')
jest.setTimeout(30000)

describe('Access Tokens', () => {
    test('get access token for xsuaa', async () => {
        console.log('TEST 1 : Get access token for XSUAA')
        const result = await tests.getAuthTokenXSUAA()
        console.log('EXPECTED RESULT : XSUAA Access Token')
        if(result.error) console.error('ACTUAL RESULT: Issue :',result.error)        
        else if(result.access_token) console.log('ACTUAL RESULT: XSUAA Access Token')
        else console.error('ACTUAL RESULT : Error :',result)
        expect(result).toMatchObject({
            "access_token": expect.any(String),
            "token_type": "bearer",
            "id_token": expect.any(String),
            "refresh_token": expect.any(String),
            "expires_in": expect.any(Number),
            "scope": expect.any(String),
            "jti": expect.any(String)
        })
    })
})

describe('Products', () => {
    test('get products', async () => {
        console.log('TEST 2 : Get products')
        const result = await tests.getProducts()
        console.log('EXPECTED RESULT : Products fetched')
        if(result.error) console.error('ACTUAL RESULT: Issue :',result.error)        
        else if(Array.isArray(result) && result.length > 0) console.log('ACTUAL RESULT: Products fetched')        
        else if(Array.isArray(result) && result.length <= 0) console.log('ACTUAL RESULT: No products fetched')        
        else console.error('ACTUAL RESULT : Error :',result)        
        expect(result).toEqual(expect.arrayContaining([
            expect.objectContaining({
                "PRODUCTID": expect.any(String),
                "PRODUCTNAME": expect.any(String),
                "CURRENCYCODE": expect.any(String),
                "CATEGORY": expect.any(String),
                "WEIGHT": expect.any(String),
                "WEIGHTUNIT": expect.any(String),
                "SHORTDESCRIPTION": expect.any(String),
                "PICTUREURL": expect.any(String),
                "PRICE": expect.any(String),
                "DIMENSIONWIDTH": expect.any(String),
                "DIMENSIONDEPTH": expect.any(String),
                "DIMENSIONHEIGHT": expect.any(String),
                "DIMENSIONUNIT": expect.any(String)
            })
        ]))
    })

    test('get stock', async () => {
        console.log('TEST 3 : Get Stock')
        const result = await tests.getStock()
        console.log('EXPECTED RESULT : Product quantity available')
        if(result.error) console.error('ACTUAL RESULT: Issue :',result.error)
        else if(result) console.log('ACTUAL RESULT: Product quantity available')
        else if(!result) console.log('ACTUAL RESULT: Product quantity not in stock')
        else console.error('ACTUAL RESULT : Error :',result)
        expect(result).toBeTruthy()
    })
})

describe('Quotations', () => {
    test('get quote', async () => {
        console.log('TEST 4 : Get quotation amount')
        const result = await tests.getQuote()
        console.log('EXPECTED RESULT : Quotation Amount is 970')
        if(result.error) console.error('ACTUAL RESULT: Issue :',result.error)
        else if(result.Cost) console.log('ACTUAL RESULT: Quotation Amount is '+result.Cost)
        else console.error('ACTUAL RESULT : Error :',result)
        expect(result).toMatchObject({ "Cost": '970' })
    })
})

describe('Orders', () => {
    test('create order', async () => {
        console.log('TEST 5 : Create Order')
        const result = await tests.createOrder()
        console.log('EXPECTED RESULT : Order Created')
        if(result == 'Order Created') console.log('ACTUAL RESULT: Order Created')
        else if(result.includes('error')){
            const res = JSON.parse(result)
            console.error('ACTUAL RESULT: Issue :',res.error)
        }
        else console.error('ACTUAL RESULT : Error :',result)
        expect(result).toBe('Order Created')
    })

    test('update stock', async () => {
        console.log('TEST 6 : Update Stock')
        const result = await tests.updateStock()
        console.log('EXPECTED RESULT : Stock Updated')
        if(result == 'Stock Updated') console.log('ACTUAL RESULT: Stock Updated')
        else if(result.includes('error')){
            const res = JSON.parse(result)
            console.error('ACTUAL RESULT: Issue :',res.error)
        }
        else console.error('ACTUAL RESULT : Error :',result)
        expect(result).toBe('Stock Updated')
    })
})

describe('Freight Manager', () => {
    test('get access token for freight service', async() => {
        console.log('TEST 7 : Get access token for Freight Service')
        const result = await tests.getAuthTokenFreightService()
        console.log('EXPECTED RESULT : XSUAA Access Token for Freight Service')
        if(result.error) console.error('ACTUAL RESULT: Issue :',result.error)
        else if(result.access_token) console.log('ACTUAL RESULT: XSUAA Access Token for Freight Service')
        else console.error('ACTUAL RESULT : Error :',result)
        expect(result).toMatchObject({
            "access_token": expect.any(String),
            "token_type": "bearer",
            "expires_in": expect.any(Number),
            "scope": expect.any(String),
            "jti": expect.any(String)
        })
    })

    test('check freight service', async () => {
        console.log('TEST 8 : Check Freight Service')
        const result = await tests.checkFreightService()
        console.log('EXPECTED RESULT : Quotation Amount is 970')
        if(result.includes('error')){
            const res = JSON.parse(result)
            console.error('ACTUAL RESULT: Issue :',res.error)
        }
        else if(result) console.log('ACTUAL RESULT: Quotation Amount is '+result)
        else console.error('ACTUAL RESULT : Error :',result)
        expect(result).toBe('970')
    })
})
