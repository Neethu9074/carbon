/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { MapForm, MapFormItems } from 'formalistic';
import React, { useEffect, useState } from 'react';

import { Button, Typography } from '@instana/components';
import { Disposable } from '@instana/observables';

//@ts-expect-error not migrated to typescript yet
import CreateApplicationQueryBuilder from 'in-applications/creation/components/CreateApplicationQueryBuilder';
import {
  contributionFilterNameValidator,
  getField,
  updateFormField
} from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/form';
//@ts-expect-error not migrated to typescript yet
import ApplicationScopeSelector from 'in-applications/creation/components/ApplicationScopeSelector';
import HorizontalFlexWrapper from 'in-components/layout/HorizontalFlexWrapper/HorizontalFlexWrapper';
import { getApplicationsWithDefaults } from 'in-applications/subscriptions/getApplications';
import { FormModelElement } from 'in-components/QueryBuilder/transformation/formModel';
import DescriptionText from 'in-components/form/DescriptionText';
import TouchedMessages from 'in-components/form/TouchedMessages';
import Input from 'in-components/form/Input/Input';
import Label from 'in-components/form/Label/Label';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { t } from 'in-i18n';

import locals from './ApplicationContributionFilter.mless';

export interface ApplicationContributionFilterProps<FORM_TYPE extends MapFormItems> {
  form: MapForm<FORM_TYPE>;
  setForm: (form: MapForm<FORM_TYPE>) => void;
  setValid?: (isValid: boolean) => void;
}

export default function ApplicationContributionFilter<FORM_TYPE extends MapFormItems>({
  form,
  setForm,
  setValid = (_isValid: boolean) => {}
}: ApplicationContributionFilterProps<FORM_TYPE>) {
  const timeConfig = useTimeConfig();
  const tagFilterExpressionField = form.get('tagFilterExpression') as any;
  const tagFilterExpression = tagFilterExpressionField?.value as FormModelElement[];
  const filterNameField = getField<string>(form, 'label');
  const [filterName, setFilterName] = useState(filterNameField?.value ?? '');
  const [isFilterNameValid, setFilterNameValid] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let appsDisposable: Disposable;
    // Already invalid (blank or larger than 128 characters)
    if (contributionFilterNameValidator(filterName) !== null) {
      setValid(false);
    } else {
      // Check if contribution filter name already exists as application perspective name
      const appsObservable = getApplicationsWithDefaults({
        timeConfig: timeConfig,
        query: filterName,
        page: 1,
        pageSize: 200,
        orderBy: 'callsAgg',
        orderDirection: 'DESC',
        contextScope: 'NONE'
      });

      appsDisposable = appsObservable.subscribe(result => {
        if (result?.data) {
          // Name is valid if no application perspectives with the same name are found
          const isNameValid = !result?.data?.items?.some((app: any) => {
            return filterName === app?.application?.label;
          });

          setFilterNameValid(isNameValid);
          setErrorMessage(isNameValid ? '' : t('in-settings:PermissionSection.contributionFilter_name_alreadyUsed'));

          // Report valid
          setValid(isNameValid);
        }
      });
    }

    return () => {
      // Clean up
      appsDisposable?.dispose();
    };
  }, [filterName, setValid, timeConfig]);

  const setTagFilterExpression = (
    tagFilterExpression: FormModelElement[],
    form: MapForm<FORM_TYPE>,
    setForm: (form: MapForm<FORM_TYPE>) => void
  ) => {
    setForm(updateFormField(form, 'tagFilterExpression', tagFilterExpression, true));
  };

  return (
    <div className={locals.contributionFilter}>
      <Typography variant="body-regular" component="div">
        {t('in-settings:PermissionSection.contribution_filter')}
      </Typography>

      <DescriptionText className={locals.contributionFilter_descriptionText}>
        {t('in-settings:PermissionSection.contributionFilter_description', { logicalOperator: 'AND' })}
      </DescriptionText>

      <Label className={locals.contributionFilter_groupLabel}>
        {t('in-settings:PermissionSection.contributionFilter_name')}
        <Input
          id="application-contribution-filter-name"
          onChange={e => {
            setFilterName(e.target.value);
            setForm(updateFormField(form, 'label', e.target.value, true));
          }}
          value={filterNameField?.value ?? ''}
          hasError={!filterNameField?.valid || !isFilterNameValid}
        />
        {errorMessage ? (
          <p className={locals.contributionFilter_errorMessage}>{errorMessage}</p>
        ) : (
          <TouchedMessages field={filterNameField} />
        )}
      </Label>
      <div className={locals.contributionFilter_queryBuilder}>
        <div className={locals.contributionFilter_queryBuilderExpression}>
          <CreateApplicationQueryBuilder
            value={tagFilterExpression}
            onChange={(tagFilterExpression: FormModelElement[]) => {
              setTagFilterExpression(tagFilterExpression, form, setForm);
            }}
          />
        </div>
        <HorizontalFlexWrapper className={locals.contributionFilter_clearButton}>
          {tagFilterExpression?.length > 0 && (
            <Button
              kind="subtle"
              icon="lib_openclose_cancel"
              size="compact"
              onClick={() => setTagFilterExpression([], form, setForm)}
            >
              {t('in-applications:creation.advanced.clear')}
            </Button>
          )}
        </HorizontalFlexWrapper>
      </div>
      <Typography variant="body-regular" component="div">
        {t('in-settings:PermissionSection.contributionFilter_downstreamCalls')}
      </Typography>
      <div className={locals.contributionFilter_applicationScope}>
        <ApplicationScopeSelector form={form} updateForm={setForm} />
      </div>
    </div>
  );
}
