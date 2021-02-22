/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { find, groupBy } from 'lodash';
import { t } from 'in-i18n';
import React from 'react';

import { useTagFilterExpressionState } from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/tagFilterUtils/useTagFilterExpressionState';
import {
  isRequiringGroupingConfiguration,
  onChangeGrouping
} from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/form';
import GroupingConfiguration from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/GroupingConfiguration';
import CallGroupingConfigurator from 'in-applications/analyze/components/workspace/CallGroupingConfigurator';
import QueryBuilder, { getTagCatalog } from 'in-applications/analyze/components/workspace/CallQueryBuilder';
import QueryBuilderSection from 'in-new-components/QueryBuilder/workspace/QueryBuilderSection';
import SelectInSection from 'in-components/form/Select/SelectInSection';
import { availableMetrics } from 'in-applications/analyze/metrics';
import TouchedMessages from 'in-components/form/TouchedMessages';
import Sections from 'in-new-components/workspace/Sections';
import { compareIgnoreCase } from 'in-services/util/string';
import { aggregationLabels } from 'in-stores/metric/metric';
import { pendingResult } from 'in-services/fixedObjects';
import useTimeConfig from 'in-hooks/useTimeConfig';
import useObservable from 'in-hooks/useObservable';
import Stack from 'in-new-components/layout/Stack';

export default function FormComponent({
  form,
  onChange,
  dataSourceSection,
  labelSection,
  formatterSection,
  timeShiftConfiguration,
  withGrouping = true
}) {
  const metricField = form.get('metric');
  const aggregationField = form.get('aggregation');
  const tagFilterExpressionField = form.get('tagFilterExpression');
  const groupingField = form.get('grouping');
  const timeConfig = useTimeConfig();
  const tagCatalogResult = useObservable(getGetTagCatalogObservable, [timeConfig]) ?? pendingResult;

  const [tagFilterExpression, setTagFilterExpression] = useTagFilterExpressionState({
    tagCatalogResult,
    form,
    onChange
  });

  const grouping = groupingField?.get(0)?.toJS();

  const onByChange = by => onChangeGrouping(onChange, { ...grouping, by });
  const onDirectionChange = direction => onChangeGrouping(onChange, { ...grouping, direction });
  const onIncludeOthersChange = includeOthers => onChangeGrouping(onChange, { ...grouping, includeOthers });
  const aggregators = getAggregations(metricField.value);
  const isSingleAggregator = aggregators?.length < 2;

  return (
    <Stack space="xsmall">
      <Sections>{dataSourceSection}</Sections>

      <Sections>
        <SelectInSection
          label={t('in-custom-dashboards:widgets.srcApp.formComponent.metric')}
          id="metic-configurator-application-metric"
          value={metricField.value}
          onChange={e =>
            onChange([], form =>
              form
                .updateIn(['metric'], field => field.setValue(e.target.value).setTouched(true))
                .updateIn(['aggregation'], field => {
                  const aggregations = getAggregations(e.target.value);
                  return field.setValue(aggregations.length > 1 ? '' : aggregations[0]);
                })
            )
          }
          hasError={!metricField.valid && metricField.touched}
          additionalContent={<TouchedMessages field={metricField} />}
        >
          {
            <>
              <option value="">{t('in-custom-dashboards:widgets.srcApp.formComponent.pleaseSelect')}</option>
              {Object.entries(groupBy(availableMetrics, ({ category }) => category || ''))
                .sort((a, b) => compareIgnoreCase(a.category, b.category))
                .map(([category, metrics]) => {
                  const options = metrics.map(({ metric, label }) => (
                    <option key={metric} value={metric}>
                      {label}
                    </option>
                  ));

                  if (!category) {
                    return options;
                  }

                  return (
                    <optgroup key={category} label={category}>
                      {options}
                    </optgroup>
                  );
                })}
            </>
          }
        </SelectInSection>

        <SelectInSection
          label={t('in-custom-dashboards:widgets.srcApp.formComponent.aggregation')}
          id="metic-configurator-application-aggregation"
          value={aggregationField.value}
          onChange={e => onChange(['aggregation'], field => field.setValue(e.target.value).setTouched(true))}
          hasError={!aggregationField.valid && aggregationField.touched}
          disabled={!metricField.valid || isSingleAggregator}
          additionalContent={<TouchedMessages field={metricField} />}
          useAlternateBg
        >
          {!metricField.valid && <option value="">{t('in-custom-dashboards:widgets.srcApp.formComponent.pleaseSelectMetric')}</option>}
          {metricField.valid && (
            <>
              <option value="">{t('in-custom-dashboards:widgets.srcApp.formComponent.pleaseSelect')}</option>
              {aggregators.map(aggregation => (
                <option key={aggregation} value={aggregation}>
                  {aggregationLabels[aggregation]}
                </option>
              ))}
            </>
          )}
        </SelectInSection>

        {formatterSection}
      </Sections>

      {QueryBuilder && (
        <Sections>
          <QueryBuilderSection
            value={tagFilterExpression}
            onChange={setTagFilterExpression}
            QueryBuilder={QueryBuilder}
            withoutIcon
          />
        </Sections>
      )}

      <GroupingConfiguration
        withGrouping={withGrouping}
        grouping={grouping}
        tagFilterExpressionField={tagFilterExpressionField}
        onByChange={onByChange}
        onDirectionChange={onDirectionChange}
        onIncludeOthersChange={onIncludeOthersChange}
        GroupingConfigurator={CallGroupingConfigurator}
        hasError={groupingField ? groupingField.touched && !groupingField.valid : false}
        additionalContent={<TouchedMessages field={groupingField} />}
        withOptionalMarker={!isRequiringGroupingConfiguration(form)}
      />

      {timeShiftConfiguration}

      {labelSection}
    </Stack>
  );
}

function getGetTagCatalogObservable([timeConfig]) {
  return getTagCatalog({ timeConfig });
}

function getAggregations(metric) {
  return find(availableMetrics, ({ metric: m }) => m === metric)?.supportedAggregations ?? [];
}
