import express from "express";
import axios from "axios";

const url = "https://www.google.com/search?q=libra+esterlina&oq=libra+es&gs_lcrp=EgZjaHJvbWUqCggBEAAYsQMYgAQyBggAEEUYOTIKCAEQABixAxiABDIHCAIQABiABDIHCAMQABiABDIHCAQQABiABDIHCAUQABiABDIHCAYQABiABDIGCAcQRRg90gEINDI5NmowajeoAgCwAgA&sourceid=chrome&ie=UTF-8" 
const url2 = "https://wise.com/mx/currency-converter/gbp-to-mxn-rate?amount=1";

async function scrape() {
    try {
        const response = await axios.get(url2);
        const html =  response.data;
        console.log(html);
    } catch (error) {
        console.log("Error:", error);
    }
}

scrape();