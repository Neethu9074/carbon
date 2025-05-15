/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { DataTableHeader, TableActions } from 'in-settings/components/MultiSelectDataTable/MultiSelectDataTable';
import { deepFreeze } from 'in-services/util/object';
import { t } from 'in-i18n';

export const ENTITY_TABLE_PAGE_SIZES = Object.freeze([10, 20, 50] as const);

export const ENTITY_TABLE_ORDER = Object.freeze({ key: 'name', direction: 'asc' });

export const ENTITY_TABLE_HEADERS: Readonly<DataTableHeader[]> = deepFreeze([
  {
    key: 'name',
    header: t('in-settings:tabs.name')
  }
] as const);

export const ENTITY_TABLE_ACTIONS: TableActions<any> = deepFreeze({
  delete: {
    deleteEntity: () => undefined,
    batchDeleteEntity: () => undefined
  }
} as const);

export const ENTITY_TABLE_SEARCH_ATTRIBUTES = Object.freeze(['name'] as const);
