"use strict";

const translationProvider = require("../main");

const apiKey = "...";
const translation = new translationProvider(apiKey);

const text = [
    "Igår passade jag och mamma på att utnyttja vår ensamtid.",
    "Med andra ord är det bara jag kvar här hemma och det ska firas med",
    null,
    "Mooo"
];

translation.translate(text)
    .then(function(res) {
        console.log(res);
    });

