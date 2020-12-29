import React, { useEffect } from 'react';

import TypeAndMetricConfigurator from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/infrastructure/metrics/TypeAndMetricConfigurator';
import { useTagFilterExpressionState } from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/tagFilterUtils/useTagFilterExpressionState';
import GroupingConfiguratorSection from 'in-new-components/GroupingConfigurator/GroupingConfiguratorSection';
import { EMPTY_EXPRESSION } from 'in-new-components/QueryBuilder/transformation/backendQueryModel';
import QueryBuilder, { getTagCatalog } from 'in-infrastructure/Explore/components/QueryBuilder';
import { onChangeGrouping } from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/form';
import QueryBuilderSection from 'in-new-components/QueryBuilder/workspace/QueryBuilderSection';
import GroupingConfigurator from 'in-infrastructure/Explore/components/GroupingConfigurator';
import getMetricCatalog from 'in-infrastructure/subscriptions/getMetricCatalog';
import SelectInSection from 'in-components/form/Select/SelectInSection';
import useMetricCatalog from 'in-infrastructure/hooks/useMetricCatalog';
import TouchedMessages from 'in-components/form/TouchedMessages';
import { aggregationLabels } from 'in-stores/metric/beeInstant';
import Sections from 'in-new-components/workspace/Sections';
import Section from 'in-new-components/workspace/Section';
import { pendingResult } from 'in-services/fixedObjects';
import Stack from 'in-new-components/layout/Stack';
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

  const tagCatalogResult = useObservable(getTagCatalog, []) ?? pendingResult;
  const [tagFilterExpression, setTagFilterExpression] = useTagFilterExpressionState({
    tagCatalogResult,
    form,
    onChange
  });

  const metricCatalog = useMetricCatalog({
    getMetricCatalog,
    tagFilterExpression: tagFilterExpressionField.valid ? tagFilterExpressionField.value : EMPTY_EXPRESSION
  });
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
          value={tagFilterExpression}
          onChange={setTagFilterExpression}
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
          additionalContent={<TouchedMessages field={aggregationField} />}
        >
          {!metricField.valid && <option value="">Please select a metric</option>}
          {metricField.valid && (
            <>
              <option value="">Please select</option>
              {Object.keys(aggregationLabels).map(aggregation => (
                <option key={aggregation} value={aggregation}>
                  {aggregationLabels[aggregation]}
                </option>
              ))}
            </>
          )}
        </SelectInSection>
      </Sections>

      {timeShiftConfiguration}

      {labelSection}
    </Stack>
  );
}

function getGrouping(form) {
  return form
    .get('grouping')
    ?.get(0)
    ?.toJS();
}
