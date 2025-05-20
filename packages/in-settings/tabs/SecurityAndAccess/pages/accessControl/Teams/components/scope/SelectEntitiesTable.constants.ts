/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { TrashCan } from '@carbon/icons-react';

import { t } from '@instana/i18n-react';

import {
  BatchActionItemProps,
  DataTableHeader,
  TableActions
} from 'in-settings/components/MultiSelectDataTable/MultiSelectDataTable';
import { deepFreeze } from 'in-services/util/object';

export const SELECT_ENTITIES_TABLE_PAGE_SIZES = Object.freeze([10, 20, 50] as const);

export const SELECT_ENTITIES_TABLE_ORDER = Object.freeze({ key: 'name', direction: 'asc' } as const);

export const SELECT_ENTITIES_TABLE_HEADERS: Readonly<DataTableHeader[]> = deepFreeze([
  {
    key: 'name',
    header: t('in-settings:tabs.name')
  }
] as const);

export const SELECT_ENTITIES_TABLE_ACTIONS: TableActions<any> = deepFreeze({
  delete: {
    deleteEntity: () => undefined,
    batchDeleteEntity: () => undefined
  }
} as const);

export const SELECT_ENTITIES_TABLE_BATCH_ACTIONS: Readonly<Array<BatchActionItemProps>> = deepFreeze([
  {
    renderIcon: TrashCan,
    actionName: t('in-settings:components.delete'),
    actionType: 'delete'
  }
] as const);

export const SELECT_ENTITIES_TYPE = Object.freeze({
  ENTIRE_UNIT: 'entire-unit',
  LIMITED_ACCESS: 'limited-access'
} as const);
