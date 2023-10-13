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
import HorizontalFlexWrapper from 'in-components/layout/HorizontalFlexWrapper/HorizontalFlexWrapper';
import { FormModelElement } from 'in-components/QueryBuilder/transformation/formModel';
import DescriptionText from 'in-components/form/DescriptionText';
import { t } from 'in-i18n';

import locals from './LimitingApplicationFilter.mless';

export interface LimitingApplicationFilterProps<FORM_TYPE extends MapFormItems> {
  form: MapForm<FORM_TYPE>;
  setForm: (form: MapForm<FORM_TYPE>) => void;
  setTagFilterExpression: (
    tagFilterExpression: FormModelElement[],
    form: MapForm<FORM_TYPE>,
    setForm: (form: MapForm<FORM_TYPE>) => void
  ) => void;
  updateApplicationScope: (form: MapForm<FORM_TYPE>) => void;
}

export default function LimitingApplicationFilter({
  form,
  setForm,
  // tagFilterExpression,
  setTagFilterExpression,
  updateApplicationScope
}: LimitingApplicationFilterProps<any>) {
  const tagFilterExpression = form.get('tagFilterExpression')?.value;

  return (
    <div className={locals.limitingFilter}>
      <Typography variant="body-regular" component="div">
        {t('in-settings:PermissionSection.configuration_limitation')}
      </Typography>

      <DescriptionText className={locals.limitingFilter_descriptionText}>
        {t('in-settings:PermissionSection.limitation_description')}
        <a className={locals.limitingFilter_descriptionLink} href="#">
          {t('in-settings:PermissionSection.limitation_description_link')}{' '}
        </a>
      </DescriptionText>

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
        <ApplicationScopeSelector form={form} updateForm={(form: MapForm<any>) => updateApplicationScope(form)} />
      </div>
    </div>
  );
}
