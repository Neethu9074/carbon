/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { useState } from 'react';

import { ContentSwitcher, Switch } from '@instana/carbon';
import { AccessRestriction } from '@instana/types';
import { t } from '@instana/i18n-react';

import {
  LimitedAccessSwitcherProps,
  ToggleAccessPermissions
} from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Teams/components/scope/LimitedAccessSwitcher.types';
import {
  SCOPE_FORM_ID,
  ScopeFormFields
} from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Teams/components/scope/ScopeDialog.form';
import { useMapFormContext } from 'in-settings/components/MapFormProvider/MapFormProvider';
import config from 'in-services/config';

import locals from './LimitedAccessSwitcher.mless';

export const SCOPE_TYPE = Object.freeze({
  ENTIRE_UNIT: 'entire-unit',
  LIMITED_ACCESS: 'limited-access'
} as const);

const toggleAccessPermissions = ({
  current,
  limited,
  toAddOnEnabled = [],
  toRemoveOnDisabled = []
}: ToggleAccessPermissions): Array<AccessRestriction> => {
  const toBeAdded = limited ? toAddOnEnabled : [];
  const toBeRemoved = limited ? [] : toRemoveOnDisabled;

  let updatedPermissions = [...current];

  if (toBeRemoved?.length > 0) {
    updatedPermissions = updatedPermissions.filter(permission => !toBeRemoved.includes(permission));
  }
  if (toBeAdded?.length > 0) {
    updatedPermissions = Array.from(new Set([...current, ...toBeAdded]));
  }

  return updatedPermissions;
};

const LimitedAccessSwitcher = ({
  limitedAccessSwitchLabel,
  limitedAccessScopes,
  onChange,
  onEntireUnitSelected
}: LimitedAccessSwitcherProps) => {
  const { form, updateForm } = useMapFormContext<ScopeFormFields>(SCOPE_FORM_ID);
  const permissionsField = form.getIn(['accessPermissions']);

  const [scopeType, setScopeType] = useState<string>(
    permissionsField?.value && limitedAccessScopes.every(scope => permissionsField?.value?.includes(scope))
      ? SCOPE_TYPE.LIMITED_ACCESS
      : SCOPE_TYPE.ENTIRE_UNIT
  );

  return (
    <ContentSwitcher
      className={locals.scopeLimitedAccessSwitcher}
      selectedIndex={scopeType === SCOPE_TYPE.ENTIRE_UNIT ? 0 : 1}
      onChange={({ index = 0 }) => {
        if (index === 0) {
          setScopeType(SCOPE_TYPE.ENTIRE_UNIT);
          if (onChange) {
            onChange(SCOPE_TYPE.ENTIRE_UNIT);
          }
        } else {
          setScopeType(SCOPE_TYPE.LIMITED_ACCESS);
          if (onChange) {
            onChange(SCOPE_TYPE.LIMITED_ACCESS);
          }
        }

        const updatedAccessPermissions = toggleAccessPermissions({
          current: permissionsField.value ?? [],
          limited: index !== 0,
          toAddOnEnabled: limitedAccessScopes,
          toRemoveOnDisabled: limitedAccessScopes
        });

        const updatedForm = onEntireUnitSelected ? onEntireUnitSelected() : form;
        updateForm(updatedForm.updateIn(['accessPermissions'], f => f.setValue(updatedAccessPermissions)));
      }}
      size="sm"
    >
      <Switch
        name={SCOPE_TYPE.ENTIRE_UNIT}
        text={t('in-settings:dialogs.scope.entireUnit', {
          tenantUnit: config.tenantUnit,
          tenant: config.tenant
        })}
      />
      <Switch name={SCOPE_TYPE.LIMITED_ACCESS} text={limitedAccessSwitchLabel} />
    </ContentSwitcher>
  );
};

export default LimitedAccessSwitcher;
