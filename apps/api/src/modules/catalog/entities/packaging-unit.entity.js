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
exports.PackagingUnit = void 0;
var typeorm_1 = require("typeorm");
var product_entity_1 = require("./product.entity");
var PackagingUnit = function () {
    var _classDecorators = [(0, typeorm_1.Entity)('packaging_units')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _id_decorators;
    var _id_initializers = [];
    var _id_extraInitializers = [];
    var _product_decorators;
    var _product_initializers = [];
    var _product_extraInitializers = [];
    var _productId_decorators;
    var _productId_initializers = [];
    var _productId_extraInitializers = [];
    var _unitType_decorators;
    var _unitType_initializers = [];
    var _unitType_extraInitializers = [];
    var _quantityInBaseUnit_decorators;
    var _quantityInBaseUnit_initializers = [];
    var _quantityInBaseUnit_extraInitializers = [];
    var _baseUnit_decorators;
    var _baseUnit_initializers = [];
    var _baseUnit_extraInitializers = [];
    var _weightKg_decorators;
    var _weightKg_initializers = [];
    var _weightKg_extraInitializers = [];
    var _isActive_decorators;
    var _isActive_initializers = [];
    var _isActive_extraInitializers = [];
    var PackagingUnit = _classThis = /** @class */ (function () {
        function PackagingUnit_1() {
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.product = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _product_initializers, void 0));
            this.productId = (__runInitializers(this, _product_extraInitializers), __runInitializers(this, _productId_initializers, void 0));
            this.unitType = (__runInitializers(this, _productId_extraInitializers), __runInitializers(this, _unitType_initializers, void 0));
            this.quantityInBaseUnit = (__runInitializers(this, _unitType_extraInitializers), __runInitializers(this, _quantityInBaseUnit_initializers, void 0));
            this.baseUnit = (__runInitializers(this, _quantityInBaseUnit_extraInitializers), __runInitializers(this, _baseUnit_initializers, void 0));
            this.weightKg = (__runInitializers(this, _baseUnit_extraInitializers), __runInitializers(this, _weightKg_initializers, void 0));
            this.isActive = (__runInitializers(this, _weightKg_extraInitializers), __runInitializers(this, _isActive_initializers, void 0));
            __runInitializers(this, _isActive_extraInitializers);
        }
        return PackagingUnit_1;
    }());
    __setFunctionName(_classThis, "PackagingUnit");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _id_decorators = [(0, typeorm_1.PrimaryGeneratedColumn)('uuid')];
        _product_decorators = [(0, typeorm_1.ManyToOne)(function () { return product_entity_1.Product; }), (0, typeorm_1.JoinColumn)({ name: 'product_id' })];
        _productId_decorators = [(0, typeorm_1.Column)({ name: 'product_id', type: 'uuid' })];
        _unitType_decorators = [(0, typeorm_1.Column)({ name: 'unit_type', type: 'varchar', length: 50 })];
        _quantityInBaseUnit_decorators = [(0, typeorm_1.Column)({ name: 'quantity_in_base_unit', type: 'decimal', precision: 15, scale: 6 })];
        _baseUnit_decorators = [(0, typeorm_1.Column)({ name: 'base_unit', type: 'varchar', length: 20, default: 'GALLON' })];
        _weightKg_decorators = [(0, typeorm_1.Column)({ name: 'weight_kg', type: 'decimal', precision: 10, scale: 3, nullable: true })];
        _isActive_decorators = [(0, typeorm_1.Column)({ name: 'is_active', type: 'boolean', default: true })];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: function (obj) { return "id" in obj; }, get: function (obj) { return obj.id; }, set: function (obj, value) { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _product_decorators, { kind: "field", name: "product", static: false, private: false, access: { has: function (obj) { return "product" in obj; }, get: function (obj) { return obj.product; }, set: function (obj, value) { obj.product = value; } }, metadata: _metadata }, _product_initializers, _product_extraInitializers);
        __esDecorate(null, null, _productId_decorators, { kind: "field", name: "productId", static: false, private: false, access: { has: function (obj) { return "productId" in obj; }, get: function (obj) { return obj.productId; }, set: function (obj, value) { obj.productId = value; } }, metadata: _metadata }, _productId_initializers, _productId_extraInitializers);
        __esDecorate(null, null, _unitType_decorators, { kind: "field", name: "unitType", static: false, private: false, access: { has: function (obj) { return "unitType" in obj; }, get: function (obj) { return obj.unitType; }, set: function (obj, value) { obj.unitType = value; } }, metadata: _metadata }, _unitType_initializers, _unitType_extraInitializers);
        __esDecorate(null, null, _quantityInBaseUnit_decorators, { kind: "field", name: "quantityInBaseUnit", static: false, private: false, access: { has: function (obj) { return "quantityInBaseUnit" in obj; }, get: function (obj) { return obj.quantityInBaseUnit; }, set: function (obj, value) { obj.quantityInBaseUnit = value; } }, metadata: _metadata }, _quantityInBaseUnit_initializers, _quantityInBaseUnit_extraInitializers);
        __esDecorate(null, null, _baseUnit_decorators, { kind: "field", name: "baseUnit", static: false, private: false, access: { has: function (obj) { return "baseUnit" in obj; }, get: function (obj) { return obj.baseUnit; }, set: function (obj, value) { obj.baseUnit = value; } }, metadata: _metadata }, _baseUnit_initializers, _baseUnit_extraInitializers);
        __esDecorate(null, null, _weightKg_decorators, { kind: "field", name: "weightKg", static: false, private: false, access: { has: function (obj) { return "weightKg" in obj; }, get: function (obj) { return obj.weightKg; }, set: function (obj, value) { obj.weightKg = value; } }, metadata: _metadata }, _weightKg_initializers, _weightKg_extraInitializers);
        __esDecorate(null, null, _isActive_decorators, { kind: "field", name: "isActive", static: false, private: false, access: { has: function (obj) { return "isActive" in obj; }, get: function (obj) { return obj.isActive; }, set: function (obj, value) { obj.isActive = value; } }, metadata: _metadata }, _isActive_initializers, _isActive_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        PackagingUnit = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return PackagingUnit = _classThis;
}();
exports.PackagingUnit = PackagingUnit;
