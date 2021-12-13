/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Stack } from '@instana/components';

import TagFilterExpressionConfig from 'in-custom-dashboards/widgets/Slo/sli/TagFilterExpressionConfig';
import { availabilityType, websiteEventBased } from 'in-custom-dashboards/widgets/Slo/sli/sliTypes';
import { sliFieldNames } from 'in-custom-dashboards/widgets/Slo/sli/sliForm';
import TouchedMessages from 'in-components/form/TouchedMessages';
import Divider from 'in-components/workspace/Divider';
import Header from 'in-components/workspace/Header';
import { t } from 'in-i18n';

import locals from 'in-custom-dashboards/widgets/Slo/sli/GoodBadEventsForm.mless';

export default function GoodBadEventsConfigurator({ entityType, label, QueryBuilderComponent, form, updateForm }) {
  const sliTypeForm = form.get('sliType');
  const sliType = sliTypeForm.value;

  if (sliType !== availabilityType && sliType !== websiteEventBased) {
    return null;
  }

  return (
    <>
      <Divider />

      <Stack gap="normal">
        <Header>{t('in-custom-dashboards:widgets.slo.goodBadEventsForm.goodEvents')}</Header>
        {form.get(sliFieldNames.goodEventFilterExpression).map(field => (
          <div className={locals.withBottomGap}>
            <TagFilterExpressionConfig
              form={form}
              formFieldName={sliFieldNames.goodEventFilterExpression}
              updateForm={newForm => {
                updateForm(newForm);
              }}
              QueryBuilderComponent={QueryBuilderComponent}
              label={label}
              entityType={entityType}
            />
            {field && <TouchedMessages field={field} className={locals.validationText} />}
          </div>
        ))}
      </Stack>

      <Divider />

      <Stack gap="normal">
        <Header>{t('in-custom-dashboards:widgets.slo.goodBadEventsForm.badEvents')}</Header>
        {form.get(sliFieldNames.badEventFilterExpression).map(field => (
          <div className={locals.withBottomGap}>
            <TagFilterExpressionConfig
              form={form}
              formFieldName={sliFieldNames.badEventFilterExpression}
              QueryBuilderComponent={QueryBuilderComponent}
              updateForm={newForm => {
                updateForm(newForm);
              }}
              label={label}
              entityType={entityType}
            />
            {field && <TouchedMessages field={field} className={locals.validationText} />}
          </div>
        ))}
      </Stack>
    </>
  );
}
