
const axios2 = require("axios");

const BACKEND_URL = "http://localhost:3000"
const WS_URL = "ws://localhost:3001"

const axios = {
    post: async (...args) => {
        try {
            const res = await axios2.post(...args)
            return res
        } catch(e) {
            return e.response
        }
    },
    get: async (...args) => {
        try {
            const res = await axios2.get(...args)
            return res
        } catch(e) {
            return e.response
        }
    },
    put: async (...args) => {
        try {
            const res = await axios2.put(...args)
            return res
        } catch(e) {
            return e.response
        }
    },
    delete: async (...args) => {
        try {
            const res = await axios2.delete(...args)
            return res
        } catch(e) {
            return e.response
        }
    },
}


describe("Authentication", ()=>{
    test("user is able to signup ",async()=>{
        const username = "name"+Math.random();
        const password = "password";
        const name = "name";
        const email = username+"@email.com";
        const profilePic = "https://profile-pic-url.com"
        const resp = await axios.post(`${BACKEND_URL}/api/v1/signup`,{
            name,username,password, email, profilePic
        })

        expect(resp.status).toBe(200)


    })
})