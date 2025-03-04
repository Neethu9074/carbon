/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useCallback, useEffect, useMemo } from 'react';
import { MapForm } from 'formalistic';
import classNames from 'classnames';

import { ApiApplicationScope, TagFilterExpressionElementUnion, UserGroupRestrictions } from '@instana/types';
import { CarbonMenuButton as MenuButton, CarbonMenuItem as MenuItem, Typography } from '@instana/components';
import { t } from '@instana/i18n-react';

//@ts-expect-error
import CreateApplicationQueryBuilder from 'in-applications/creation/components/CreateApplicationQueryBuilder';
import { updateTagFilterExpressionValidator } from 'in-applications/creation/form/createApplicationForm';
import { fromBackendModel } from 'in-components/QueryBuilder/transformation/formModel';
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
    <div>
      <Typography variant="heading-01">{t('in-applications:creation.noContributionFilter')}</Typography>
      <Typography variant="label-01">{t('in-applications:creation.noContributionFilterDescription')}</Typography>
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

  const onClick = (item: OptionsProps) => {
    onGroupIdChange(item.value);
  };

  return (
    <MenuButton
      kind="tertiary"
      size="sm"
      menuAlignment="bottom-start"
      className={locals.menuButton}
      label={renderSelectedOption(options.find((item: OptionsProps) => item.value === currentRestrictingApplicationId))}
      disabled={disabled}
      aria-label={t('in-applications:creation.selectContributionFilter')}
    >
      {options.map(item => (
        <MenuItem
          key={item.value}
          label={item.label}
          aria-label={item.labelTxt}
          onClick={() => onClick(item)}
          className={classNames(className, {
            [locals.menuitem]: true,
            [locals.selected]: item.value === currentRestrictingApplicationId
          })}
        />
      ))}
    </MenuButton>
  );
}

function renderSelectedOption(selectedItemObj: OptionsProps | undefined) {
  if (selectedItemObj?.value) return selectedItemObj.label;
  return selectedItemObj?.label
    ? t('in-applications:creation.noContributionFilter')
    : t('in-applications:creation.selectContributionFilter');
}

function createOptions(userRestrictedApplications: UserGroupRestrictions[]): OptionsProps[] {
  let options = userRestrictedApplications
    .filter(r => r.filter != null)
    .map(r => {
      const tagFilterData = fromBackendModel(r.filter?.tagFilterExpression);
      return {
        value: r.filter!.restrictingApplicationId,
        label: <AdvancedModeDropdownItem query={tagFilterData} labelTxt={r.filter!.label} />,
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
  truncateText = false
}: {
  query: any;
  labelTxt: string | undefined;
  truncateText?: boolean;
}) {
  return (
    <div
      className={classNames({
        [locals.showEllipsisForLongText]: truncateText
      })}
    >
      <Typography variant="heading-01">{labelTxt}</Typography>
      {query.length !== 0 ? <CreateApplicationQueryBuilder value={query} readOnly /> : null}
    </div>
  );
}
