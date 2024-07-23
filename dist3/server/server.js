"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var path_1 = __importDefault(require("path"));
require('dotenv').config();
var fetch = require('node-fetch');
var app = (0, express_1.default)();
app.use(express_1.default.static(path_1.default.join(__dirname, '../../public')));
var ashraf_metrics = require('./routes/ashraf_routes');
app.use('/metrics', ashraf_metrics);
app.get('/', function (req, res, next) {
    try {
        res.send('index.html');
    }
    catch (error) {
        next(error);
    }
});
app.get('/api/', function (req, res) {
    res.json({ AppName: 'Master-Harbor' });
});
var PORT = 3000;
app.listen(PORT, function () {
    console.log("App listening on port ".concat(PORT));
});
