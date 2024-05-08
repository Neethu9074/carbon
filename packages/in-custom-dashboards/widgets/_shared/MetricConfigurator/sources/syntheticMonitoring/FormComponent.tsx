/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Field, Item, MapForm } from 'formalistic';
import { find, groupBy } from 'lodash';
import React from 'react';

import { useObservable } from '@instana/hooks';
import { TimeConfig } from '@instana/types';
import { Stack } from '@instana/components';

// @ts-expect-error module needs to be translated to TS
import { useTagFilterExpressionState } from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/tagFilterUtils/useTagFilterExpressionState';
// @ts-expect-error module needs to be translated to TS
import GroupingConfiguration from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/GroupingConfiguration';
// @ts-expect-error module needs to be translated to TS
import { isRequiringGroupingConfiguration } from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/form';
// @ts-expect-error module needs to be translated to TS
import { onChangeGrouping } from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/form';
// @ts-expect-error module needs to be translated to TS
import { aggregationLabels } from 'in-stores/metric/metric';
import syntheticsGroupingConfigurator from 'in-synthetics/utils/syntheticsGroupingConfigurator';
import QueryBuilderSection from 'in-components/QueryBuilder/workspace/QueryBuilderSection';
import QueryBuilder, { getTagCatalog } from 'in-synthetics/utils/syntheticsQueryBuilder';
import TouchedMessages from 'in-components/form/TouchedMessages/TouchedMessages';
import { availableMetrics } from 'in-synthetics/utils/customDashboardConstants';
import SelectInSection from 'in-components/form/Select/SelectInSection';
import { compareIgnoreCase } from 'in-services/util/string';
import { pendingResult } from 'in-services/fixedObjects';
import Sections from 'in-components/workspace/Sections';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { t } from 'in-i18n';

interface SyntheticFormComponentProps {
  form: MapForm<any>;
  onChange: (path: string[], updater: (f: Item) => Item) => void;
  dataSourceSection: JSX.Element;
  formatterSection: JSX.Element;
  timeShiftConfiguration: JSX.Element;
  thresholdConfiguration: JSX.Element;
  withAggregationInMetrics: boolean;
  withGrouping: boolean;
  maxGrouping: number;
  labelSection: JSX.Element;
}

const FormComponent = ({
  form,
  onChange,
  dataSourceSection,
  formatterSection,
  timeShiftConfiguration,
  thresholdConfiguration,
  withAggregationInMetrics = true,
  withGrouping = true,
  maxGrouping = 20,
  labelSection
}: SyntheticFormComponentProps) => {
  const timeConfig = useTimeConfig();

  const metricField = form.get('metric');
  const tagFilterExpressionField = form.get('tagFilterExpression');
  const groupingField = form.get('grouping');
  const aggregationField = form.get('aggregation');
  const aggregators = getAggregations(metricField.value);
  const isSingleAggregator = aggregators?.length < 2;

  const tagCatalogResult = useObservable(getGetTagCatalogObservable, [timeConfig]) ?? pendingResult;

  const [tagFilterExpression, setTagFilterExpression] = useTagFilterExpressionState({
    tagCatalogResult,
    form,
    onChange
  });

  const grouping = groupingField?.get(0)?.toJS();
  const onByChange = (by: { groupbyTag: string; tagType: string }) => onChangeGrouping(onChange, { ...grouping, by });
  const onDirectionChange = (direction: string, maxResults: number) =>
    onChangeGrouping(onChange, { ...grouping, direction, maxResults });
  const onIncludeOthersChange = (includeOthers: boolean) => onChangeGrouping(onChange, { ...grouping, includeOthers });

  return (
    <Stack gap="xsmall">
      <Sections>{dataSourceSection}</Sections>
      <Sections>
        <SelectInSection
          label={t('in-custom-dashboards:widgets.srcSyntheticMonitoring.formComponent.metric')}
          id="metric-configurator-synthetic-metric"
          value={metricField.value}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
            onChange([], form => {
              let updatedForm = form as MapForm<any>;
              if (updatedForm.get('metricLabel')) {
                updatedForm = updatedForm.updateIn(['metricLabel'], (field: Field<string>) =>
                  field.setValue(getMetricLabel(e.target.value)).setTouched(true)
                );
              }
              return updatedForm
                .updateIn(['metric'], (field: Field<string>) => field.setValue(e.target.value).setTouched(true))
                .updateIn(['aggregation'], (field: Field<string>) => {
                  const aggregations = getAggregations(e.target.value);
                  return field.setValue(aggregations.length > 1 ? '' : aggregations[0]);
                });
            })
          }
          hasError={!metricField.valid && metricField.touched}
          additionalContent={<TouchedMessages field={metricField} />}
        >
          {
            <>
              <option value="">
                {t('in-custom-dashboards:widgets.srcSyntheticMonitoring.formComponent.pleaseSelect')}
              </option>
              {Object.entries(groupBy(availableMetrics, ({ category }) => category || ''))
                // @ts-expect-error roperty 'category' does not exist on type '[string, [Metric, ...Metric[]]]
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
        {withAggregationInMetrics && (
          <SelectInSection
            label={t('in-custom-dashboards:widgets.srcSyntheticMonitoring.formComponent.aggregation')}
            id="metric-configurator-synthetic-aggregation"
            value={aggregationField.value}
            onChange={e =>
              onChange(['aggregation'], field => (field as Field<string>).setValue(e.target.value).setTouched(true))
            }
            hasError={!aggregationField.valid && aggregationField.touched}
            disabled={!metricField.valid || (isSingleAggregator && aggregators.includes(aggregationField.value))}
            additionalContent={<TouchedMessages field={metricField} />}
            useAlternateBg
          >
            {!metricField.valid && (
              <option value="">
                {t('in-custom-dashboards:widgets.srcSyntheticMonitoring.formComponent.selectMetric')}
              </option>
            )}
            {metricField.valid && (
              <>
                <option value="">
                  {t('in-custom-dashboards:widgets.srcSyntheticMonitoring.formComponent.pleaseSelect')}
                </option>
                {aggregators.map(aggregation => (
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

      {QueryBuilder && (
        <QueryBuilderSection
          value={tagFilterExpression}
          onChange={setTagFilterExpression}
          QueryBuilder={QueryBuilder}
          useLastValidStateWhenErroneous
          withoutIcon
        />
      )}

      <GroupingConfiguration
        withGrouping={withGrouping}
        grouping={grouping}
        tagFilterExpressionField={tagFilterExpressionField}
        onByChange={onByChange}
        onDirectionChange={onDirectionChange}
        onIncludeOthersChange={onIncludeOthersChange}
        GroupingConfigurator={syntheticsGroupingConfigurator}
        hasError={groupingField ? groupingField.touched && !groupingField.valid : false}
        additionalContent={<TouchedMessages field={groupingField} />}
        withOptionalMarker={!isRequiringGroupingConfiguration(form)}
        maxGrouping={maxGrouping}
      />

      {timeShiftConfiguration}

      {thresholdConfiguration}

      {labelSection}
    </Stack>
  );
};

const getAggregations = (metric: string): string[] => {
  return find(availableMetrics, ({ metric: m }) => m === metric)?.supportedAggregations ?? [];
};

const getMetricLabel = (metricId: string): string => {
  return find(availableMetrics, ({ metric: m }) => m === metricId)?.label!;
};

function getGetTagCatalogObservable([timeConfig]: TimeConfig[]) {
  return getTagCatalog({ timeConfig });
}

export default FormComponent;
