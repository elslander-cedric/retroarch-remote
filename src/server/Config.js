"use strict";
var fs = require("fs");
var Config = (function () {
    function Config() {
    }
    Config.prototype.init = function () {
        this.config = JSON.parse(fs.readFileSync('config.json', 'utf-8'));
        return this;
    };
    Config.prototype.get = function (name) {
        return this.config[name];
    };
    return Config;
}());
exports.Config = Config;
