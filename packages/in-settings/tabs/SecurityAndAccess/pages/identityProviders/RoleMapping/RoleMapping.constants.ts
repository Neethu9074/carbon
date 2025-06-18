/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { TrashCan } from '@carbon/icons-react';

import {
  BatchActionItemProps,
  DataTableHeader,
  TableActions
} from 'in-settings/components/MultiSelectDataTable/MultiSelectDataTable';
import { IdpGroupMapping, deleteMapping, deleteMappings } from 'in-settings/tabs/SecurityAndAccess/api/groupMappings';
import { deepFreeze } from 'in-services/util/object';
import { t } from 'in-i18n';

export const ROLE_MAPPING_TABLE_PAGE_SIZES = Object.freeze([10, 20, 50] as const);

export const ROLE_MAPPING_TABLE_ORDER = Object.freeze({ key: 'key', direction: 'asc' });

export const ROLE_MAPPING_TABLE_HEADERS: Readonly<DataTableHeader[]> = deepFreeze([
  {
    key: 'key',
    header: t('in-settings:tabs.roleMapping.keyColumn')
  },
  {
    key: 'value',
    header: t('in-settings:tabs.roleMapping.valueColumn')
  },
  {
    key: 'role',
    header: t('in-settings:tabs.roleMapping.roleColumn')
  },
  {
    key: 'team',
    header: t('in-settings:tabs.roleMapping.teamColumn')
  }
] as const);

export const ROLE_MAPPING_TABLE_ACTIONS: TableActions<IdpGroupMapping> = deepFreeze({
  delete: {
    deleteEntity: entity => deleteMapping(entity?.id ?? ''),
    batchDeleteEntity: selectedIds => deleteMappings(selectedIds)
  }
} as const);

export const ROLE_MAPPING_TABLE_BATCH_ACTIONS: Readonly<Array<BatchActionItemProps>> = deepFreeze([
  {
    renderIcon: TrashCan,
    actionName: t('in-settings:components.delete'),
    actionType: 'delete'
  }
] as const);
