/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { useState } from 'react';

import LimitedAccessSwitcher, {
  SCOPE_TYPE
} from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Teams/components/scope/LimitedAccessSwitcher';
import {
  ScopeTableFormFields,
  SCOPE_FORM_ID
} from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Teams/components/scope/ScopeDialog.form';
import { ScopeSectionProps } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Teams/components/scope/ScopeSection.types';
import SelectEntitiesTable from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Teams/components/scope/SelectEntitiesTable';
import { useMapFormContext } from 'in-settings/components/MapFormProvider/MapFormProvider';

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
  const { form } = useMapFormContext<ScopeTableFormFields>(SCOPE_FORM_ID);
  const permissionsField = form.getIn(['accessPermissions']);

  const [scopeType, setScopeType] = useState<string>(
    permissionsField?.value && limitedAccessScopes.every(scope => permissionsField?.value?.includes(scope))
      ? SCOPE_TYPE.LIMITED_ACCESS
      : SCOPE_TYPE.ENTIRE_UNIT
  );

  return (
    <>
      <LimitedAccessSwitcher
        limitedAccessScopes={limitedAccessScopes}
        limitedAccessSwitchLabel={limitedAccessSwitchLabel}
        onChange={newScopeType => setScopeType(newScopeType)}
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
