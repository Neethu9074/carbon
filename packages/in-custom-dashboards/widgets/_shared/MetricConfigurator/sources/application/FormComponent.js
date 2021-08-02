/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useEffect, useState } from 'react';
import { find, groupBy } from 'lodash';

import { useObservable } from '@instana/hooks';
import { Message } from '@instana/components';
import { Stack } from '@instana/components';

import { resetPotentialProblemsFormFieldIfNeeded } from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/application/potentialProblemsForm';
import { useTagFilterExpressionState } from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/tagFilterUtils/useTagFilterExpressionState';
import HiddenCallsConfiguration from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/application/HiddenCallsConfiguration';
import {
  isRequiringGroupingConfiguration,
  onChangeGrouping
} from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/form';
import PotentialProblemsConfigurator from 'in-custom-dashboards/widgets/Chart/FormComponent/PotentialProblemsConfigurator';
import GroupingConfiguration from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/GroupingConfiguration';
import CallGroupingConfigurator from 'in-applications/analyze/components/workspace/CallGroupingConfigurator';
import QueryBuilder, { getTagCatalog } from 'in-applications/analyze/components/workspace/CallQueryBuilder';
import { applicationSmartAlertsEnabled, potentialProblemsEnabled } from 'in-services/featureFlags';
import QueryBuilderSection from 'in-components/QueryBuilder/workspace/QueryBuilderSection';
import { EQUALS } from 'in-components/QueryBuilder/tagFilter/operators';
import SelectInSection from 'in-components/form/Select/SelectInSection';
import { availableMetrics } from 'in-applications/analyze/metrics';
import TouchedMessages from 'in-components/form/TouchedMessages';
import { compareIgnoreCase } from 'in-services/util/string';
import { aggregationLabels } from 'in-stores/metric/metric';
import { pendingResult } from 'in-services/fixedObjects';
import Sections from 'in-components/workspace/Sections';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { getPluginName } from 'in-sdk/pluginName';
import { t } from 'in-i18n';

