/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { Field, Item, MapForm } from 'formalistic';
import React, { useState } from 'react';
import { find } from 'lodash';

import { Select, Stack, TextInput } from '@instana/components';
import { useObservable } from '@instana/hooks';

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
import businessMetricGroupingConfigurator from 'in-bizops/components/businessMetricGroupingConfigurator';
import getBusinessMetricsDefinitions from 'in-bizops/subscriptions/getBusinessMetricsDefinitions';
import QueryBuilderSection from 'in-components/QueryBuilder/workspace/QueryBuilderSection';
import businessMetricQueryBuilder from 'in-bizops/components/businessMetricQueryBuilder';
import useBusinessMetricsTagCatalog from 'in-bizops/utils/useBusinessMetricsTagCatalog';
import TouchedMessages from 'in-components/form/TouchedMessages/TouchedMessages';
import SelectInSection from 'in-components/form/Select/SelectInSection';
import { enrichTagCatalog } from 'in-services/tags/tagCatalog';
import { pendingResult } from 'in-services/fixedObjects';
import Sections from 'in-components/workspace/Sections';
import Section from 'in-components/workspace/Section';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { success } from 'in-services/util/result';
import { t } from 'in-i18n';

import locals from './businessMetricsForm.mless';

interface BusinessMetricsFormComponentProps {
  form: MapForm<any>;
  onChange: (path: string[], updater: (f: Item) => Item) => void;
  dataSourceSection: JSX.Element;
  timeShiftConfiguration: JSX.Element;
  thresholdConfiguration: JSX.Element;
  withAggregationInMetrics: boolean;
  withGrouping: boolean;
  maxGrouping: number;
  labelSection: JSX.Element;
}

interface AvailableMetricsProps {
  metric: string;
  label: string;
  supportedAggregations: string[];
  metricUnit: string;
}

