/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { MapForm } from 'formalistic';
import React from 'react';

import { ApiApplicationScope } from '@instana/types';
import { t } from '@instana/i18n-react';

import { updateTagFilterExpressionValidator } from 'in-applications/creation/form/createApplicationForm';
import { applicationContributionFilterEnabled } from 'in-services/featureFlags';
import ComboBoxBehavior from 'in-components/form/ComboBox/ComboBoxBehavior';
import DropdownButton from 'in-components/Button/DropdownButton';
import { compareIgnoreCase } from 'in-services/util/string';
import { UserRestrictedApplication } from 'in-api/users';
import { role } from 'in-stores/user';

interface ContributionFilterDropdownProps {
  userRestrictedApplications: UserRestrictedApplication[];
  form: MapForm<any>;
  updateForm: (form: MapForm<any>) => void;
  disabled: boolean;
  className?: string;
}
interface OptionsProps {
  value: string | null;
  label: string;
  scope: ApiApplicationScope;
}

const OPTION_NO_RESTRICTIONS: OptionsProps = {
  value: null, // indicates to the backend that no restrictions should be applied
  label: t('in-applications:creation.noRestrictions'),
  scope: 'INCLUDE_ALL_DOWNSTREAM'
};

export default function ContributionFilterDropdown({
  userRestrictedApplications,
  form,
  updateForm,
  disabled = false,
  className
}: ContributionFilterDropdownProps): JSX.Element {
  const groupIdField = form.get('groupId');

  const onChange = (value: string) => {
    const groupScope = userRestrictedApplications.find(r => r.id === value)?.filter?.scope ?? 'INCLUDE_ALL_DOWNSTREAM';
    let updatedForm = form
      .updateIn(['groupId'], field => field.setValue(value).setTouched(true))
      .updateIn(['scope'], field => field.setValue(limitScope(field.value, groupScope)).setTouched(true));

    updatedForm = updateTagFilterExpressionValidator(updatedForm, value);

    updateForm(updatedForm);
  };

  const options: OptionsProps[] = createOptions(userRestrictedApplications);

  return (
    <ComboBoxBehavior
      value={groupIdField.value}
      options={options}
      onChange={onChange}
      disableAutomaticOptionSorting
      aria-label={t('in-applications:creation.selectContributionFilter')}
      listItemClassName={className}
    >
      {({ elementProps, isOpen }) => (
        // @ts-expect-error not fully matching expected type
        <DropdownButton {...elementProps} kind="secondary" expanded={isOpen} disabled={disabled}>
          {renderSelectedOption(options, groupIdField.value)}
        </DropdownButton>
      )}
    </ComboBoxBehavior>
  );
}

function renderSelectedOption(options: OptionsProps[], value: string) {
  return options.find(o => o.value === value)?.label ?? t('in-applications:creation.selectContributionFilter');
}

function createOptions(userRestrictedApplications: UserRestrictedApplication[]): OptionsProps[] {
  let options = userRestrictedApplications
    .filter(r => r.filter != null)
    .map(
      r =>
        ({
          value: r.id,
          label: r.filter!.label,
          scope: r.filter!.scope
        } as OptionsProps)
    )
    .sort((a, b) => compareIgnoreCase(a.label, b.label));

  const hasNoRestrictions = !!(role as any).canConfigureApplications;
  if (hasNoRestrictions) {
    options.unshift(OPTION_NO_RESTRICTIONS);
  }
  return options;
}

export function showContributionFilterDropdown(userRestrictedApplications: UserRestrictedApplication[]) {
  return applicationContributionFilterEnabled && userRestrictedApplications.some(r => r.filter);
}

function limitScope(scope: ApiApplicationScope, groupScope: ApiApplicationScope): ApiApplicationScope {
  if (groupScope === 'INCLUDE_NO_DOWNSTREAM') {
    return 'INCLUDE_NO_DOWNSTREAM';
  }
  if (groupScope === 'INCLUDE_IMMEDIATE_DOWNSTREAM_DATABASE_AND_MESSAGING' && scope === 'INCLUDE_ALL_DOWNSTREAM') {
    return 'INCLUDE_IMMEDIATE_DOWNSTREAM_DATABASE_AND_MESSAGING';
  }
  return scope;
}
