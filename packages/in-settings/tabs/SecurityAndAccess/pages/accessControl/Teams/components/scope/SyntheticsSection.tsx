/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { useState } from 'react';

import { AccessRestriction } from '@instana/types';

import LimitedAccessSwitcher, {
  SCOPE_TYPE
} from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Teams/components/scope/LimitedAccessSwitcher';
import { MinimalSelectEntitiesProps } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Teams/components/scope/SelectEntitiesTable.types';
import {
  SCOPE_FORM_ID,
  ScopeFormFields
} from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Teams/components/scope/ScopeDialog.form';
import SelectEntitiesTable from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Teams/components/scope/SelectEntitiesTable';
import { getInitialScopeType } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Teams/components/scope/ScopeSection';
import { useMapFormContext } from 'in-settings/components/MapFormProvider/MapFormProvider';

interface SyntheticsSectionProps<I> {
  extractId: (entity: I) => string;
  extractName: (entity: I) => string;
  limitedAccessScopes: AccessRestriction[];
  limitedAccessSwitchLabel: string;
  syntheticTestEntityTable: MinimalSelectEntitiesProps<I>;
  syntheticCredentialsEntityTable: MinimalSelectEntitiesProps<I>;
}

const SyntheticsSection = <I,>({
  extractId,
  extractName,
  limitedAccessSwitchLabel,
  limitedAccessScopes,
  syntheticTestEntityTable,
  syntheticCredentialsEntityTable
}: SyntheticsSectionProps<I>) => {
  const { form } = useMapFormContext<ScopeFormFields>(SCOPE_FORM_ID);
  const permissionsField = form.getIn(['accessPermissions']);
  const [scopeType, setScopeType] = useState<string>(getInitialScopeType(permissionsField, limitedAccessScopes));

  return (
    <>
      <LimitedAccessSwitcher
        limitedAccessScopes={limitedAccessScopes}
        limitedAccessSwitchLabel={limitedAccessSwitchLabel}
        onChange={newScopeType => setScopeType(newScopeType)}
        onEntireUnitSelected={() =>
          // Reset selected syntheticTests and syntheticCredentials
          form
            .updateIn([syntheticTestEntityTable.fieldName], f => f.setValue(undefined).setTouched(true))
            .updateIn([syntheticCredentialsEntityTable.fieldName], f => f.setValue(undefined).setTouched(true))
        }
      />

      {scopeType === SCOPE_TYPE.LIMITED_ACCESS && (
        <>
          <SelectEntitiesTable
            extractId={extractId}
            extractName={extractName}
            {...syntheticTestEntityTable}
            showTableHeader
          />

          <SelectEntitiesTable
            extractId={extractId}
            extractName={extractName}
            {...syntheticCredentialsEntityTable}
            showTableHeader
          />
        </>
      )}
    </>
  );
};

export default SyntheticsSection;
