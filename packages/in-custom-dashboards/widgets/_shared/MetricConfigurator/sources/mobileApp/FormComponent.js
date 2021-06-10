/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { find, groupBy } from 'lodash';
import React from 'react';

import { useObservable } from '@instana/hooks';

import { useTagFilterExpressionState } from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/tagFilterUtils/useTagFilterExpressionState';
import QueryBuilderSection from 'in-new-components/QueryBuilder/workspace/QueryBuilderSection';
import { availableMetrics } from 'in-mobile-apps/analyze/AnalyzeView/metrics';
import * as queryBuildersPerDataSource from 'in-mobile-apps/queryBuilder';
import SelectInSection from 'in-components/form/Select/SelectInSection';
import { emptyObject, pendingResult } from 'in-services/fixedObjects';
import TouchedMessages from 'in-components/form/TouchedMessages';
import Sections from 'in-new-components/workspace/Sections';
import { compareIgnoreCase } from 'in-services/util/string';
import { aggregationLabels } from 'in-stores/metric/metric';
import { dataSourceTitles } from 'in-mobile-apps/tags';
import Stack from 'in-components/layout/Stack';
import { t } from 'in-i18n';

export default function FormComponent({
  form,
  onChange,
  dataSourceSection,
  labelSection,
  formatterSection,
  timeShiftConfiguration
}) {
  const beaconTypeField = form.get('beaconType');
  const metricField = form.get('metric');
  const aggregationField = form.get('aggregation');
  const aggregators = getAggregations(beaconTypeField.value, metricField.value);
  const isSingleAggregator = aggregators?.length < 2;

  const { QueryBuilder, getTagCatalog } = queryBuildersPerDataSource[beaconTypeField.value] || emptyObject;

  const tagCatalogResult = useObservable(getTagCatalog, [beaconTypeField.value]) ?? pendingResult;
  const [tagFilterExpression, setTagFilterExpression] = useTagFilterExpressionState({
    tagCatalogResult,
    form,
    onChange
  });

  return (
    <Stack space="xsmall">
      <Sections>
        {dataSourceSection}
        <SelectInSection
          label={t('in-custom-dashboards:widgets.srcMobileApp.formComp.beaconType')}
          id="metic-configurator-mobile-app-beacon-type"
          value={beaconTypeField.value}
          onChange={e =>
            onChange([], form =>
              form
                .updateIn(['beaconType'], field => field.setValue(e.target.value).setTouched(true))
                .updateIn(['metric'], field => field.setValue(''))
                .updateIn(['aggregation'], field => field.setValue(''))
            )
          }
          hasError={!beaconTypeField.valid && beaconTypeField.touched}
          additionalContent={<TouchedMessages field={beaconTypeField} />}
          useAlternateBg
        >
          <option value="">{t('in-custom-dashboards:widgets.srcMobileApp.formComp.pleaseSelect')}</option>
          {Object.keys(dataSourceTitles)
            .sort((a, b) => compareIgnoreCase(dataSourceTitles[a], dataSourceTitles[b]))
            .map(key => (
              <option key={key} value={key}>
                {dataSourceTitles[key]}
              </option>
            ))}
        </SelectInSection>
      </Sections>
      <Sections>
        <SelectInSection
          label={t('in-custom-dashboards:widgets.srcMobileApp.formComp.metric')}
          id="metic-configurator-mobile-app-metric"
          value={metricField.value}
          onChange={e =>
            onChange([], form => {
              let updatedForm = form;
              if (updatedForm.get('metricLabel')) {
                updatedForm = updatedForm.updateIn(['metricLabel'], field =>
                  field.setValue(getMetricLabel(beaconTypeField.value, e.target.value)).setTouched(true)
                );
              }
              return updatedForm
                .updateIn(['metric'], field => field.setValue(e.target.value).setTouched(true))
                .updateIn(['aggregation'], field => {
                  const aggregations = getAggregations(beaconTypeField.value, e.target.value);
                  return field.setValue(aggregations.length > 1 ? '' : aggregations[0]);
                });
            })
          }
          hasError={!metricField.valid && metricField.touched}
          disabled={!beaconTypeField.valid}
          additionalContent={<TouchedMessages field={metricField} />}
        >
          {!beaconTypeField.valid && (
            <option value="">{t('in-custom-dashboards:widgets.srcMobileApp.formComp.pleaseSelectDs')}</option>
          )}
          {beaconTypeField.valid && (
            <>
              <option value="">{t('in-custom-dashboards:widgets.srcMobileApp.formComp.pleaseSelect')}</option>
              {Object.entries(groupBy(availableMetrics[beaconTypeField.value], ({ category }) => category || ''))
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
          )}
        </SelectInSection>

        <SelectInSection
          label={t('in-custom-dashboards:widgets.srcMobileApp.formComp.aggregation')}
          id="metic-configurator-mobile-app-aggregation"
          value={aggregationField.value}
          onChange={e => onChange(['aggregation'], field => field.setValue(e.target.value).setTouched(true))}
          hasError={!aggregationField.valid && aggregationField.touched}
          disabled={!metricField.valid || (isSingleAggregator && aggregators.includes(aggregationField.value))}
          additionalContent={<TouchedMessages field={aggregationField} />}
          useAlternateBg
        >
          {!metricField.valid && (
            <option value="">{t('in-custom-dashboards:widgets.srcMobileApp.formComp.pleaseSelectMetric')}</option>
          )}
          {metricField.valid && (
            <>
              <option value="">{t('in-custom-dashboards:widgets.srcMobileApp.formComp.pleaseSelect')}</option>
              {aggregators.map(aggregation => (
                <option key={aggregation} value={aggregation}>
                  {aggregationLabels[aggregation]}
                </option>
              ))}
            </>
          )}
        </SelectInSection>
      </Sections>

      {QueryBuilder && (
        <Sections>
          <QueryBuilderSection
            value={tagFilterExpression}
            onChange={setTagFilterExpression}
            QueryBuilder={QueryBuilder}
            withoutIcon
            useLastValidStateWhenErroneous
          />
        </Sections>
      )}

      {formatterSection}

      {timeShiftConfiguration}

      {labelSection}
    </Stack>
  );
}

function getAggregations(beaconType, metric) {
  const metricDefinition = find(availableMetrics[beaconType], ({ metric: m }) => m === metric);
  return metricDefinition?.supportedAggregations ?? [];
}

function getMetricLabel(beaconType, metricId) {
  const beacon = dataSourceTitles[beaconType];
  const metric = find(availableMetrics[beaconType], ({ metric: m }) => m === metricId)?.label;
  return `${beacon} - ${metric}`;
}
