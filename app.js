const cheerio = require('cheerio');
const request = require("request-promise")
const fs = require("fs")
const path = require('path');
const express = require("express")
const app = express()

const url = "https://www.linio.com.pe/c/portatiles/laptops"
const scrappingData = async () => {
    const $ = await request({
        uri: url,
        transform: body => cheerio.load(body)
    })
    const data = []
    $('.catalogue-product').each((i, el)=>{
        const name = $(el).find("div .detail-container p span").html()
        const img = $(el).find("div .image-container figure picture img")[0].attribs.src;
        const price = $(el).find(".price-main-md").text()
        const freeShipping = $(el).find(".badge-pill-free-shipping").html()
        data.push({id: i, name, img, price, freeShipping})
    })
    fs.writeFile("txt.js", JSON.stringify(data), (err)=> {
        if (err) throw err;
        console.log("Saved!");
    })
    // console.log(data);
    
}
scrappingData();
app.get('/', (req, res) => {
    res.sendFile("txt.js", { root: path.join(__dirname, './') });
  })

app.listen(3000, () => {
    console.log("Listening in port 3000");
})