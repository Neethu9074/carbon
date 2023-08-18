/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useEffect } from 'react';

import { Spacer, Stack, Toggle } from '@instana/components';

import TypeAndMetricConfigurator from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/infrastructure/metrics/TypeAndMetricConfigurator';
import { useTagFilterExpressionState } from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/tagFilterUtils/useTagFilterExpressionState';
import getMetricInCatalog from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/infrastructure/metrics/getMetricInCatalog';
import {
  onChangeGrouping,
  isRequiringGroupingConfiguration
} from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/form';
import GroupingConfiguration from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/GroupingConfiguration';
import { invalidMarker } from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/tagFilterUtils/form';
import { EMPTY_EXPRESSION } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import GroupingConfigurator from 'in-infrastructure/Explore/components/GroupingConfigurator';
import QueryBuilderSection from 'in-components/QueryBuilder/workspace/QueryBuilderSection';
import { getUiMetricsValueByBackendType } from 'in-services/formatters/backendFormatter';
import getMetricCatalog from 'in-infrastructure/subscriptions/getMetricCatalog';
import QueryBuilder from 'in-infrastructure/Explore/components/QueryBuilder';
import useMetricMetadatas from 'in-infrastructure/hooks/useMetricMetadatas';
import SelectInSection from 'in-components/form/Select/SelectInSection';
import useMetricCatalog from 'in-infrastructure/hooks/useMetricCatalog';
import useTagCatalog from 'in-infrastructure/hooks/useTagCatalog';
import TouchedMessages from 'in-components/form/TouchedMessages';
import { aggregationLabels } from 'in-stores/metric/beeInstant';
import HelpAction from 'in-components/workspace/HelpAction';
import useDebouncedValue from 'in-hooks/useDebouncedValue';
import { pendingResult } from 'in-services/fixedObjects';
import Sections from 'in-components/workspace/Sections';
import { getKpiDefinitions } from 'in-sdk/metrics/kpis';
import Section from 'in-components/workspace/Section';
import { success } from 'in-services/util/result';
import { noop } from 'in-services/util/function';
import Tooltip from 'in-components/Tooltip';
import { t } from 'in-i18n';

import locals from './FormComponent.mless';

