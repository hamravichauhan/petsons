"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var config_1 = require("@nestjs/config");
exports.default = (0, config_1.registerAs)('jwt', function () { return ({
    secret: process.env.JWT_SECRET || 'patson-dev-secret',
    expiresIn: process.env.JWT_EXPIRATION || '24h',
}); });
