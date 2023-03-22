const axios = require("axios");
const baseURL = require("./config").MAYA_PAC_URL
module.exports = axios.create({
    baseURL: baseURL,
});
