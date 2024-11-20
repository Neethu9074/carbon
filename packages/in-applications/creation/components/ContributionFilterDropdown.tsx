/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useCallback, useEffect, useMemo } from 'react';
import { MapForm } from 'formalistic';
import classNames from 'classnames';

import { ApiApplicationScope, TagFilterExpressionElementUnion, UserGroupRestrictions } from '@instana/types';
import { t } from '@instana/i18n-react';

//@ts-expect-error
import CreateApplicationQueryBuilder from 'in-applications/creation/components/CreateApplicationQueryBuilder';
import { updateTagFilterExpressionValidator } from 'in-applications/creation/form/createApplicationForm';
import { fromBackendModel } from 'in-components/QueryBuilder/transformation/formModel';
import ComboBoxBehavior from 'in-components/form/ComboBox/ComboBoxBehavior';
import DropdownButton from 'in-components/Button/DropdownButton';
import { carbonButtonEnabled } from 'in-services/featureFlags';
import { compareIgnoreCase } from 'in-services/util/string';

import locals from './ContributionFilterDropdown.mless';

interface ContributionFilterDropdownProps {
  userRestrictedApplications: UserGroupRestrictions[];
  form?: MapForm<any>;
  updateForm?: (form: MapForm<any>) => void;
  disabled: boolean;
  readonly?: boolean;
  className?: string;
}
interface OptionsProps {
  value: string | null;
  label: any;
  scope: ApiApplicationScope;
  labelTxt: string;
  tagFilterExpression: TagFilterExpressionElementUnion | undefined;
}

const OPTION_NO_RESTRICTIONS: OptionsProps = {
  value: null, // indicates to the backend that no restrictions should be applied
  label: (
    <div className={locals.contribution_filter_label_txt}>
      <h4>{t('in-applications:creation.noContributionFilter')}</h4>
      <p className={locals.contribution_filter_label_description}>
        {t('in-applications:creation.noContributionFilterDescription')}
      </p>
    </div>
  ),
  scope: 'INCLUDE_ALL_DOWNSTREAM',
  labelTxt: t('in-applications:creation.noContributionFilter'),
  tagFilterExpression: undefined
};

export default function ContributionFilterDropdown({
  userRestrictedApplications,
  form,
  updateForm,
  disabled = false,
  readonly = false,
  className
}: ContributionFilterDropdownProps): JSX.Element {
  const restrictingApplicationIdField = form?.get('restrictingApplicationId');
  const currentRestrictingApplicationId = readonly
    ? userRestrictedApplications[0]?.filter?.restrictingApplicationId
    : restrictingApplicationIdField?.value;

  const onGroupIdChange = useCallback(
    (value: string | null) => {
      const groupScope =
        userRestrictedApplications.find(r => r.filter?.restrictingApplicationId === value)?.filter?.scope ??
        'INCLUDE_ALL_DOWNSTREAM';
      if (form && updateForm) {
        let updatedForm = form
          .updateIn(['restrictingApplicationId'], field => field.setValue(value).setTouched(true))
          .updateIn(['scope'], field => field.setValue(limitScope(field.value, groupScope)).setTouched(true));

        updatedForm = updateTagFilterExpressionValidator(updatedForm, value);

        updateForm(updatedForm);
      }
    },
    [form, updateForm, userRestrictedApplications]
  );

  const options: OptionsProps[] = useMemo(
    () => createOptions(userRestrictedApplications),
    [userRestrictedApplications]
  );

  useEffect(() => {
    if (!readonly) {
      const shouldSelectDefault = restrictingApplicationIdField.value == null && options.length === 1;
      if (shouldSelectDefault) {
        onGroupIdChange(options[0].value);
      }
    }
  }, [readonly, restrictingApplicationIdField?.value, onGroupIdChange, options, userRestrictedApplications]);

  return (
    <ComboBoxBehavior
      value={currentRestrictingApplicationId}
      options={options}
      onChange={onGroupIdChange}
      disableAutomaticOptionSorting
      aria-label={t('in-applications:creation.selectContributionFilter')}
      listItemClassName={className}
      listItemAlignment={'left'}
    >
      {({ elementProps, isOpen }) => (
        // @ts-expect-error not fully matching expected type
        <DropdownButton
          {...elementProps}
          kind={carbonButtonEnabled ? 'action' : 'subtle'}
          expanded={isOpen}
          disabled={disabled}
          className={carbonButtonEnabled ? locals.dropdownCarbonButton : locals.dropdownButton}
          spanClassName={carbonButtonEnabled ? undefined : locals.span}
        >
          {renderSelectedOption(options, currentRestrictingApplicationId, true)}
        </DropdownButton>
      )}
    </ComboBoxBehavior>
  );
}

function renderSelectedOption(options: OptionsProps[], value: string, truncateText: boolean) {
  const selectedItemObj = options.find(o => o.value === value);
  const tagFilterData = fromBackendModel(selectedItemObj?.tagFilterExpression);
  return selectedItemObj?.value ? (
    <AdvancedModeDropdownItem
      query={tagFilterData}
      labelTxt={selectedItemObj?.labelTxt}
      truncateText={truncateText}
      isOpen
    />
  ) : selectedItemObj?.labelTxt === t('in-applications:creation.noContributionFilter') ? (
    t('in-applications:creation.noContributionFilter')
  ) : (
    t('in-applications:creation.selectContributionFilter')
  );
}

function createOptions(userRestrictedApplications: UserGroupRestrictions[]): OptionsProps[] {
  let options = userRestrictedApplications
    .filter(r => r.filter != null)
    .map(r => {
      const tagFilterData = fromBackendModel(r.filter?.tagFilterExpression);
      return {
        value: r.filter!.restrictingApplicationId,
        label: <AdvancedModeDropdownItem query={tagFilterData} labelTxt={r.filter!.label} isOpen={false} />,
        scope: r.filter!.scope,
        labelTxt: r.filter!.label,
        tagFilterExpression: r.filter?.tagFilterExpression
      } as OptionsProps;
    })
    .sort((a, b) => compareIgnoreCase(a.labelTxt, b.labelTxt));

  if (hasNoRestrictions(userRestrictedApplications)) {
    options.unshift(OPTION_NO_RESTRICTIONS);
  }
  return options;
}

function hasNoRestrictions(userRestrictedApplications: UserGroupRestrictions[]): boolean {
  return userRestrictedApplications.some(r => r.filter == null && r.canConfigureApplications);
}

export function showContributionFilterDropdown(userRestrictedApplications: UserGroupRestrictions[]) {
  return userRestrictedApplications.some(r => r.filter);
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

function AdvancedModeDropdownItem({
  query,
  labelTxt,
  isOpen,
  truncateText = false
}: {
  query: any;
  labelTxt: string | undefined;
  isOpen: boolean;
  truncateText?: boolean;
}) {
  return (
    <div
      className={classNames({
        [locals.showEllipsisForLongText]: truncateText
      })}
    >
      {!isOpen && (
        <div className={locals.contribution_filter_label_txt}>
          <h4>{labelTxt}</h4>
        </div>
      )}
      {query.length !== 0 ? <CreateApplicationQueryBuilder value={query} readOnly /> : null}
    </div>
  );
}
