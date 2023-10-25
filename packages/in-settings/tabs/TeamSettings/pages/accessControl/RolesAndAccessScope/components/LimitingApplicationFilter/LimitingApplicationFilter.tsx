/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { MapForm, MapFormItems } from 'formalistic';
import React from 'react';

import { Button, Typography } from '@instana/components';

// import GroupNameSection from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/components/GroupNameSection';
import { getField, updateFormField } from 'in-settings/tabs/TeamSettings/pages/accessControl/RolesAndAccessScope/form';
//@ts-expect-error not migrated to typescript yet
import CreateApplicationQueryBuilder from 'in-applications/creation/components/CreateApplicationQueryBuilder';
//@ts-expect-error not migrated to typescript yet
import ApplicationScopeSelector from 'in-applications/creation/components/ApplicationScopeSelector';
import HorizontalFlexWrapper from 'in-components/layout/HorizontalFlexWrapper/HorizontalFlexWrapper';
import { FormModelElement } from 'in-components/QueryBuilder/transformation/formModel';
import DescriptionText from 'in-components/form/DescriptionText';
import Input from 'in-components/form/Input/Input';
import Label from 'in-components/form/Label/Label';
import { t } from 'in-i18n';

import locals from './LimitingApplicationFilter.mless';

export interface LimitingApplicationFilterProps<FORM_TYPE extends MapFormItems> {
  form: MapForm<FORM_TYPE>;
  setForm: (form: MapForm<FORM_TYPE>) => void;
}

export default function LimitingApplicationFilter<FORM_TYPE extends MapFormItems>({
  form,
  setForm
}: LimitingApplicationFilterProps<FORM_TYPE>) {
  const tagFilterExpressionField = form.get('tagFilterExpression') as any;
  const tagFilterExpression = tagFilterExpressionField?.value as FormModelElement[];
  const groupNameField = getField<string>(form, 'name');

  const setTagFilterExpression = (
    tagFilterExpression: FormModelElement[],
    form: MapForm<FORM_TYPE>,
    setForm: (form: MapForm<FORM_TYPE>) => void
  ) => {
    setForm(updateFormField(form, 'tagFilterExpression', tagFilterExpression, true));
  };

  return (
    <div className={locals.limitingFilter}>
      <Typography variant="body-regular" component="div">
        {t('in-settings:PermissionSection.contribution_filter')}
      </Typography>

      <DescriptionText className={locals.limitingFilter_descriptionText}>
        {t('in-settings:PermissionSection.limitation_description', { logicalOperator: 'AND' })}
      </DescriptionText>

      <Label className={locals.limitingFilter_groupLabel}>
        <Typography variant="body-regular">{t('in-settings:groupSection.title')}</Typography>
        <Input
          id="group-name"
          onChange={e => setForm(updateFormField(form, 'name', e.target.value, true))}
          value={groupNameField?.value ?? ''}
        />
      </Label>
      <div className={locals.limitingFilter_queryBuilder}>
        <div className={locals.limitingFilter_queryBuilderExpression}>
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
        {t('in-settings:PermissionSection.limitation_downstreamCalls')}
      </Typography>
      <div className={locals.limitingFilter_applicationScope}>
        <ApplicationScopeSelector form={form} updateForm={setForm} />
      </div>
    </div>
  );
}
