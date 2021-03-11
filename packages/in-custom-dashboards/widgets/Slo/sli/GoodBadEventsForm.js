/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import TagFilterExpressionConfig from 'in-custom-dashboards/widgets/Slo/sli/TagFilterExpressionConfig';
import SliEventsQueryBuilder from 'in-custom-dashboards/widgets/Slo/sli/SliEventsQueryBuilder';
import { availabilityType } from 'in-custom-dashboards/widgets/Slo/sli/sliTypes';
import { sliFieldNames } from 'in-custom-dashboards/widgets/Slo/sli/sliForm';
import TouchedMessages from 'in-components/form/TouchedMessages';
import FormBound from 'in-components/form/binding/FormBound';
import Divider from 'in-new-components/workspace/Divider';
import Header from 'in-new-components/workspace/Header';
import Stack from 'in-new-components/layout/Stack';
import { t } from 'in-i18n';

import locals from 'in-custom-dashboards/widgets/Slo/sli/GoodBadEventsForm.mless';

export default function GoodBadEvents({ applicationName, QueryBuilderComponent = SliEventsQueryBuilder }) {
  return (
    <FormBound path="sliEntity">
      {({ form, setForm, absolutePath, item: sliEntityForm }) => {
        const sliTypeForm = sliEntityForm.get('sliType');
        const sliType = sliTypeForm.value;

        if (sliType !== availabilityType) {
          return null;
        }

        return (
          <>
            <Divider />

            <Stack space="normal">
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
                    applicationLabel={applicationName}
                  />
                  {field && <TouchedMessages field={field} className={locals.validationText} />}
                </div>
              ))}
            </Stack>

            <Divider />

            <Stack space="normal">
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
                    applicationLabel={applicationName}
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
