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
import FormBound from 'in-components/form/binding/FormBound';
import Divider from 'in-components/workspace/Divider';
import Header from 'in-components/workspace/Header';
import { t } from 'in-i18n';

import locals from 'in-custom-dashboards/widgets/Slo/sli/GoodBadEventsForm.mless';

export default function GoodBadEventsConfigurator({ entityType, label, QueryBuilderComponent }) {
  return (
    <FormBound path="sliEntity">
      {({ form, setForm, absolutePath, item: sliEntityForm }) => {
        const sliTypeForm = sliEntityForm.get('sliType');
        const sliType = sliTypeForm.value;

        if (sliType !== availabilityType && sliType !== websiteEventBased) {
          return null;
        }

        return (
          <>
            <Divider />

            <Stack gap="normal">
              <Header>{t('in-custom-dashboards:widgets.slo.goodBadEventsForm.goodEvents')}</Header>
              {sliEntityForm.get(sliFieldNames.goodEventFilterExpression).map(field => (
                <div className={locals.withBottomGap}>
                  <TagFilterExpressionConfig
                    form={sliEntityForm}
                    formFieldName={sliFieldNames.goodEventFilterExpression}
                    updateForm={newForm => {
                      setForm(form.updateIn(absolutePath, () => newForm));
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
              {sliEntityForm.get(sliFieldNames.badEventFilterExpression).map(field => (
                <div className={locals.withBottomGap}>
                  <TagFilterExpressionConfig
                    form={sliEntityForm}
                    formFieldName={sliFieldNames.badEventFilterExpression}
                    QueryBuilderComponent={QueryBuilderComponent}
                    updateForm={newForm => {
                      setForm(form.updateIn(absolutePath, () => newForm));
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
      }}
    </FormBound>
  );
}
