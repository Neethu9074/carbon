/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Field, MapForm } from 'formalistic';
import React from 'react';

import { Stack } from '@instana/components';

import { availabilityType, SliEntityType, websiteEventBased } from 'in-custom-dashboards/widgets/Slo/sli/sliTypes';
import TagFilterExpressionConfig from 'in-custom-dashboards/widgets/Slo/sli/TagFilterExpressionConfig';
import { FormModelElement } from 'in-components/QueryBuilder/transformation/formModel';
import { MonitoringSource } from 'in-custom-dashboards/widgets/Slo/constants';
import { sliFieldNames } from 'in-custom-dashboards/widgets/Slo/sli/sliForm';
import { QueryBuilderComponent } from 'in-components/QueryBuilder';
import TouchedMessages from 'in-components/form/TouchedMessages';
import Divider from 'in-components/workspace/Divider';
import Header from 'in-components/workspace/Header';
import { t } from 'in-i18n';

import locals from 'in-custom-dashboards/widgets/Slo/sli/GoodBadEventsForm.mless';

interface GoodBadEventsConfiguratorProps {
  entityType: MonitoringSource;
  label?: string;
  form: MapForm;
  updateForm: (updatedForm: MapForm) => void;
  QueryBuilderComponent: QueryBuilderComponent;
}

export default function GoodBadEventsConfigurator({
  entityType,
  label,
  QueryBuilderComponent,
  form,
  updateForm
}: GoodBadEventsConfiguratorProps) {
  const sliTypeForm = form.get('sliType') as Field<SliEntityType>;
  const sliType = sliTypeForm.value;

  if (sliType !== availabilityType && sliType !== websiteEventBased) {
    return null;
  }

  return (
    <>
      <Divider />

      <Stack gap="normal">
        <Header>{t('in-custom-dashboards:widgets.slo.goodBadEventsForm.goodEvents')}</Header>
        {(form.get(sliFieldNames.goodEventFilterExpression) as Field<FormModelElement[]>).map(field => (
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
        {(form.get(sliFieldNames.badEventFilterExpression) as Field<FormModelElement[]>).map(field => (
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
