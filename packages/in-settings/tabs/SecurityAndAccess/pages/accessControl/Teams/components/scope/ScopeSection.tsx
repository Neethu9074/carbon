/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { useState } from 'react';
import { Field } from 'formalistic';

import { AccessRestriction } from '@instana/types';

import LimitedAccessSwitcher, {
  SCOPE_TYPE
} from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Teams/components/scope/LimitedAccessSwitcher';
import {
  SCOPE_FORM_ID,
  ScopeFormFields
} from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Teams/components/scope/ScopeDialog.form';
import { ScopeSectionProps } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Teams/components/scope/ScopeSection.types';
import SelectEntitiesTable from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Teams/components/scope/SelectEntitiesTable';
import { useMapFormContext } from 'in-settings/components/MapFormProvider/MapFormProvider';

export const getInitialScopeType = (
  permissionsField: Field<AccessRestriction[] | undefined>,
  limitedAccessScopes: AccessRestriction[]
) => {
  return permissionsField?.value && limitedAccessScopes.every(scope => permissionsField?.value?.includes(scope))
    ? SCOPE_TYPE.LIMITED_ACCESS
    : SCOPE_TYPE.ENTIRE_UNIT;
};

const ScopeSection = <I,>({
  fieldName,
  limitedAccessSwitchLabel,
  limitedAccessScopes,
  extractId,
  extractName,
  observable,
  tableAddLabel,
  tableTitle
}: ScopeSectionProps<I>) => {
  const { form } = useMapFormContext<ScopeFormFields>(SCOPE_FORM_ID);
  const permissionsField = form.getIn(['accessPermissions']);
  const [scopeType, setScopeType] = useState<string>(getInitialScopeType(permissionsField, limitedAccessScopes));

  return (
    <>
      <LimitedAccessSwitcher
        limitedAccessScopes={limitedAccessScopes}
        limitedAccessSwitchLabel={limitedAccessSwitchLabel}
        onChange={newScopeType => {
          setScopeType(newScopeType);
        }}
        onEntireUnitSelected={() => form.updateIn([fieldName], f => f.setValue(undefined).setTouched(true))}
      />

      {scopeType === SCOPE_TYPE.LIMITED_ACCESS && (
        <SelectEntitiesTable
          extractId={extractId}
          extractName={extractName}
          fieldName={fieldName}
          observable={observable}
          tableAddLabel={tableAddLabel}
          tableTitle={tableTitle}
        />
      )}
    </>
  );
};

export default ScopeSection;
