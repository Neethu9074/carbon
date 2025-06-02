/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { MapForm, MapFormItems } from 'formalistic';
import React, { useEffect, useState } from 'react';

import { Typography, Button } from '@instana/components';
import { Disposable } from '@instana/observables';

//@ts-expect-error not migrated to typescript yet
import CreateApplicationQueryBuilder from 'in-applications/creation/components/CreateApplicationQueryBuilder';
//@ts-expect-error not migrated to typescript yet
import ApplicationScopeSelector from 'in-applications/creation/components/ApplicationScopeSelector';
import {
  getField,
  updateFormField
} from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/form';
import HorizontalFlexWrapper from 'in-components/layout/HorizontalFlexWrapper/HorizontalFlexWrapper';
import { contributionFilterNameExists } from 'in-settings/tabs/SecurityAndAccess/api/groups';
import { SETTINGS_GROUP_APPLICATION_FILTER_ADDED } from 'in-services/tracking/tracking';
import { FormModelElement } from 'in-components/QueryBuilder/transformation/formModel';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import DescriptionText from 'in-components/form/DescriptionText';
import TouchedMessages from 'in-components/form/TouchedMessages';
import useDebounce from 'in-settings/hooks/useDebounce';
import Input from 'in-components/form/Input/Input';
import Label from 'in-components/form/Label/Label';
import { t } from 'in-i18n';

import locals from './ApplicationContributionFilter.mless';

export interface ApplicationContributionFilterProps<FORM_TYPE extends MapFormItems> {
  form: MapForm<FORM_TYPE>;
  setForm: (form: MapForm<FORM_TYPE>) => void;
  setValid?: (isValid: boolean) => void;
  editMode?: boolean;
  filterExpressionFieldName?: Extract<keyof FORM_TYPE, string> | string;
  filterNameFieldName?: Extract<keyof FORM_TYPE, string> | string;
}

export default function ApplicationContributionFilter<FORM_TYPE extends MapFormItems>({
  form,
  setForm,
  setValid = (_isValid: boolean) => {},
  editMode,
  filterExpressionFieldName = 'tagFilterExpression',
  filterNameFieldName = 'label'
}: ApplicationContributionFilterProps<FORM_TYPE>) {
  const tagFilterExpressionField = form.get(filterExpressionFieldName) as any;
  const tagFilterExpression = tagFilterExpressionField?.value as FormModelElement[];
  const filterNameField = getField<string>(form, filterNameFieldName);
  const filterName = filterNameField?.value?.trim();
  const [initialfilterName] = useState(filterNameField?.value);
  const [isFilterNameValid, setIsFilterNameValid] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>('');
  const { trackCta } = useSegmentTracking();

  let appsDisposable: Disposable;

  const debouncedValidation = useDebounce(() => {
    if (filterName) {
      // Existing group with contribution filter should not be validated again on edit, as the corresponding application perspective already exists
      if (editMode && initialfilterName === filterName) {
        setValid(true);
        setErrorMessage(null);
      } else {
        const appsObservable = contributionFilterNameExists(filterName);
        if (appsDisposable) {
          // Clean up
          appsDisposable?.dispose();
        }
        appsDisposable = appsObservable.subscribe(result => {
          if (result?.data) {
            // Name is valid if no application perspective with the same name is found
            const isNameValid = result.data.exists === false;
            setIsFilterNameValid(isNameValid);
            setErrorMessage(isNameValid ? '' : t('in-settings:PermissionSection.contributionFilter_name_alreadyUsed'));

            // Report valid
            setValid(isNameValid);
          }
        });
      }
    }
  }, 500);

  useEffect(() => {
    // Already invalid (blank or larger than 128 characters)
    if (!filterNameField?.valid) {
      setValid(false);
      setErrorMessage(null);
    } else {
      // Validate against API
      debouncedValidation();
    }
  }, [filterName, filterNameField?.valid, debouncedValidation, setValid]);

  const setTagFilterExpression = (
    tagFilterExpression: FormModelElement[],
    form: MapForm<FORM_TYPE>,
    setForm: (form: MapForm<FORM_TYPE>) => void
  ) => {
    setForm(updateFormField(form, filterExpressionFieldName, tagFilterExpression, true));
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
            setForm(updateFormField(form, filterNameFieldName, e.target.value, true));
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
            tracking={{
              onTagAdded: () =>
                trackCta(SETTINGS_GROUP_APPLICATION_FILTER_ADDED, { groupId: getField(form, 'id')?.value })
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