export default function FormComponent({
  form,
  axisForm,
  onChange,
  dataSourceSection,
  labelSection,
  formatterSection,
  timeShiftConfiguration,
  withPotentialProblemsConfiguration,
  withGrouping = true,
  maxGrouping = 20
}) {
  const metricField = form.get('metric');
  const aggregationField = form.get('aggregation');
  const tagFilterExpressionField = form.get('tagFilterExpression');
  const groupingField = form.get('grouping');
  const includeInternalField = form.get('includeInternal');
  const includeSyntheticField = form.get('includeSynthetic');
  const timeConfig = useTimeConfig();
  const tagCatalogResult = useObservable(getGetTagCatalogObservable, [timeConfig]) ?? pendingResult;
  const [enableIncludeInternalOnce, setEnableIncludeInternalOnce] = useState(false);
  const [enableIncludeSyntheticOnce, setEnableIncludeSyntheticOnce] = useState(false);

  const [tagFilterExpression, setTagFilterExpression] = useTagFilterExpressionState({
    tagCatalogResult,
    form,
    onChange
  });

  // If certain tags regarding internal or synthetic calls are set in the Query, the toggles to include them should be checked.
  useEffect(() => {
    const hasIsInternal =
      tagFilterExpression.find(
        ({ name, operator, value }) => name === 'call.type' && operator === EQUALS && value === 'INTERNAL'
      ) != null;
    const hasIsSynthetic =
      tagFilterExpression.find(
        ({ name, operator, value }) => name === 'call.is_synthetic' && operator === EQUALS && value === true
      ) != null;
    if (hasIsInternal && !includeInternalField.value) {
      setEnableIncludeInternalOnce(true);
    }
    if (hasIsSynthetic && !includeSyntheticField.value) {
      setEnableIncludeSyntheticOnce(true);
    }
  }, [tagFilterExpression, includeInternalField, includeSyntheticField, onChange]);

  useEffect(() => {
    if (enableIncludeInternalOnce) {
      onChange([], form => form.updateIn(['includeInternal'], field => field.setValue(true).setTouched(true)));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enableIncludeInternalOnce]);

  useEffect(() => {
    if (enableIncludeSyntheticOnce) {
      onChange([], form => form.updateIn(['includeSynthetic'], field => field.setValue(true).setTouched(true)));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enableIncludeSyntheticOnce]);

  const grouping = groupingField?.get(0)?.toJS();

  const onByChange = by => onChangeGrouping(onChange, { ...grouping, by });
  const onDirectionChange = (direction, maxResults) =>
    onChangeGrouping(onChange, { ...grouping, direction, maxResults });
  const onIncludeOthersChange = includeOthers => onChangeGrouping(onChange, { ...grouping, includeOthers });
  const aggregators = getAggregations(metricField.value);
  const isSingleAggregator = aggregators?.length < 2;

  return (
    <Stack gap="xsmall">
      <Sections>{dataSourceSection}</Sections>

      <Sections>
        <SelectInSection
          label={t('in-custom-dashboards:widgets.srcApp.formComponent.metric')}
          id="metic-configurator-application-metric"
          value={metricField.value}
          onChange={e =>
            onChange([], form => {
              let updatedForm = form;
              if (updatedForm.get('metricLabel')) {
                updatedForm = updatedForm.updateIn(['metricLabel'], field =>
                  field.setValue(getMetricLabel(e.target.value)).setTouched(true)
                );
              }
              updatedForm = resetPotentialProblemsFormFieldIfNeeded(updatedForm);
              return updatedForm
                .updateIn(['metric'], field => field.setValue(e.target.value).setTouched(true))
                .updateIn(['aggregation'], field => {
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
          disabled={!metricField.valid || (isSingleAggregator && aggregators.includes(aggregationField.value))}
          additionalContent={<TouchedMessages field={metricField} />}
          useAlternateBg
        >
          {!metricField.valid && (
            <option value="">{t('in-custom-dashboards:widgets.srcApp.formComponent.pleaseSelectMetric')}</option>
          )}
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
            useLastValidStateWhenErroneous
            withoutIcon
            getSuggestionsProps={{
              includeInternal: includeInternalField.value,
              includeSynthetic: includeSyntheticField.value
            }}
            getSuggestionLabel={({ item, tagName }) =>
              tagName === 'technology' ? `${getPluginName(item)} (${item})` : item
            }
          />
          <HiddenCallsConfiguration
            includeInternal={includeInternalField.value}
            includeSynthetic={includeSyntheticField.value}
            onIncludeInternalChange={includeInternal =>
              onChange([], form =>
                form.updateIn(['includeInternal'], field => field.setValue(includeInternal).setTouched(true))
              )
            }
            onIncludeSyntheticChange={includeSynthetic =>
              onChange([], form =>
                form.updateIn(['includeSynthetic'], field => field.setValue(includeSynthetic).setTouched(true))
              )
            }
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
        GroupingConfigurator={
          form.containsKey('potentialProblems')
            ? () => (
                <Message
                  title={t('in-custom-dashboards:widgets.srcApp.formComponent.needToTurnOffPP')}
                  small
                  withIcon
                />
              )
            : CallGroupingConfigurator
        }
        hasError={groupingField ? groupingField.touched && !groupingField.valid : false}
        additionalContent={<TouchedMessages field={groupingField} />}
        withOptionalMarker={!isRequiringGroupingConfiguration(form)}
        maxGrouping={maxGrouping}
      />

      {timeShiftConfiguration}

      {withPotentialProblemsConfiguration && applicationSmartAlertsEnabled && potentialProblemsEnabled && (
        <PotentialProblemsConfigurator
          form={form}
          onChange={onChange}
          axisForm={axisForm}
          metricField={metricField}
          grouping={grouping}
        />
      )}

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

function getMetricLabel(metricId) {
  return find(availableMetrics, ({ metric: m }) => m === metricId)?.label;
}
