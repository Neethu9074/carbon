// eslint-disable-next-line no-restricted-imports
import i18n from 'i18next';

// i18n.t can get reassigned at runtime. Therefore we do not export i18n.t as a const directly.
export const t = (...args) => i18n.t(...args);
