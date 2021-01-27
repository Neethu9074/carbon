/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import TypeAndMetricConfigurator from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/infrastructure/metrics/TypeAndMetricConfigurator';
import { useTagFilterExpressionState } from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/tagFilterUtils/useTagFilterExpressionState';
import {
  onChangeGrouping,
  isRequiringGroupingConfiguration
} from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/form';
import GroupingConfiguration from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/GroupingConfiguration';
import { EMPTY_EXPRESSION } from 'in-new-components/QueryBuilder/transformation/backendQueryModel';
import QueryBuilder, { getTagCatalog } from 'in-infrastructure/Explore/components/QueryBuilder';
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
  const groupingField = form.get('grouping');
  const grouping = getGrouping(form);
  const onDirectionChange = direction => onChangeGrouping(onChange, { ...grouping, direction });
  const onIncludeOthersChange = includeOthers => onChangeGrouping(onChange, { ...grouping, includeOthers });

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

  return (
    <Stack space="xsmall">
      <Sections>{dataSourceSection}</Sections>
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
        <SelectInSection
          label="Aggregation"
          id="metric-configurator-infra-aggregation"
          value={aggregationField.value}
          onChange={e => onChange(['aggregation'], field => field.setValue(e.target.value).setTouched(true))}
          additionalContent={<TouchedMessages field={aggregationField} />}
          useAlternateBg
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

      <Sections>
        <QueryBuilderSection
          value={tagFilterExpression}
          onChange={setTagFilterExpression}
          QueryBuilder={QueryBuilder}
          withoutIcon
        />
      </Sections>
      <GroupingConfiguration
        withGrouping={withGrouping}
        grouping={grouping}
        tagFilterExpressionField={tagFilterExpressionField}
        onByChange={infraExploreGrouping => onChangeGrouping(onChange, { by: infraExploreGrouping })}
        onDirectionChange={onDirectionChange}
        onIncludeOthersChange={onIncludeOthersChange}
        GroupingConfigurator={GroupingConfigurator}
        hasError={groupingField ? groupingField.touched && !groupingField.valid : false}
        additionalContent={<TouchedMessages field={groupingField} />}
        withOptionalMarker={!isRequiringGroupingConfiguration(form)}
      />

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
