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
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Organization = void 0;
var typeorm_1 = require("typeorm");
var Organization = function () {
    var _classDecorators = [(0, typeorm_1.Entity)('organizations')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _id_decorators;
    var _id_initializers = [];
    var _id_extraInitializers = [];
    var _legalName_decorators;
    var _legalName_initializers = [];
    var _legalName_extraInitializers = [];
    var _taxIdentifier_decorators;
    var _taxIdentifier_initializers = [];
    var _taxIdentifier_extraInitializers = [];
    var _taxIdentifierType_decorators;
    var _taxIdentifierType_initializers = [];
    var _taxIdentifierType_extraInitializers = [];
    var _businessType_decorators;
    var _businessType_initializers = [];
    var _businessType_extraInitializers = [];
    var _tier_decorators;
    var _tier_initializers = [];
    var _tier_extraInitializers = [];
    var _verificationStatus_decorators;
    var _verificationStatus_initializers = [];
    var _verificationStatus_extraInitializers = [];
    var _creditLimit_decorators;
    var _creditLimit_initializers = [];
    var _creditLimit_extraInitializers = [];
    var _paymentTerms_decorators;
    var _paymentTerms_initializers = [];
    var _paymentTerms_extraInitializers = [];
    var _isActive_decorators;
    var _isActive_initializers = [];
    var _isActive_extraInitializers = [];
    var _createdAt_decorators;
    var _createdAt_initializers = [];
    var _createdAt_extraInitializers = [];
    var _updatedAt_decorators;
    var _updatedAt_initializers = [];
    var _updatedAt_extraInitializers = [];
    var _version_decorators;
    var _version_initializers = [];
    var _version_extraInitializers = [];
    var Organization = _classThis = /** @class */ (function () {
        function Organization_1() {
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.legalName = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _legalName_initializers, void 0));
            this.taxIdentifier = (__runInitializers(this, _legalName_extraInitializers), __runInitializers(this, _taxIdentifier_initializers, void 0));
            this.taxIdentifierType = (__runInitializers(this, _taxIdentifier_extraInitializers), __runInitializers(this, _taxIdentifierType_initializers, void 0));
            this.businessType = (__runInitializers(this, _taxIdentifierType_extraInitializers), __runInitializers(this, _businessType_initializers, void 0));
            this.tier = (__runInitializers(this, _businessType_extraInitializers), __runInitializers(this, _tier_initializers, void 0));
            this.verificationStatus = (__runInitializers(this, _tier_extraInitializers), __runInitializers(this, _verificationStatus_initializers, void 0));
            this.creditLimit = (__runInitializers(this, _verificationStatus_extraInitializers), __runInitializers(this, _creditLimit_initializers, void 0));
            this.paymentTerms = (__runInitializers(this, _creditLimit_extraInitializers), __runInitializers(this, _paymentTerms_initializers, void 0));
            this.isActive = (__runInitializers(this, _paymentTerms_extraInitializers), __runInitializers(this, _isActive_initializers, void 0));
            this.createdAt = (__runInitializers(this, _isActive_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
            this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
            this.version = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _version_initializers, void 0));
            __runInitializers(this, _version_extraInitializers);
        }
        return Organization_1;
    }());
    __setFunctionName(_classThis, "Organization");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _id_decorators = [(0, typeorm_1.PrimaryGeneratedColumn)('uuid')];
        _legalName_decorators = [(0, typeorm_1.Column)({ name: 'legal_name', length: 255 })];
        _taxIdentifier_decorators = [(0, typeorm_1.Column)({ name: 'tax_identifier', length: 100, unique: true })];
        _taxIdentifierType_decorators = [(0, typeorm_1.Column)({ name: 'tax_identifier_type', length: 20 })];
        _businessType_decorators = [(0, typeorm_1.Column)({ name: 'business_type', length: 50 })];
        _tier_decorators = [(0, typeorm_1.Column)({ length: 20, default: 'PENDING' })];
        _verificationStatus_decorators = [(0, typeorm_1.Column)({ name: 'verification_status', length: 20, default: 'PENDING' })];
        _creditLimit_decorators = [(0, typeorm_1.Column)({ name: 'credit_limit', type: 'decimal', precision: 15, scale: 2, default: 0 })];
        _paymentTerms_decorators = [(0, typeorm_1.Column)({ name: 'payment_terms', length: 20, default: 'PREPAID' })];
        _isActive_decorators = [(0, typeorm_1.Column)({ name: 'is_active', default: false })];
        _createdAt_decorators = [(0, typeorm_1.CreateDateColumn)({ name: 'created_at' })];
        _updatedAt_decorators = [(0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' })];
        _version_decorators = [(0, typeorm_1.VersionColumn)()];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: function (obj) { return "id" in obj; }, get: function (obj) { return obj.id; }, set: function (obj, value) { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _legalName_decorators, { kind: "field", name: "legalName", static: false, private: false, access: { has: function (obj) { return "legalName" in obj; }, get: function (obj) { return obj.legalName; }, set: function (obj, value) { obj.legalName = value; } }, metadata: _metadata }, _legalName_initializers, _legalName_extraInitializers);
        __esDecorate(null, null, _taxIdentifier_decorators, { kind: "field", name: "taxIdentifier", static: false, private: false, access: { has: function (obj) { return "taxIdentifier" in obj; }, get: function (obj) { return obj.taxIdentifier; }, set: function (obj, value) { obj.taxIdentifier = value; } }, metadata: _metadata }, _taxIdentifier_initializers, _taxIdentifier_extraInitializers);
        __esDecorate(null, null, _taxIdentifierType_decorators, { kind: "field", name: "taxIdentifierType", static: false, private: false, access: { has: function (obj) { return "taxIdentifierType" in obj; }, get: function (obj) { return obj.taxIdentifierType; }, set: function (obj, value) { obj.taxIdentifierType = value; } }, metadata: _metadata }, _taxIdentifierType_initializers, _taxIdentifierType_extraInitializers);
        __esDecorate(null, null, _businessType_decorators, { kind: "field", name: "businessType", static: false, private: false, access: { has: function (obj) { return "businessType" in obj; }, get: function (obj) { return obj.businessType; }, set: function (obj, value) { obj.businessType = value; } }, metadata: _metadata }, _businessType_initializers, _businessType_extraInitializers);
        __esDecorate(null, null, _tier_decorators, { kind: "field", name: "tier", static: false, private: false, access: { has: function (obj) { return "tier" in obj; }, get: function (obj) { return obj.tier; }, set: function (obj, value) { obj.tier = value; } }, metadata: _metadata }, _tier_initializers, _tier_extraInitializers);
        __esDecorate(null, null, _verificationStatus_decorators, { kind: "field", name: "verificationStatus", static: false, private: false, access: { has: function (obj) { return "verificationStatus" in obj; }, get: function (obj) { return obj.verificationStatus; }, set: function (obj, value) { obj.verificationStatus = value; } }, metadata: _metadata }, _verificationStatus_initializers, _verificationStatus_extraInitializers);
        __esDecorate(null, null, _creditLimit_decorators, { kind: "field", name: "creditLimit", static: false, private: false, access: { has: function (obj) { return "creditLimit" in obj; }, get: function (obj) { return obj.creditLimit; }, set: function (obj, value) { obj.creditLimit = value; } }, metadata: _metadata }, _creditLimit_initializers, _creditLimit_extraInitializers);
        __esDecorate(null, null, _paymentTerms_decorators, { kind: "field", name: "paymentTerms", static: false, private: false, access: { has: function (obj) { return "paymentTerms" in obj; }, get: function (obj) { return obj.paymentTerms; }, set: function (obj, value) { obj.paymentTerms = value; } }, metadata: _metadata }, _paymentTerms_initializers, _paymentTerms_extraInitializers);
        __esDecorate(null, null, _isActive_decorators, { kind: "field", name: "isActive", static: false, private: false, access: { has: function (obj) { return "isActive" in obj; }, get: function (obj) { return obj.isActive; }, set: function (obj, value) { obj.isActive = value; } }, metadata: _metadata }, _isActive_initializers, _isActive_extraInitializers);
        __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: function (obj) { return "createdAt" in obj; }, get: function (obj) { return obj.createdAt; }, set: function (obj, value) { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
        __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: function (obj) { return "updatedAt" in obj; }, get: function (obj) { return obj.updatedAt; }, set: function (obj, value) { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
        __esDecorate(null, null, _version_decorators, { kind: "field", name: "version", static: false, private: false, access: { has: function (obj) { return "version" in obj; }, get: function (obj) { return obj.version; }, set: function (obj, value) { obj.version = value; } }, metadata: _metadata }, _version_initializers, _version_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Organization = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Organization = _classThis;
}();
exports.Organization = Organization;
