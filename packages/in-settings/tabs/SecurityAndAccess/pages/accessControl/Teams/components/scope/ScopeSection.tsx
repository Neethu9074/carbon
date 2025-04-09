/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { TrashCan } from '@carbon/icons-react';
import React, { useState } from 'react';

import { CarbonContentSwitcher, CarbonSwitch } from '@instana/components';
import { t } from '@instana/i18n-react';

import {
  SCOPE_TABLE_ACTIONS,
  SCOPE_TABLE_BATCH_ACTIONS,
  SCOPE_TABLE_HEADERS,
  SCOPE_TABLE_ORDER,
  SCOPE_TABLE_PAGE_SIZES,
  SCOPE_TYPE
} from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Teams/components/scope/ScopeSection.constants';
import {
  ScopeItemResult,
  ScopeItemRow,
  ScopeSectionProps
} from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Teams/components/scope/ScopeSection.types';
import MultiSelectDataTable, { DataTableRow } from 'in-settings/components/MultiSelectDataTable/MultiSelectDataTable';
import config from 'in-services/config';

import locals from './ScopeSection.mless';

const createMenuItemsForRow = (
  items: ScopeItemResult[],
  row: Omit<DataTableRow<ScopeItemRow<ScopeItemResult>[], ScopeItemResult>, 'rowData'>
) => {
  const item = items.filter(item => item.id === row.id)[0];
  const { name } = item;
  return [
    {
      actionType: 'delete',
      icon: <TrashCan />,
      label: t('in-settings:components.deleteEntity', { entity: name })
    }
  ];
};

const ScopeSection = ({ limitedAccessSwitchLabel, tableAddLabel, tableTitle }: ScopeSectionProps) => {
  const [scopeType, setScopeType] = useState<string>(SCOPE_TYPE.ENTIRE_UNIT);
  return (
    <div className={locals.scopeSection}>
      <CarbonContentSwitcher
        className={locals.scopeTypeContentSwitcher}
        selectedIndex={scopeType === SCOPE_TYPE.ENTIRE_UNIT ? 0 : 1}
        onChange={({ index = 0 }) => {
          if (index === 0) {
            setScopeType(SCOPE_TYPE.ENTIRE_UNIT);
          } else {
            setScopeType(SCOPE_TYPE.LIMITED_ACCESS);
          }
        }}
        size="sm"
      >
        <CarbonSwitch
          name={SCOPE_TYPE.ENTIRE_UNIT}
          text={t('in-settings:dialogs.scope.entireUnit', {
            tenantUnit: config.tenantUnit,
            tenant: config.tenant
          })}
        />
        <CarbonSwitch name={SCOPE_TYPE.LIMITED_ACCESS} text={limitedAccessSwitchLabel} />
      </CarbonContentSwitcher>

      {scopeType === SCOPE_TYPE.LIMITED_ACCESS && (
        <MultiSelectDataTable
          getBatchActionItems={() => SCOPE_TABLE_BATCH_ACTIONS}
          getEntityName={({ name }) => t('in-settings:tabs.teams.scopeItemName', { name: name })}
          getMenuItems={row => createMenuItemsForRow([], row)}
          initalSortConfig={SCOPE_TABLE_ORDER}
          labelNew={tableAddLabel}
          loading={false}
          //message={errorMessage || message}
          onCreateNew={() => {}}
          pageSizes={SCOPE_TABLE_PAGE_SIZES}
          searchAttributes={['name']}
          searchPlaceholderText={t('in-settings:components.search')}
          tableActions={SCOPE_TABLE_ACTIONS}
          tableHeaders={SCOPE_TABLE_HEADERS}
          tableRows={[]}
          title={tableTitle}
        />
      )}
    </div>
  );
};

export default ScopeSection;
