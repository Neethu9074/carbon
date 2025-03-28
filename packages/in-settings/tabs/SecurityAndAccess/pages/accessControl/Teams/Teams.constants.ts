/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { TrashCan } from '@carbon/icons-react';

import { TeamOverview } from '@instana/types';

import {
  BatchActionItemProps,
  DataTableHeader,
  TableActions
} from 'in-settings/components/CarbonDataTableWrapper/CarbonDataTableWrapper';
import { deleteTeam, deleteTeams } from 'in-settings/tabs/SecurityAndAccess/api/teams';
import { deepFreeze } from 'in-services/util/object';
import config from 'in-services/config';
import { t } from 'in-i18n';

export const TEAMS_TABLE_PAGE_SIZES = Object.freeze([10, 20, 50] as const);

export const TEAMS_TABLE_ORDER = Object.freeze({ key: 'name', direction: 'asc' });

export const TEAMS_TABLE_HEADERS: Readonly<DataTableHeader[]> = deepFreeze([
  {
    key: 'name',
    header: t('in-settings:tabs.name')
  },
  {
    key: 'usersCount',
    header: t('in-settings:tabs.numberOfMembers')
  },
  {
    key: 'scope',
    header: t('in-settings:tabs.scopeOn', { tenantUnit: config.tenantUnit, tenant: config.tenant })
  }
] as const);

export const TEAMS_TABLE_ACTIONS: TableActions<TeamOverview> = deepFreeze({
  delete: {
    deleteEntity: entity => deleteTeam(entity.id),
    batchDeleteEntity: selectedIds => deleteTeams(selectedIds)
  }
} as const);

export const TEAMS_TABLE_BATCH_ACTIONS: Readonly<Array<BatchActionItemProps>> = deepFreeze([
  {
    renderIcon: TrashCan,
    actionName: t('in-settings:components.delete'),
    actionType: 'delete'
  }
] as const);
