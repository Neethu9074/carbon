/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { useState } from 'react';
import { MapForm } from 'formalistic';

import { Stack, Toggle } from '@instana/carbon';

import {
  ApplicationFilterFormItems,
  resetApplicationFields,
  SCOPE_FORM_ID,
  ScopeFormFields
} from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Teams/components/scope/ScopeDialog.form';
import ContributionFilterWrapper from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/components/ApplicationContributionFilter/ContributionFilterWrapper';
import LimitedAccessSwitcher, {
  SCOPE_TYPE
} from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Teams/components/scope/LimitedAccessSwitcher';
import { ScopeSectionProps } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Teams/components/scope/ScopeSection.types';
import SelectEntitiesTable from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Teams/components/scope/SelectEntitiesTable';
import { getInitialScopeType } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Teams/components/scope/ScopeSection';
import { useMapFormContext } from 'in-settings/components/MapFormProvider/MapFormProvider';
import { t } from 'in-i18n';

import locals from './ApplicationsSection.mless';

interface ApplicationsSectionProps<I> extends ScopeSectionProps<I> {
  defaultFilterName: string;
}

const ApplicationsSection = <I,>({
  defaultFilterName,
  fieldName,
  limitedAccessSwitchLabel,
  limitedAccessScopes,
  extractId,
  extractName,
  observable,
  tableAddLabel,
  tableTitle
}: ApplicationsSectionProps<I>) => {
  const { form, updateIn, updateForm } = useMapFormContext<ScopeFormFields>(SCOPE_FORM_ID);
  const permissionsField = form.getIn(['accessPermissions']);
  const isFilterEnabledField = form.getIn(['applicationFilterForm', 'isFilterEnabled']);
  const showRestrictedApplicationFilter = isFilterEnabledField?.value;
  const restrictedApplicationFilterField = form.getIn(['restrictedApplicationFilter']);
  const isRestrictedApplicationFilterExists = restrictedApplicationFilterField?.value?.label !== '';
  const applicationFilterForm = form.getIn(['applicationFilterForm']);
  const [scopeType, setScopeType] = useState<string>(getInitialScopeType(permissionsField, limitedAccessScopes));

  return (
    <>
      <LimitedAccessSwitcher
        limitedAccessScopes={limitedAccessScopes}
        limitedAccessSwitchLabel={limitedAccessSwitchLabel}
        onChange={newScopeType => {
          setScopeType(newScopeType);
        }}
        onEntireUnitSelected={() => resetApplicationFields(form, true)}
      />

      {scopeType === SCOPE_TYPE.LIMITED_ACCESS && (
        <Stack gap={4} orientation="vertical">
          <SelectEntitiesTable
            extractId={extractId}
            extractName={extractName}
            fieldName={fieldName}
            observable={observable}
            tableAddLabel={tableAddLabel}
            tableTitle={tableTitle}
          />

          <Toggle
            id="team-scope-applications-contribution-filter-toggle"
            className={locals.contributionFilterToggle}
            size="sm"
            labelText={t('in-settings:dialogs.scope.applicationsEnableContributionFilterSwitchLabel')}
            hideLabel
            onToggle={e => {
              if (e) {
                // Filter enabled => prefill filter name (with team tag)
                updateForm(
                  form
                    .updateIn(['applicationFilterForm', 'filterName'], f =>
                      f.setValue(defaultFilterName).setTouched(true)
                    )
                    .updateIn(['applicationFilterForm', 'isFilterEnabled'], f => f.setValue(e).setTouched(true))
                );
              } else {
                // Filter disabled => reset contribution filter fields
                updateForm(resetApplicationFields(form, false));
              }
            }}
            defaultToggled={isFilterEnabledField?.value}
          />

          {showRestrictedApplicationFilter && (
            <ContributionFilterWrapper
              form={applicationFilterForm}
              setForm={(appForm: MapForm<ApplicationFilterFormItems>) =>
                updateIn(['applicationFilterForm'], appForm.setTouched(true))
              }
              filterExpressionFieldName="filterExpression"
              filterNameFieldName="filterName"
              editMode={isRestrictedApplicationFilterExists}
              isContributorRole
            />
          )}
        </Stack>
      )}
    </>
  );
};

export default ApplicationsSection;
