/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useEffect } from 'react';

import { Spacer, Stack, Toggle } from '@instana/components';

import MetricSelectionCategoryOverlay from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/infrastructure/metrics/MetricSelectionCategoryOverlay';
import { useTagFilterExpressionState } from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/tagFilterUtils/useTagFilterExpressionState';
import { regexValidationError } from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/infrastructure/metrics/regexValidator';
import { formCallbacks } from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/infrastructure/metrics/formStateManagement';
import getMetricInCatalog from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/infrastructure/metrics/getMetricInCatalog';
import {
  onChangeGrouping,
  isRequiringGroupingConfiguration
} from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/form';
import ValidationMessages, {
  hasErrorOfCategory
} from 'in-custom-dashboards/widgets/Chart/FormComponent/ValidationMessages';
import GroupingConfiguration from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/GroupingConfiguration';
import { invalidMarker } from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/tagFilterUtils/form';
import { formatterPath } from 'in-custom-dashboards/widgets/_shared/useFormatterFormSideEffects';
import { EMPTY_EXPRESSION } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import GroupingConfigurator from 'in-infrastructure/Explore/components/GroupingConfigurator';
import QueryBuilderSection from 'in-components/QueryBuilder/workspace/QueryBuilderSection';
import { getUiMetricsValueByBackendType } from 'in-services/formatters/backendFormatter';
import getMetricCatalog from 'in-infrastructure/subscriptions/getMetricCatalog';
import QueryBuilder from 'in-infrastructure/Explore/components/QueryBuilder';
import useMetricMetadatas from 'in-infrastructure/hooks/useMetricMetadatas';
import { autoFormatterTimeSeriesEnabled } from 'in-services/featureFlags';
import SelectInSection from 'in-components/form/Select/SelectInSection';
import useMetricCatalog from 'in-infrastructure/hooks/useMetricCatalog';
import TypeAndMetricConfigurator from './TypeAndMetricConfigurator';
import useTagCatalog from 'in-infrastructure/hooks/useTagCatalog';
import TouchedMessages from 'in-components/form/TouchedMessages';
import { aggregationLabels } from 'in-stores/metric/beeInstant';
import { defaultFormatter } from 'in-stores/metric/formatters';
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
  axisForm,
  axisName,
  updateForm,
  onChange,
  dataSourceSection,
  labelSection,
  formatterSection,
  timeShiftConfiguration,
  withGrouping = true,
  withFiltering = true,
  isTypePrefilled = false,
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
  const regexField = form.get('regex');
  const metricFormatter = form.get('formatter')?.value;

  const axisYForm = axisForm?.get(axisName);
  const axisMetrics = axisYForm?.get('metrics');
  const isFormatterSelected = axisYForm?.get('formatterSelected')?.value;

  const grouping = getGrouping(form);
  const onDirectionChange = (direction, maxResults) =>
    onChangeGrouping(onChange, { ...grouping, direction, maxResults });
  const onIncludeOthersChange = includeOthers => onChangeGrouping(onChange, { ...grouping, includeOthers });
  const isCrossSeriesSumAggregationToggleEnabled =
    !isCrossSeriesAggregationRestricted && ['MEAN', 'MIN', 'MAX'].includes(aggregationField.value);
  const isSumCrossSeriesAggregation = crossSeriesAggregationField.value === 'SUM';

  const type = typeField.value || undefined;
  const isRegex = regexField.value || false;
  const metric = metricField.value || undefined;
  const tagCatalog = useTagCatalog({ ownerType: type, metric, regex: isRegex });
  const backendQueryModel =
    tagFilterExpressionField.value != invalidMarker ? tagFilterExpressionField.value : EMPTY_EXPRESSION;
  const [tagFilterExpression, setTagFilterExpression] = useTagFilterExpressionState({
    tagCatalogResult: tagCatalog ? success(tagCatalog) : pendingResult,
    form,
    onChange
  });

  const catalogQuery = useDebouncedValue('', noop, 800);
  const metricCatalog = useMetricCatalog({
    getMetricCatalog,
    tagFilterExpression: backendQueryModel,
    type: isTypePrefilled ? type : undefined,
    query: catalogQuery.debouncedValue
  });

  const kpiDefinitions = getKpiDefinitions(type);
  const metricMetadatas = useMetricMetadatas({ type, queries: [metric], kpiDefinitions })?.data;
  const isMetricAndMetadatas = metric && metricMetadatas;
  const formatterBackendType = isMetricAndMetadatas && metricMetadatas[metric]?.formatterType;
  const metricDefaultFormatter = getUiMetricsValueByBackendType(formatterBackendType);

  const {
    setMetadata,
    onMetricChange,
    setIsRegex,
    onRegexChange,
    setAggregation,
    setIsSumCrossSeriesAggregation,
    onTypeChange
  } = formCallbacks({ onChange, metricDefaultFormatter, isCrossSeriesAggregationRestricted });

  useEffect(() => {
    if (metricCatalog.data) {
      const metadata = getMetricInCatalog({
        metricCatalog: metricCatalog.data,
        type: typeField.value,
        metric: metricField.value
      });
      if (metadata) {
        setMetadata(metadata);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [metricCatalog, typeField.value, metricField.value]);

  // Update metric formatter with builtin one
  useEffect(() => {
    if (autoFormatterTimeSeriesEnabled) {
      onChange([], form =>
        form.updateIn(['formatter'], field => field.setValue(metricDefaultFormatter).setTouched(true))
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [metricDefaultFormatter]);

  // Auto formatter
  useEffect(() => {
    if (!autoFormatterTimeSeriesEnabled || !metric || !axisForm || isFormatterSelected) {
      return;
    }

    // Get unique metrics formatters
    const metricsFormatters = [...new Set(axisMetrics?.map(metric => metric?.get(formatterPath)?.value))];

    // Check if it has different formatters
    const hasDifferentFormatters = metricsFormatters.length > 1;

    const defaultFormatterValue = hasDifferentFormatters ? defaultFormatter.id : metricFormatter;

    updateForm(
      axisForm
        .updateIn([axisName, formatterPath], field => field.setValue(defaultFormatterValue).setTouched(true))
        .updateIn([axisName, 'formatterSelected'], field => field.setValue(false).setTouched(true))
    );

    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [metricFormatter, isFormatterSelected, metric]);

  const metricMetadata = {
    metric,
    label: metricLabelField?.value,
    path: metricPathField.value,
    loading:
      ((metricLabelField && !metricLabelField.value) || !metricPathField.value || metricPathField.value.length == 0) &&
      metricCatalog.progress.loading
  };
  const stableMetricCatalog = catalogQuery.value === catalogQuery.debouncedValue ? metricCatalog : pendingResult;

  return (
    <Stack gap="xsmall">
      {dataSourceSection && <Sections>{dataSourceSection}</Sections>}

      <Sections>
        <Section
          hasError={hasRegexValidationError(form)}
          title={t('in-custom-dashboards:widgets.srcInfrastructure.metricsFormComponent.metric')}
        >
          <TypeAndMetricConfigurator
            metricMetadata={metricMetadata}
            metricCatalog={stableMetricCatalog.data}
            loading={stableMetricCatalog.progress.loading}
            errors={stableMetricCatalog.errors}
            onMetricChange={onMetricChange}
            query={catalogQuery.value}
            onQueryChange={catalogQuery.onChange}
            selectMetric={t('in-custom-dashboards:widgets.srcInfrastructure.metricsFormComponent.selectMetric')}
            isRegex={isRegex}
            regex={metric || ''}
            setIsRegex={setIsRegex}
            onRegexChange={onRegexChange}
            type={type}
            onChange={onChange}
            onTypeChange={onTypeChange}
            backendQueryModel={backendQueryModel}
            SelectorOverlay={MetricSelectionCategoryOverlay}
          />
          <TouchedMessages field={metricField} />
          <ValidationMessages field={form} category={regexValidationError} />
        </Section>

        {withAggregationInMetrics && (
          <SelectInSection
            label={t('in-custom-dashboards:widgets.srcInfrastructure.metricsFormComponent.aggregation')}
            id="metric-configurator-infra-aggregation"
            value={aggregationField.value}
            onChange={e => setAggregation(e.target.value)}
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
                        onChange={e => setIsSumCrossSeriesAggregation(e.target.value)}
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

function hasRegexValidationError(form) {
  return hasErrorOfCategory(form, regexValidationError);
}
