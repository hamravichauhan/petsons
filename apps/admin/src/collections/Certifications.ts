import { CollectionConfig } from 'payload';

export const Certifications: CollectionConfig = {
  slug: 'certifications',
  admin: {
    useAsTitle: 'name',
    group: 'Catalog',
  },
  fields: [
    { name: 'name', type: 'text', required: true, unique: true },
    { name: 'description', type: 'textarea' },
    { name: 'badgeUrl', type: 'text' },
    { name: 'isActive', type: 'checkbox', defaultValue: true },
  ],
};