"use strict";

const babbel = require("../main");

const apiKey = "trnsl.1.1.20150814T074627Z.ed7fe3ae3b0cffa7.7338c660735915a81b7666fb9f09ffe93a7a9688";
const translator = babbel.create({ apiKey: apiKey });

const text = [
    "Igår passade jag och mamma på att utnyttja vår ensamtid.",
    "Med andra ord är det bara jag kvar här hemma och det ska firas med",
    null,
    "Mooo"
];

translator.translate(text)
    .then(function(res) {
        console.log(res);
    });