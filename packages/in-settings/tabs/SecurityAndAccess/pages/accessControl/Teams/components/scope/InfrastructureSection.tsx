/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { useState } from 'react';

import { Typography, ValidationBlock } from '@instana/components';
import { FormGroup, Stack, Toggle } from '@instana/carbon';
import { AccessRestriction } from '@instana/types';
import { t } from '@instana/i18n-react';

import LimitedAccessSwitcher, {
  SCOPE_TYPE
} from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Teams/components/scope/LimitedAccessSwitcher';
import {
  SCOPE_FORM_ID,
  ScopeFormFields
} from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Teams/components/scope/ScopeDialog.form';
import { getInitialScopeType } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Teams/components/scope//ScopeSection';
import { useMapFormContext } from 'in-settings/components/MapFormProvider/MapFormProvider';
import DfqSearchBar from 'in-components/SearchBar/DfqSearchBar';

interface InfrastructureSectionProps {
  limitedAccessScopes: AccessRestriction[];
  limitedAccessSwitchLabel: string;
}
const InfrastructureSection = ({ limitedAccessSwitchLabel, limitedAccessScopes }: InfrastructureSectionProps) => {
  const { form, updateIn, updateForm } = useMapFormContext<ScopeFormFields>(SCOPE_FORM_ID);
  const permissionsField = form.getIn(['accessPermissions']);
  const infraDfqFilterField = form.getIn(['infrastructureForm']).getIn(['infraDfqFilter']);
  const dfqEnabledField = form.getIn(['infrastructureForm']).getIn(['isDfqEnabled']);
  const infraDfqFormField = form.getIn(['infrastructureForm']);
  const infraDfqFilter = infraDfqFilterField?.value ?? '';
  const showDfq = dfqEnabledField.value;

  const [scopeType, setScopeType] = useState<string>(getInitialScopeType(permissionsField, limitedAccessScopes));

  const onUpdateInfraDfq = (infraDfq: string) => {
    updateIn(['infrastructureForm', 'infraDfqFilter'], infraDfqFilterField.setValue(infraDfq).setTouched(true));
  };

  return (
    <>
      <LimitedAccessSwitcher
        limitedAccessScopes={limitedAccessScopes}
        limitedAccessSwitchLabel={limitedAccessSwitchLabel}
        onChange={newScopeType => setScopeType(newScopeType)}
        onEntireUnitSelected={() =>
          // Reset DFQ fields
          form
            .updateIn(['infrastructureForm', 'isDfqEnabled'], f => f.setValue(false).setTouched(true))
            .updateIn(['infrastructureForm', 'infraDfqFilter'], f => f.setValue('').setTouched(true))
        }
      />

      {scopeType === SCOPE_TYPE.LIMITED_ACCESS && (
        <>
          <Typography variant="helper-text-01">
            {t('in-settings:dialogs.scope.infrastructureSectionDescription')}
          </Typography>
          <Toggle
            id="allow-access-toggle"
            size="sm"
            labelText={t('in-settings:dialogs.scope.infrastructureAllowAccessSwitchLabel')}
            hideLabel
            onToggle={e => {
              if (e) {
                updateForm(form.updateIn(['infrastructureForm', 'isDfqEnabled'], f => f.setValue(e).setTouched(true)));
              } else {
                const updatedForm = form.updateIn(['infrastructureForm', 'infraDfqFilter'], f => f.setValue(''));
                updateForm(
                  updatedForm.updateIn(['infrastructureForm', 'isDfqEnabled'], f => f.setValue(e).setTouched(true))
                );
              }
            }}
            defaultToggled={showDfq}
          />
          {showDfq && (
            <Stack>
              <FormGroup legendText={t('in-settings:dialogs.scope.infrastructureDfqLabel')}>
                <DfqFilter infraDfqFilter={infraDfqFilter} onUpdateDfq={onUpdateInfraDfq} />
                {(form.touched || (!infraDfqFormField.valid && infraDfqFilterField.hierarchyTouched)) &&
                  infraDfqFormField.messages.map(({ message }, index) => (
                    <ValidationBlock key={`validation-message-${index}`}>{message}</ValidationBlock>
                  ))}
              </FormGroup>
            </Stack>
          )}
        </>
      )}
    </>
  );
};

export default InfrastructureSection;

interface DfqFilterProps {
  infraDfqFilter: string;
  onUpdateDfq: (dfq: string) => void;
}

const DfqFilter = ({ infraDfqFilter, onUpdateDfq }: DfqFilterProps) => {
  return (
    <DfqSearchBar theme="light" onQueryValueChange={onUpdateDfq} queryValue={infraDfqFilter} manageFiltersDisabled />
  );
};
