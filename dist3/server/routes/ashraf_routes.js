"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//  routes file
var express_1 = __importDefault(require("express"));
var ashraf_metrics_controller = require('../controllers/ashraf_metrics');
var router = express_1.default.Router();
router.get('/memoryUsage/:startTime/:endTime', ashraf_metrics_controller.getMemoryUsage, function (req, res, next) {
});
router.get('/cpuUsagePercentage/:startTime/:endTime', ashraf_metrics_controller.getCpuUsagePercentage, function (req, res, next) {
});
router.get('/totalMemory/:startTime/:endTime', ashraf_metrics_controller.getTotalMemory, function (req, res, next) {
});
router.get('/cores/:startTime/:endTime', ashraf_metrics_controller.getCores, function (req, res, next) {
});
module.exports = router;
