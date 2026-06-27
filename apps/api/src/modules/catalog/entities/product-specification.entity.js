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
exports.ProductSpecification = void 0;
var typeorm_1 = require("typeorm");
var product_entity_1 = require("./product.entity");
var ProductSpecification = function () {
    var _classDecorators = [(0, typeorm_1.Entity)('product_specifications')];
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
    var _dilutionRatio_decorators;
    var _dilutionRatio_initializers = [];
    var _dilutionRatio_extraInitializers = [];
    var _brixValue_decorators;
    var _brixValue_initializers = [];
    var _brixValue_extraInitializers = [];
    var _phLevel_decorators;
    var _phLevel_initializers = [];
    var _phLevel_extraInitializers = [];
    var _shelfLifeDays_decorators;
    var _shelfLifeDays_initializers = [];
    var _shelfLifeDays_extraInitializers = [];
    var _isKosher_decorators;
    var _isKosher_initializers = [];
    var _isKosher_extraInitializers = [];
    var _isHalal_decorators;
    var _isHalal_initializers = [];
    var _isHalal_extraInitializers = [];
    var _isVegan_decorators;
    var _isVegan_initializers = [];
    var _isVegan_extraInitializers = [];
    var _isGlutenFree_decorators;
    var _isGlutenFree_initializers = [];
    var _isGlutenFree_extraInitializers = [];
    var _isOrganic_decorators;
    var _isOrganic_initializers = [];
    var _isOrganic_extraInitializers = [];
    var ProductSpecification = _classThis = /** @class */ (function () {
        function ProductSpecification_1() {
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.product = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _product_initializers, void 0));
            this.productId = (__runInitializers(this, _product_extraInitializers), __runInitializers(this, _productId_initializers, void 0));
            this.dilutionRatio = (__runInitializers(this, _productId_extraInitializers), __runInitializers(this, _dilutionRatio_initializers, void 0));
            this.brixValue = (__runInitializers(this, _dilutionRatio_extraInitializers), __runInitializers(this, _brixValue_initializers, void 0));
            this.phLevel = (__runInitializers(this, _brixValue_extraInitializers), __runInitializers(this, _phLevel_initializers, void 0));
            this.shelfLifeDays = (__runInitializers(this, _phLevel_extraInitializers), __runInitializers(this, _shelfLifeDays_initializers, void 0));
            this.isKosher = (__runInitializers(this, _shelfLifeDays_extraInitializers), __runInitializers(this, _isKosher_initializers, void 0));
            this.isHalal = (__runInitializers(this, _isKosher_extraInitializers), __runInitializers(this, _isHalal_initializers, void 0));
            this.isVegan = (__runInitializers(this, _isHalal_extraInitializers), __runInitializers(this, _isVegan_initializers, void 0));
            this.isGlutenFree = (__runInitializers(this, _isVegan_extraInitializers), __runInitializers(this, _isGlutenFree_initializers, void 0));
            this.isOrganic = (__runInitializers(this, _isGlutenFree_extraInitializers), __runInitializers(this, _isOrganic_initializers, void 0));
            __runInitializers(this, _isOrganic_extraInitializers);
        }
        return ProductSpecification_1;
    }());
    __setFunctionName(_classThis, "ProductSpecification");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _id_decorators = [(0, typeorm_1.PrimaryGeneratedColumn)('uuid')];
        _product_decorators = [(0, typeorm_1.OneToOne)(function () { return product_entity_1.Product; }), (0, typeorm_1.JoinColumn)({ name: 'product_id' })];
        _productId_decorators = [(0, typeorm_1.Column)({ name: 'product_id', type: 'uuid' })];
        _dilutionRatio_decorators = [(0, typeorm_1.Column)({ name: 'dilution_ratio', type: 'varchar', length: 20, nullable: true })];
        _brixValue_decorators = [(0, typeorm_1.Column)({ name: 'brix_value', type: 'decimal', precision: 5, scale: 2, nullable: true })];
        _phLevel_decorators = [(0, typeorm_1.Column)({ name: 'ph_level', type: 'decimal', precision: 3, scale: 1, nullable: true })];
        _shelfLifeDays_decorators = [(0, typeorm_1.Column)({ name: 'shelf_life_days', type: 'int', nullable: true })];
        _isKosher_decorators = [(0, typeorm_1.Column)({ name: 'is_kosher', type: 'boolean', default: false })];
        _isHalal_decorators = [(0, typeorm_1.Column)({ name: 'is_halal', type: 'boolean', default: false })];
        _isVegan_decorators = [(0, typeorm_1.Column)({ name: 'is_vegan', type: 'boolean', default: false })];
        _isGlutenFree_decorators = [(0, typeorm_1.Column)({ name: 'is_gluten_free', type: 'boolean', default: false })];
        _isOrganic_decorators = [(0, typeorm_1.Column)({ name: 'is_organic', type: 'boolean', default: false })];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: function (obj) { return "id" in obj; }, get: function (obj) { return obj.id; }, set: function (obj, value) { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _product_decorators, { kind: "field", name: "product", static: false, private: false, access: { has: function (obj) { return "product" in obj; }, get: function (obj) { return obj.product; }, set: function (obj, value) { obj.product = value; } }, metadata: _metadata }, _product_initializers, _product_extraInitializers);
        __esDecorate(null, null, _productId_decorators, { kind: "field", name: "productId", static: false, private: false, access: { has: function (obj) { return "productId" in obj; }, get: function (obj) { return obj.productId; }, set: function (obj, value) { obj.productId = value; } }, metadata: _metadata }, _productId_initializers, _productId_extraInitializers);
        __esDecorate(null, null, _dilutionRatio_decorators, { kind: "field", name: "dilutionRatio", static: false, private: false, access: { has: function (obj) { return "dilutionRatio" in obj; }, get: function (obj) { return obj.dilutionRatio; }, set: function (obj, value) { obj.dilutionRatio = value; } }, metadata: _metadata }, _dilutionRatio_initializers, _dilutionRatio_extraInitializers);
        __esDecorate(null, null, _brixValue_decorators, { kind: "field", name: "brixValue", static: false, private: false, access: { has: function (obj) { return "brixValue" in obj; }, get: function (obj) { return obj.brixValue; }, set: function (obj, value) { obj.brixValue = value; } }, metadata: _metadata }, _brixValue_initializers, _brixValue_extraInitializers);
        __esDecorate(null, null, _phLevel_decorators, { kind: "field", name: "phLevel", static: false, private: false, access: { has: function (obj) { return "phLevel" in obj; }, get: function (obj) { return obj.phLevel; }, set: function (obj, value) { obj.phLevel = value; } }, metadata: _metadata }, _phLevel_initializers, _phLevel_extraInitializers);
        __esDecorate(null, null, _shelfLifeDays_decorators, { kind: "field", name: "shelfLifeDays", static: false, private: false, access: { has: function (obj) { return "shelfLifeDays" in obj; }, get: function (obj) { return obj.shelfLifeDays; }, set: function (obj, value) { obj.shelfLifeDays = value; } }, metadata: _metadata }, _shelfLifeDays_initializers, _shelfLifeDays_extraInitializers);
        __esDecorate(null, null, _isKosher_decorators, { kind: "field", name: "isKosher", static: false, private: false, access: { has: function (obj) { return "isKosher" in obj; }, get: function (obj) { return obj.isKosher; }, set: function (obj, value) { obj.isKosher = value; } }, metadata: _metadata }, _isKosher_initializers, _isKosher_extraInitializers);
        __esDecorate(null, null, _isHalal_decorators, { kind: "field", name: "isHalal", static: false, private: false, access: { has: function (obj) { return "isHalal" in obj; }, get: function (obj) { return obj.isHalal; }, set: function (obj, value) { obj.isHalal = value; } }, metadata: _metadata }, _isHalal_initializers, _isHalal_extraInitializers);
        __esDecorate(null, null, _isVegan_decorators, { kind: "field", name: "isVegan", static: false, private: false, access: { has: function (obj) { return "isVegan" in obj; }, get: function (obj) { return obj.isVegan; }, set: function (obj, value) { obj.isVegan = value; } }, metadata: _metadata }, _isVegan_initializers, _isVegan_extraInitializers);
        __esDecorate(null, null, _isGlutenFree_decorators, { kind: "field", name: "isGlutenFree", static: false, private: false, access: { has: function (obj) { return "isGlutenFree" in obj; }, get: function (obj) { return obj.isGlutenFree; }, set: function (obj, value) { obj.isGlutenFree = value; } }, metadata: _metadata }, _isGlutenFree_initializers, _isGlutenFree_extraInitializers);
        __esDecorate(null, null, _isOrganic_decorators, { kind: "field", name: "isOrganic", static: false, private: false, access: { has: function (obj) { return "isOrganic" in obj; }, get: function (obj) { return obj.isOrganic; }, set: function (obj, value) { obj.isOrganic = value; } }, metadata: _metadata }, _isOrganic_initializers, _isOrganic_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ProductSpecification = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ProductSpecification = _classThis;
}();
exports.ProductSpecification = ProductSpecification;
