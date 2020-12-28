import React, { useState, useEffect } from 'react';

import TypeAndMetricConfigurator from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/infrastructure/metrics/TypeAndMetricConfigurator';
import GroupingConfiguratorSection from 'in-new-components/GroupingConfigurator/GroupingConfiguratorSection';
import { toBackendQueryModel } from 'in-new-components/QueryBuilder/transformation/backendQueryModel';
import { EMPTY_EXPRESSION } from 'in-new-components/QueryBuilder/transformation/backendQueryModel';
import { onChangeGrouping } from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/form';
import QueryBuilderSection from 'in-new-components/QueryBuilder/workspace/QueryBuilderSection';
import QueryBuilder, { isQueryValid } from 'in-infrastructure/Explore/components/QueryBuilder';
import GroupingConfigurator from 'in-infrastructure/Explore/components/GroupingConfigurator';
import { fromBackendModel } from 'in-new-components/QueryBuilder/transformation/formModel';
import getMetricCatalog from 'in-infrastructure/subscriptions/getMetricCatalog';
import SelectInSection from 'in-components/form/Select/SelectInSection';
import useMetricCatalog from 'in-infrastructure/hooks/useMetricCatalog';
import TouchedMessages from 'in-components/form/TouchedMessages';
import { aggregationLabels } from 'in-stores/metric/beeInstant';
import Sections from 'in-new-components/workspace/Sections';
import Section from 'in-new-components/workspace/Section';
import { pendingResult } from 'in-services/fixedObjects';
import Stack from 'in-new-components/layout/Stack';
import useTimeConfig from 'in-hooks/useTimeConfig';
import useObservable from 'in-hooks/useObservable';

export default function FormComponent({
  form,
  onChange,
  dataSourceSection,
  labelSection,
  timeShiftConfiguration,
  withGrouping = true
}) {
  const typeField = form.get('type');
  const metricField = form.get('metric');
  const aggregationField = form.get('aggregation');
  const tagFilterExpressionField = form.get('tagFilterExpression');
  const [formModelExpression, setFormModelExpression] = useState(() =>
    fromBackendModel(tagFilterExpressionField.value)
  );
  const timeConfig = useTimeConfig();
  const validTagFilterExpressionResult =
    useObservable(getIsQueryValidObservable, [formModelExpression, timeConfig]) ?? pendingResult;
  const formModelIsValid = validTagFilterExpressionResult.data === true;
  useEffect(() => {
    onChange(['tagFilterExpression'], field =>
      formModelIsValid
        ? field.setValue(toBackendQueryModel(formModelExpression, false))
        : field.setValue(EMPTY_EXPRESSION)
    );
  }, [formModelIsValid, formModelExpression]);

  const metricCatalog = useMetricCatalog({ getMetricCatalog, tagFilterExpression: tagFilterExpressionField.value });
  const category = 'Infrastructure';

  useEffect(() => {
    if (
      metricCatalog.data &&
      metricField.value &&
      !(
        metricCatalog.data.metrics[category] &&
        metricCatalog.data.metrics[category][typeField.value] &&
        metricCatalog.data.metrics[category][typeField.value][metricField.value]
      )
    ) {
      // reset metric field when the selected metric is not in the catalog
      onChange([], () =>
        form
          .updateIn(['metric'], field => field.setValue(undefined).setTouched(true))
          .updateIn(['type'], field => field.setValue(undefined).setTouched(true))
      );
    }
  }, [metricCatalog]);

  return (
    <Stack space="xsmall">
      {dataSourceSection}

      <Sections>
        <QueryBuilderSection
          value={formModelExpression}
          onChange={setFormModelExpression}
          QueryBuilder={QueryBuilder}
          withoutIcon
        />
      </Sections>

      {withGrouping && (
        <>
          <Sections>
            <GroupingConfiguratorSection
              value={getGrouping(form)?.by}
              GroupingConfigurator={GroupingConfigurator}
              tagFilterExpression={tagFilterExpressionField.valid ? tagFilterExpressionField.value : EMPTY_EXPRESSION}
              onChange={infraExploreGrouping => onChangeGrouping(onChange, { by: infraExploreGrouping })}
            />
          </Sections>

          <Sections>
            <SelectInSection
              label="Select"
              id="select-top-groups"
              value={getGrouping(form)?.direction}
              onChange={e => onChangeGrouping(onChange, { ...getGrouping(form), direction: e.target.value })}
              disabled={!getGrouping(form)}
            >
              <option value="DESC">Top 5</option>
              <option value="ASC">Bottom 5</option>
            </SelectInSection>
          </Sections>
        </>
      )}

      <Sections>
        <Section title="Metric">
          <TypeAndMetricConfigurator
            type={typeField.value}
            metric={metricField.value}
            metricCatalog={metricCatalog}
            onChange={({ metric, type }) =>
              onChange([], form =>
                form
                  .updateIn(['metric'], field => field.setValue(metric).setTouched(true))
                  .updateIn(['type'], field => field.setValue(type).setTouched(true))
              )
            }
            label="Select metric"
          />
          <TouchedMessages field={metricField} />
        </Section>
      </Sections>

      <Sections>
        <SelectInSection
          label="Aggregation"
          id="metric-configurator-infra-aggregation"
          value={aggregationField.value}
          onChange={e => onChange(['aggregation'], field => field.setValue(e.target.value).setTouched(true))}
        >
          {!aggregationField.valid && <option value="">Please select an aggregation</option>}
          {aggregationField.valid && (
            <>
              {Object.keys(aggregationLabels).map(aggregation => (
                <option key={aggregation} value={aggregation}>
                  {aggregationLabels[aggregation]}
                </option>
              ))}
            </>
          )}
        </SelectInSection>
        <TouchedMessages field={aggregationField} />
      </Sections>

      {timeShiftConfiguration}

      {labelSection}
    </Stack>
  );
}

function getIsQueryValidObservable([tagFilterExpression, timeConfig]) {
  return isQueryValid(tagFilterExpression, timeConfig);
}

function getGrouping(form) {
  return form
    .get('grouping')
    ?.get(0)
    ?.toJS();
}