export default function FormComponent({
  form,
  onChange,
  dataSourceSection,
  labelSection,
  formatterSection,
  timeShiftConfiguration,
  withGrouping = true,
  withFiltering = true,
  withAggregationInMetrics = true,
  maxGrouping = 50
}) {
  const typeField = form.get('type');
  const metricField = form.get('metric');
  const aggregationField = form.get('aggregation');
  const crossSeriesAggregationField = form.get('crossSeriesAggregation');
  const allowedCrossSeriesAggregations = form.get('allowedCrossSeriesAggregations');
  const isCrossSeriesAggregationRestricted = allowedCrossSeriesAggregations.value?.length > 0;
  const tagFilterExpressionField = form.get('tagFilterExpression');
  const groupingField = form.get('grouping');
  const metricLabelField = form.get('metricLabel');
  const metricPathField = form.get('metricPath');
  const grouping = getGrouping(form);
  const onDirectionChange = (direction, maxResults) =>
    onChangeGrouping(onChange, { ...grouping, direction, maxResults });
  const onIncludeOthersChange = includeOthers => onChangeGrouping(onChange, { ...grouping, includeOthers });
  const isCrossSeriesSumAggregationToggleEnabled =
    !isCrossSeriesAggregationRestricted && ['MEAN', 'MIN', 'MAX'].includes(aggregationField.value);
  const isSumCrossSeriesAggregation = crossSeriesAggregationField.value === 'SUM';

  const type = typeField.value || undefined;
  const metric = metricField.value || undefined;
  const tagCatalog = useTagCatalog({ ownerType: type, metric });
  const [tagFilterExpression, setTagFilterExpression] = useTagFilterExpressionState({
    tagCatalogResult: tagCatalog ? success(tagCatalog) : pendingResult,
    form,
    onChange
  });

  const catalogQuery = useDebouncedValue('', noop, 800);
  const metricCatalog = useMetricCatalog({
    getMetricCatalog,
    tagFilterExpression:
      tagFilterExpressionField.value != invalidMarker ? tagFilterExpressionField.value : EMPTY_EXPRESSION,
    type,
    query: catalogQuery.debouncedValue
  });

  const kpiDefinitions = getKpiDefinitions(type);
  const metricMetadatas = useMetricMetadatas({ type, kpiDefinitions })?.data;
  const isMetricAndMetadatas = metric && metricMetadatas;
  const formatterBackendType = isMetricAndMetadatas && metricMetadatas[metric]?.formatterType;
  const metricDefaultFormatter = getUiMetricsValueByBackendType(formatterBackendType);

  useEffect(() => {
    if (metricCatalog.data) {
      const metadata = getMetricInCatalog({
        metricCatalog: metricCatalog.data,
        type,
        metric
      });
      if (metadata) {
        onChange([], form => {
          var f = form.updateIn(['metricPath'], field => field.setValue(metadata.path).setTouched(true));
          if (f.containsKey('metricLabel')) {
            f = f.updateIn(['metricLabel'], field => field.setValue(metadata.label).setTouched(true));
          }
          if (f.containsKey('formatter')) {
            f = f.updateIn(['formatter'], field => field.setValue(metricDefaultFormatter).setTouched(true));
          }
          return f;
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [metricCatalog, typeField.value, metricField.value]);
  const metricMetadata = {
    metric,
    label: metricLabelField?.value,
    path: metricPathField.value,
    loading:
      ((metricLabelField && !metricLabelField.value) || !metricPathField.value || metricPathField.value.length == 0) &&
      metricCatalog.progress.loading
  };

  return (
    <Stack gap="xsmall">
      {dataSourceSection && <Sections>{dataSourceSection}</Sections>}

      <Sections>
        <Section title={t('in-custom-dashboards:widgets.srcInfrastructure.metricsFormComponent.metric')}>
          <TypeAndMetricConfigurator
            metricMetadata={metricMetadata}
            metricCatalog={(catalogQuery.value === catalogQuery.debouncedValue && metricCatalog) || pendingResult}
            onChange={({ metric, parentType, allowedCrossSeriesAggregations, label, parentLabels }) => {
              onChange([], form => {
                var f = form
                  .updateIn(['metric'], field => field.setValue(metric).setTouched(true))
                  .updateIn(['type'], field => field.setValue(parentType).setTouched(true))
                  .updateIn(['metricPath'], field => field.setValue(parentLabels).setTouched(true))
                  .updateIn(['aggregation'], field =>
                    field.setValue(Object.keys(aggregationLabels)[0]).setTouched(true)
                  )
                  .updateIn(['crossSeriesAggregation'], field => {
                    if (allowedCrossSeriesAggregations?.length > 0) {
                      return field.setValue(allowedCrossSeriesAggregations[0]).setTouched(true);
                    }
                    return field.setValue(Object.keys(aggregationLabels)[0]).setTouched(true);
                  })
                  .updateIn(['allowedCrossSeriesAggregations'], field =>
                    field.setValue(allowedCrossSeriesAggregations).setTouched(true)
                  );
                if (f.containsKey('metricLabel')) {
                  f = f.updateIn(['metricLabel'], field => field.setValue(label).setTouched(true));
                }
                if (f.containsKey('formatter')) {
                  f = f.updateIn(['formatter'], field => field.setValue(metricDefaultFormatter).setTouched(true));
                }
                return f;
              });
            }}
            query={catalogQuery.value}
            onQueryChange={catalogQuery.onChange}
            selectMetric={t('in-custom-dashboards:widgets.srcInfrastructure.metricsFormComponent.selectMetric')}
          />
          <TouchedMessages field={metricField} />
        </Section>

        {withAggregationInMetrics && (
          <SelectInSection
            label={t('in-custom-dashboards:widgets.srcInfrastructure.metricsFormComponent.aggregation')}
            id="metric-configurator-infra-aggregation"
            value={aggregationField.value}
            onChange={e =>
              onChange([], form =>
                form
                  .updateIn(['aggregation'], field => field.setValue(e.target.value).setTouched(true))
                  .updateIn(['crossSeriesAggregation'], field => {
                    if (isCrossSeriesAggregationRestricted) {
                      return field;
                    }
                    if (e.target.value === 'PER_SECOND') {
                      return field.setValue('SUM').setTouched(true);
                    }
                    return field.setValue(e.target.value).setTouched(true);
                  })
              )
            }
            additionalContent={
              <>
                <TouchedMessages field={aggregationField} />
                <div className={locals.crossSeriesAggregationWrapper}>
                  <Tooltip
                    content={getCrossSeriesAggregationTooltip(
                      isCrossSeriesAggregationRestricted,
                      isCrossSeriesSumAggregationToggleEnabled,
                      aggregationField.value
                    )}
                  >
                    <span>
                      <Toggle
                        id="metric-configurator-cross-series-aggregation"
                        checked={isSumCrossSeriesAggregation}
                        disabled={!isCrossSeriesSumAggregationToggleEnabled}
                        onChange={e => {
                          let newCrossSeriesAggregation = aggregationField.value;
                          if (e.target.checked) {
                            newCrossSeriesAggregation = 'SUM';
                          }
                          onChange(['crossSeriesAggregation'], field =>
                            field.setValue(newCrossSeriesAggregation).setTouched(true)
                          );
                        }}
                      />
                    </span>
                  </Tooltip>
                  <Spacer horizontal="xxsmall" />
                  {t('in-custom-dashboards:widgets.srcInfrastructure.metricsFormComponent.crossSeriesAggregation')}
                  <Spacer horizontal="small" />
                  <HelpAction>
                    {t(
                      'in-custom-dashboards:widgets.srcInfrastructure.metricsFormComponent.crossSeriesAggregationHelp'
                    )}
                  </HelpAction>
                </div>
                <TouchedMessages field={crossSeriesAggregationField} />
              </>
            }
            useAlternateBg
            disabled={!metricField.valid}
          >
            {!metricField.valid && <option value="">{aggregationLabels[Object.keys(aggregationLabels)[0]]}</option>}
            {metricField.valid && (
              <>
                {Object.keys(aggregationLabels).map(aggregation => (
                  <option key={aggregation} value={aggregation}>
                    {aggregationLabels[aggregation]}
                  </option>
                ))}
              </>
            )}
          </SelectInSection>
        )}

        {formatterSection}
      </Sections>

      {withFiltering && (
        <Sections>
          <QueryBuilderSection
            value={tagFilterExpression}
            onChange={setTagFilterExpression}
            QueryBuilder={QueryBuilder}
            tagCatalog={tagCatalog}
            withoutIcon
          />
        </Sections>
      )}

      <GroupingConfiguration
        withGrouping={withGrouping}
        grouping={grouping}
        tagCatalog={tagCatalog}
        tagFilterExpressionField={tagFilterExpressionField}
        onByChange={infraExploreGrouping => onChangeGrouping(onChange, { by: infraExploreGrouping })}
        onDirectionChange={onDirectionChange}
        onIncludeOthersChange={onIncludeOthersChange}
        GroupingConfigurator={GroupingConfigurator}
        hasError={groupingField ? groupingField.touched && !groupingField.valid : false}
        additionalContent={<TouchedMessages field={groupingField} />}
        withOptionalMarker={!isRequiringGroupingConfiguration(form)}
        hideIncludeOthersToggle
        maxGrouping={maxGrouping}
      />

      {timeShiftConfiguration}

      {labelSection}
    </Stack>
  );
}

function getGrouping(form) {
  return form.get('grouping')?.get(0)?.toJS();
}

function getCrossSeriesAggregationTooltip(
  isCrossSeriesAggregationRestricted,
  isCrossSeriesAggregationEnabled,
  aggregation
) {
  if (isCrossSeriesAggregationRestricted) {
    return t(
      'in-custom-dashboards:widgets.srcInfrastructure.metricsFormComponent.crossSeriesAggregationRestrictedHelp'
    );
  }
  return !isCrossSeriesAggregationEnabled && aggregation !== 'SUM'
    ? t('in-custom-dashboards:widgets.srcInfrastructure.metricsFormComponent.crossSeriesAggregationDisabledHelp', {
        aggregation: aggregationLabels[aggregation]
      })
    : '';
}
