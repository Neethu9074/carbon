import React from 'react';

import TagFilterExpressionConfig from 'in-custom-dashboards/widgets/Slo/sli/TagFilterExpressionConfig';
import TagFilterConfiguration from 'in-custom-dashboards/widgets/Slo/sli/TagFilterConfiguration';
import SliEventsQueryBuilder from 'in-custom-dashboards/widgets/Slo/sli/SliEventsQueryBuilder';
import { availabilityType } from 'in-custom-dashboards/widgets/Slo/sli/sliTypes';
import WithQB1orQB2 from 'in-new-components/Alerting/components/WithQB1orQB2';
import { sliFieldNames } from 'in-custom-dashboards/widgets/Slo/sli/sliForm';
import TouchedMessages from 'in-components/form/TouchedMessages';
import StackItem from 'in-new-components/layout/Stack/StackItem';
import FormBound from 'in-components/form/binding/FormBound';
import useTimeConfig from 'in-hooks/useTimeConfig';
import Header from 'in-new-components/workspace/Header';

import locals from 'in-custom-dashboards/widgets/Slo/sli/GoodBadEventsForm.mless';

const excludedTagFilters = [
  'application.name',
  'application.id',
  'boundary.application.id',
  'call.inbound_of_application'
];
const hiddenFilterNames = ['application.id', 'application.name'];

export default function GoodBadEvents({ applicationName, onChange, QueryBuilderComponent = SliEventsQueryBuilder }) {
  const timeConfig = useTimeConfig();

  return (
    <FormBound path="sliEntity">
      {({ form, setForm, absolutePath, item: sliEntityForm }) => {
        const sliTypeForm = sliEntityForm.get('sliType');
        const sliType = sliTypeForm.value;

        if (sliType !== availabilityType) {
          return null;
        }

        const goodEventFiltersForm = sliEntityForm?.get('goodEventFilters');
        const badEventFiltersForm = sliEntityForm?.get('badEventFilters');

        const applicationIdTagFilter = {
          entity: 'DESTINATION',
          name: 'application.id',
          operator: 'EQUALS',
          stringValue: sliEntityForm.get('applicationId').value
        };

        const applicationNameTagFilter = {
          entity: 'DESTINATION',
          name: 'application.name',
          operator: 'EQUALS',
          stringValue: applicationName
        };

        const goodEventFilters = [
          ...(goodEventFiltersForm?.value ?? []),
          applicationIdTagFilter,
          applicationNameTagFilter
        ];
        const badEventFilters = [
          ...(badEventFiltersForm?.value ?? []),
          applicationIdTagFilter,
          applicationNameTagFilter
        ];

        const onGoodChange = params => {
          onChange(['sliEntity', 'goodEventFilters'], f =>
            f.setValue(withoutViewHiddenFilters(params)).setTouched(true)
          );
        };

        const onBadChange = params => {
          onChange(['sliEntity', 'badEventFilters'], f =>
            f.setValue(withoutViewHiddenFilters(params)).setTouched(true)
          );
        };

        return (
          <StackItem>
            <Header>Good Events</Header>
            <WithQB1orQB2
              onUsesQB1={() => (
                <>
                  <TagFilterConfiguration
                    tagFilters={goodEventFilters}
                    onChange={onGoodChange}
                    timeConfig={timeConfig}
                    excludedTagFilters={excludedTagFilters}
                    hiddenFilterNames={hiddenFilterNames}
                  />
                  {goodEventFiltersForm && (
                    <TouchedMessages field={goodEventFiltersForm} className={locals.validationText} />
                  )}
                </>
              )}
              onUsesQB2={() => (
                <div className={locals.withBottomGap}>
                  <TagFilterExpressionConfig
                    form={sliEntityForm}
                    updateForm={newForm => {
                      setForm(form.updateIn(absolutePath, () => newForm));
                    }}
                    formFieldName={sliFieldNames.goodEventFilterExpression}
                    QueryBuilderComponent={QueryBuilderComponent}
                    applicationLabel={applicationName}
                  />
                </div>
              )}
            />
            <Header>Bad Events</Header>
            <WithQB1orQB2
              onUsesQB1={() => (
                <>
                  <TagFilterConfiguration
                    tagFilters={badEventFilters}
                    onChange={onBadChange}
                    timeConfig={timeConfig}
                    excludedTagFilters={excludedTagFilters}
                    hiddenFilterNames={hiddenFilterNames}
                  />
                  {badEventFiltersForm && (
                    <TouchedMessages field={badEventFiltersForm} className={locals.validationText} />
                  )}
                </>
              )}
              onUsesQB2={() => {
                const field = sliEntityForm.get(sliFieldNames.badEventFilterExpression);
                return (
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
                );
              }}
            />
          </StackItem>
        );
      }}
    </FormBound>
  );
}

function withoutViewHiddenFilters(tagFilters) {
  return tagFilters.filter(tf => !hiddenFilterNames.includes(tf.name));
}
