"use strict";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
var common_1 = require("@nestjs/common");
var AuthService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var AuthService = _classThis = /** @class */ (function () {
        function AuthService_1(orgRepo, configService) {
            this.orgRepo = orgRepo;
            this.configService = configService;
            this.logger = new common_1.Logger(AuthService.name);
        }
        AuthService_1.prototype.register = function (dto) {
            return __awaiter(this, void 0, void 0, function () {
                var existing, clerkUser, err_1, organization;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.orgRepo.findOne({
                                where: { taxIdentifier: dto.taxIdentifier },
                            })];
                        case 1:
                            existing = _a.sent();
                            if (existing) {
                                throw new common_1.ConflictException('Organization with this tax ID already exists');
                            }
                            _a.label = 2;
                        case 2:
                            _a.trys.push([2, 4, , 5]);
                            return [4 /*yield*/, this.createClerkUser(dto)];
                        case 3:
                            clerkUser = _a.sent();
                            this.logger.log("Clerk user created: ".concat(clerkUser.id));
                            return [3 /*break*/, 5];
                        case 4:
                            err_1 = _a.sent();
                            this.logger.error('Clerk error:', err_1.message);
                            throw new common_1.BadRequestException(err_1.message);
                        case 5:
                            organization = this.orgRepo.create({
                                legalName: dto.legalName,
                                taxIdentifier: dto.taxIdentifier,
                                taxIdentifierType: dto.taxIdentifierType,
                                businessType: dto.businessType,
                                tier: 'PENDING',
                                verificationStatus: 'PENDING',
                                isActive: false,
                            });
                            return [4 /*yield*/, this.orgRepo.save(organization)];
                        case 6:
                            _a.sent();
                            this.logger.log("Organization created: ".concat(organization.id));
                            return [4 /*yield*/, this.updateClerkMetadata(clerkUser.id, organization.id)];
                        case 7:
                            _a.sent();
                            return [2 /*return*/, {
                                    message: 'Registration submitted. Awaiting verification.',
                                    organizationId: organization.id,
                                    status: 'PENDING',
                                }];
                    }
                });
            });
        };
        AuthService_1.prototype.createClerkUser = function (dto) {
            return __awaiter(this, void 0, void 0, function () {
                var clerkKey, username, userData, response, data, msg;
                var _a, _b, _c, _d;
                return __generator(this, function (_e) {
                    switch (_e.label) {
                        case 0:
                            clerkKey = this.configService.get('CLERK_SECRET_KEY');
                            username = dto.email.split('@')[0].replace(/[^a-zA-Z0-9_-]/g, '');
                            userData = {
                                first_name: dto.firstName,
                                last_name: dto.lastName,
                                password: dto.password,
                                email_address: [dto.email],
                                username: username,
                                public_metadata: {
                                    tier: 'PENDING',
                                    role: 'ORG_ADMIN',
                                },
                            };
                            this.logger.log('Creating Clerk user: ' + username);
                            return [4 /*yield*/, fetch('https://api.clerk.com/v1/users', {
                                    method: 'POST',
                                    headers: {
                                        'Authorization': "Bearer ".concat(clerkKey),
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify(userData),
                                })];
                        case 1:
                            response = _e.sent();
                            return [4 /*yield*/, response.json()];
                        case 2:
                            data = _e.sent();
                            if (!response.ok) {
                                this.logger.error('Clerk error:', JSON.stringify(data));
                                msg = ((_b = (_a = data === null || data === void 0 ? void 0 : data.errors) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.long_message) || ((_d = (_c = data === null || data === void 0 ? void 0 : data.errors) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.message) || 'Failed';
                                throw new Error(msg);
                            }
                            return [2 /*return*/, data];
                    }
                });
            });
        };
        AuthService_1.prototype.updateClerkMetadata = function (userId, orgId) {
            return __awaiter(this, void 0, void 0, function () {
                var clerkKey;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            clerkKey = this.configService.get('CLERK_SECRET_KEY');
                            return [4 /*yield*/, fetch("https://api.clerk.com/v1/users/".concat(userId, "/metadata"), {
                                    method: 'PATCH',
                                    headers: {
                                        'Authorization': "Bearer ".concat(clerkKey),
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify({
                                        public_metadata: {
                                            organizationId: orgId,
                                            tier: 'PENDING',
                                            role: 'ORG_ADMIN',
                                        },
                                    }),
                                })];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        return AuthService_1;
    }());
    __setFunctionName(_classThis, "AuthService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AuthService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AuthService = _classThis;
}();
exports.AuthService = AuthService;
