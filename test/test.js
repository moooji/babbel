"use strict";

const babbel = require("../main");

const apiKey = "...";
const translator = babbel.create({ apiKey: apiKey });

const text = [
    "igår passade jag och mamma på att utnyttja vår ensamtid.",
    "Med andra ord är det bara jag kvar här hemma och det ska firas med",
    null,
    "Mooo",
    "igår"
];

translator.translate(text)
    .then(function(res) {
        console.log(res);
    });