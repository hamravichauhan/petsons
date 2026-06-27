import { CollectionConfig } from 'payload';

export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'name',
    group: 'Catalog',
    defaultColumns: ['name', 'sku', 'baseMsrp', 'isActive'],
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'sku', type: 'text', required: true, unique: true, admin: { description: 'e.g., CON-COL-5-1' } },
    { name: 'slug', type: 'text', required: true, unique: true },
    { name: 'description', type: 'richText' },
    { name: 'brand', type: 'text' },
    {
      name: 'baseMsrp',
      type: 'number',
      required: true,
      min: 0,
      admin: { description: 'Base MSRP - highest price before discounts' },
    },
    { name: 'currencyCode', type: 'text', defaultValue: 'USD' },
    { name: 'isActive', type: 'checkbox', defaultValue: true },
    { name: 'isVisibleAnonymous', type: 'checkbox', defaultValue: false },
  ],
};