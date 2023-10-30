/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { MapForm, MapFormItems } from 'formalistic';
import React from 'react';

import { Button, Typography } from '@instana/components';

//@ts-expect-error not migrated to typescript yet
import CreateApplicationQueryBuilder from 'in-applications/creation/components/CreateApplicationQueryBuilder';
//@ts-expect-error not migrated to typescript yet
import ApplicationScopeSelector from 'in-applications/creation/components/ApplicationScopeSelector';
import { getField, updateFormField } from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/form';
import HorizontalFlexWrapper from 'in-components/layout/HorizontalFlexWrapper/HorizontalFlexWrapper';
import { FormModelElement } from 'in-components/QueryBuilder/transformation/formModel';
import DescriptionText from 'in-components/form/DescriptionText';
import Input from 'in-components/form/Input/Input';
import Label from 'in-components/form/Label/Label';
import { t } from 'in-i18n';

import locals from './ApplicationContributionFilter.mless';

export interface ApplicationContributionFilterProps<FORM_TYPE extends MapFormItems> {
  form: MapForm<FORM_TYPE>;
  setForm: (form: MapForm<FORM_TYPE>) => void;
}

export default function ApplicationContributionFilter<FORM_TYPE extends MapFormItems>({
  form,
  setForm
}: ApplicationContributionFilterProps<FORM_TYPE>) {
  const tagFilterExpressionField = form.get('tagFilterExpression') as any;
  const tagFilterExpression = tagFilterExpressionField?.value as FormModelElement[];
  const groupNameField = getField<string>(form, 'label');

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
        {t('in-settings:PermissionSection.contributionFilter_description.firstLine')}
        {t('in-settings:PermissionSection.contributionFilter_description.secondLine', { logicalOperator: 'AND' })}
      </DescriptionText>

      <Label className={locals.contributionFilter_groupLabel}>
        {t('in-settings:PermissionSection.contributionFilter_name')}
        <Input
          id="contributionFilter-name"
          onChange={e => setForm(updateFormField(form, 'label', e.target.value, true))}
          value={groupNameField?.value ?? ''}
        />
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

        <HorizontalFlexWrapper>
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