const FormComponent = ({
  form,
  onChange,
  dataSourceSection,
  timeShiftConfiguration,
  thresholdConfiguration,
  withAggregationInMetrics = true,
  withGrouping = true,
  maxGrouping = 20,
  labelSection
}: BusinessMetricsFormComponentProps) => {
  const timeConfig = useTimeConfig();
  const metricField = form.get('metric');
  const tagFilterExpressionField = form.get('tagFilterExpression');
  const groupingField = form.get('grouping');
  const aggregationField = form.get('aggregation');

  const metric = metricField.value || undefined;

  // state var for the unit so we can add it to the unit input after selection
  const [unitState, setUnitState] = useState('');

  const tagCatalog = useBusinessMetricsTagCatalog({ metric });
  let enrichedTagCatalog = tagCatalog;
  if (tagCatalog) enrichedTagCatalog = enrichTagCatalog(tagCatalog);

  const [tagFilterExpression, setTagFilterExpression] = useTagFilterExpressionState({
    tagCatalogResult: tagCatalog ? success(tagCatalog) : pendingResult,
    form,
    onChange
  });

  const grouping = groupingField?.get(0)?.toJS();
  const onByChange = (by: { groupbyTag: string; tagType: string }) => onChangeGrouping(onChange, { ...grouping, by });
  const onDirectionChange = (direction: string, maxResults: number) =>
    onChangeGrouping(onChange, { ...grouping, direction, maxResults });
  const onIncludeOthersChange = (includeOthers: boolean) => onChangeGrouping(onChange, { ...grouping, includeOthers });

  // get the metric definitions from backend
  const availableMetricsRaw = useObservable(
    getBusinessMetricsDefinitions({
      order: {
        by: 'metricName',
        direction: 'DESC'
      },
      pagination: {
        page: 1,
        pageSize: 50
      },
      timeConfig
    }),
    [timeConfig]
  );

  let availableMetrics: AvailableMetricsProps[] = [];

  if (availableMetricsRaw?.data) {
    availableMetrics = availableMetricsRaw?.data?.items?.map(({ metricName, metricUnit }) => {
      return {
        metric: metricName,
        label: metricName,
        metricUnit,
        supportedAggregations: ['SUM', 'MEAN', 'MAX', 'MIN']
      };
    });
  }

  const getAggregations = (metric: string): string[] => {
    return find(availableMetrics, ({ metric: m }) => m === metric)?.supportedAggregations ?? [];
  };

  const getMetricLabel = (metricId: string): string => {
    return find(availableMetrics, ({ metric: m }) => m === metricId)?.label!;
  };

  const getMetricUnit = (metricId: string): string => {
    return find(availableMetrics, ({ metric: m }) => m === metricId)?.metricUnit!;
  };

  const aggregators = getAggregations(metricField.value);
  const isSingleAggregator = aggregators?.length < 2;

  return (
    <Stack gap="xsmall">
      <Sections>{dataSourceSection}</Sections>
      <Sections>
        <Section
          title={t('in-custom-dashboards:widgets.srcBusinessMetrics.formComponent.metric')}
          titleHtmlFor="metric-configurator-businessMetrics-metric" // accessibility!
        >
          <div className={locals.flexDiv}>
            <Select
              id="metric-configurator-businessMetrics-metric"
              hasError={!metricField.valid && metricField.touched}
              value={metricField.value}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                onChange([], form => {
                  if (e.target.value) setUnitState(getMetricUnit(e.target.value));
                  else setUnitState('');

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
            >
              <option value="">
                {t('in-custom-dashboards:widgets.srcBusinessMetrics.formComponent.pleaseSelect')}
              </option>
              {Object.entries(availableMetrics!).map(metricEntry => {
                const metric = metricEntry[1];
                return (
                  <option key={metric.metric} value={metric.metric}>
                    {metric.label}
                  </option>
                );
              })}
            </Select>
            <TouchedMessages field={metricField} />
            <div className={locals.unitInputDiv}>
              <label className={locals.unitInputLabel} htmlFor="bizMetricsUnitInput">
                {t('in-custom-dashboards:widgets.srcBusinessMetrics.formComponent.unit')}
              </label>
              <TextInput
                className={locals.unitInput}
                value={unitState}
                readOnly
                title={t('in-custom-dashboards:widgets.srcBusinessMetrics.formComponent.pleaseSelect')}
              />
            </div>
          </div>
        </Section>
        {withAggregationInMetrics && (
          <SelectInSection
            label={t('in-custom-dashboards:widgets.srcBusinessMetrics.formComponent.aggregation')}
            id="metric-configurator-bizOps-aggregation"
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
                {t('in-custom-dashboards:widgets.srcBusinessMetrics.formComponent.pleaseSelectMetric')}
              </option>
            )}
            {metricField.valid && (
              <>
                <option value="">
                  {t('in-custom-dashboards:widgets.srcBusinessMetrics.formComponent.pleaseSelect')}
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
      </Sections>

      {metric && businessMetricQueryBuilder && (
        <QueryBuilderSection
          value={tagFilterExpression}
          onChange={setTagFilterExpression}
          QueryBuilder={businessMetricQueryBuilder}
          tagCatalog={enrichedTagCatalog}
          additionalGetTagCatalogProps={{ metric: metric }}
          getSuggestionsProps={{ metric: metric }}
          withoutIcon
        />
      )}

      {metric && (
        <GroupingConfiguration
          withGrouping={withGrouping}
          grouping={grouping}
          tagFilterExpressionField={tagFilterExpressionField}
          tagCatalog={enrichedTagCatalog}
          additionalGetTagCatalogProps={{ metric: metric }}
          onByChange={onByChange}
          onDirectionChange={onDirectionChange}
          onIncludeOthersChange={onIncludeOthersChange}
          GroupingConfigurator={businessMetricGroupingConfigurator}
          hasError={groupingField ? groupingField.touched && !groupingField.valid : false}
          additionalContent={<TouchedMessages field={groupingField} />}
          withOptionalMarker={!isRequiringGroupingConfiguration(form)}
          maxGrouping={maxGrouping}
        />
      )}

      {timeShiftConfiguration}

      {thresholdConfiguration}

      {labelSection}
    </Stack>
  );
};

export default FormComponent;
