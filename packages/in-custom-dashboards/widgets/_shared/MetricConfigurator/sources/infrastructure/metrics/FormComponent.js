/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useEffect, useState } from 'react';

import { Spacer, Stack, Toggle } from '@instana/components';

import {
  autoFormatterTimeSeriesEnabled,
  lastValueForNonTimeSeriesWidgetEnabled,
  multiGroupTimeSeriesEnabled,
  unitForInfraMetricsEnabled
} from 'in-services/featureFlags';
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
import { getInfrastructureMetricFormatter } from 'in-custom-dashboards/widgets/_shared/formatters';
import { EMPTY_EXPRESSION } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import GroupingConfigurator from 'in-infrastructure/Explore/components/GroupingConfigurator';
import { unitPath } from 'in-custom-dashboards/widgets/_shared/useFormatterFormSideEffects';
import QueryBuilderSection from 'in-components/QueryBuilder/workspace/QueryBuilderSection';
import { getUiMetricsValueByBackendType } from 'in-services/formatters/backendFormatter';
import { getMetricUnitByBackendType, getUnitByFormatter } from 'in-stores/metric/units';
import { defaultFormatter, getFormatterIdByFn } from 'in-stores/metric/formatters';
import getMetricCatalog from 'in-infrastructure/subscriptions/getMetricCatalog';
import QueryBuilder from 'in-infrastructure/Explore/components/QueryBuilder';
import useMetricMetadatas from 'in-infrastructure/hooks/useMetricMetadatas';
import SelectInSection from 'in-components/form/Select/SelectInSection';
import useMetricCatalog from 'in-infrastructure/hooks/useMetricCatalog';
import TypeAndMetricConfigurator from './TypeAndMetricConfigurator';
import useTagCatalog from 'in-infrastructure/hooks/useTagCatalog';
import TouchedMessages from 'in-components/form/TouchedMessages';
import { aggregationLabels } from 'in-stores/metric/beeInstant';
import { getFormatterId } from 'in-stores/metric/formatters';
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
  thresholdConfiguration,
  withGrouping = true,
  withFiltering = true,
  withUnit = false,
  type: baseType,
  isTypePrefilled = false,
  withAggregationInMetrics = true,
  maxGrouping = 50,
  withLastValue = false,
  withEmptyValueFilterSection
}) {
  const typeField = form.get('type');
  const metricField = form.get('metric');
  const unitField = form.get('unit');
  const aggregationField = form.get('aggregation');
  const crossSeriesAggregationField = form.get('crossSeriesAggregation');
  const allowedCrossSeriesAggregations = form.get('allowedCrossSeriesAggregations');
  const isCrossSeriesAggregationRestricted = allowedCrossSeriesAggregations.value?.length > 0;
  const tagFilterExpressionField = form.get('tagFilterExpression');
  const groupingField = form.get('grouping');
  const metricLabelField = form.get('metricLabel');
  const metricPathField = form.get('metricPath');
  const regexField = form.get('regex');
  const formatterField = form.get('formatter');
  const lastValueField = form.get('lastValue');

  const isFormatterSelected = form.get('formatterSelected')?.value;
  const isTimeSeries = baseType === 'TIME_SERIES';
  const isMultiGroup = multiGroupTimeSeriesEnabled && isTimeSeries;

  const grouping = getGrouping(form);
  const groupKey = isMultiGroup ? 'groupBys' : 'by';

  const onDirectionChange = (direction, maxResults) =>
    onChangeGrouping(onChange, { ...grouping, direction, maxResults }, groupKey);
  const onIncludeOthersChange = includeOthers => onChangeGrouping(onChange, { ...grouping, includeOthers }, groupKey);
  const isCrossSeriesSumAggregationToggleEnabled =
    !isCrossSeriesAggregationRestricted && includesInSelectedAggregations(aggregationField.value);
  const isSumCrossSeriesAggregation = crossSeriesAggregationField.value === 'SUM';
  const isLastValue = lastValueField.value === true;

  const type = typeField.value || undefined;
  const isRegex = regexField.value || false;
  const metric = metricField.value || undefined;
  const formatter = formatterField.value || undefined;

  const tagCatalog = useTagCatalog({ ownerType: type, metric, regex: isRegex });

  const backendQueryModel =
    tagFilterExpressionField.value != invalidMarker ? tagFilterExpressionField.value : EMPTY_EXPRESSION;
  const [tagFilterExpression, setTagFilterExpression] = useTagFilterExpressionState({
    tagCatalogResult: tagCatalog ? success(tagCatalog) : pendingResult,
    form,
    onChange,
    disableEntitySelection: true
  });

  const catalogQuery = useDebouncedValue('', noop, 800);
  const [selectedType, onSelectType] = useState();
  const metricCatalog = useMetricCatalog({
    getMetricCatalog,
    tagFilterExpression: backendQueryModel,
    type: isTypePrefilled ? type : selectedType,
    query: catalogQuery.debouncedValue,
    withHierarchy: !isTypePrefilled
  });

  const kpiDefinitions = getKpiDefinitions(type);
  const metricMetadatas = useMetricMetadatas({ type, queries: [metric], kpiDefinitions })?.data;
  const formatterBackendType = metricMetadatas?.[metric]?.formatterType;
  const uiMetricFormatter = formatterBackendType
    ? getUiMetricsValueByBackendType(formatterBackendType)
    : getFormatterId(metricMetadatas?.[metric]?.formatter);

  const preSelectedUnit = unitForInfraMetricsEnabled
    ? formatterBackendType
      ? getMetricUnitByBackendType(formatterBackendType)
      : getUnitByFormatter(getFormatterIdByFn(metricMetadatas?.[metric]?.formatter))
    : undefined;

  const metricDefaultFormatter = getMetricDefaultFormatter({
    baseUnit: preSelectedUnit?.baseUnit,
    formatter,
    isFormatterSelected,
    metric,
    uiMetricFormatter
  });

  const {
    setMetadata,
    onMetricChange,
    setIsRegex,
    onRegexChange,
    setAggregation,
    setUnit,
    setIsSumCrossSeriesAggregation,
    setIsLastValue,
    onTypeChange
  } = formCallbacks({
    onChange,
    metricDefaultFormatter,
    isCrossSeriesAggregationRestricted
  });

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

  // In case multi group is enabled, it should change the groupKey from "by" to "groupBys" for backward compatibility.
  useEffect(() => {
    if (isMultiGroup && grouping && !grouping?.groupBys) {
      const filteredGrouping = grouping && Object.fromEntries(Object.entries(grouping).filter(([key]) => key !== 'by'));
      onChangeGrouping(onChange, { ...filteredGrouping, [groupKey]: [grouping?.by] }, groupKey);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMultiGroup]);

  // Update metric formatter with builtin one
  useEffect(() => {
    onChange([], form => {
      let f = form;

      if (autoFormatterTimeSeriesEnabled) {
        f = f.updateIn(['formatter'], field => field.setValue(metricDefaultFormatter).setTouched(true));
      }

      if (preSelectedUnit) {
        f = f.updateIn([unitPath], field => field.setValue(preSelectedUnit?.id).setTouched(true));
      }

      return f;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [metricDefaultFormatter, preSelectedUnit, metricMetadatas]);

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
            onSelectType={onSelectType}
            backendQueryModel={backendQueryModel}
            SelectorOverlay={MetricSelectionCategoryOverlay}
            withUnit={unitForInfraMetricsEnabled && withUnit}
            onUnitChange={e => setUnit(e.target.value)}
            preSelectedUnit={preSelectedUnit}
            unitField={unitField}
            selectedType={selectedType}
          />
          <TouchedMessages field={metricField} />
          <ValidationMessages form={form} category={regexValidationError} />
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
                        onToggle={e => setIsSumCrossSeriesAggregation(e)}
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
                {lastValueForNonTimeSeriesWidgetEnabled && withLastValue && (
                  <div className={locals.lastValueWrapper}>
                    <span>
                      <Toggle
                        id="metric-configurator-use-last-value"
                        checked={isLastValue}
                        onToggle={e => setIsLastValue(e)}
                      />
                    </span>
                    <Spacer horizontal="xxsmall" />
                    {t('in-custom-dashboards:widgets.srcInfrastructure.metricsFormComponent.lastValue')}
                    <Spacer horizontal="small" />
                    <HelpAction>
                      {t('in-custom-dashboards:widgets.srcInfrastructure.metricsFormComponent.lastValueHelp')}
                    </HelpAction>
                  </div>
                )}
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
            additionalGetTagCatalogProps={{ ownerType: type, metric, regex: isRegex }}
            withoutIcon
          />
        </Sections>
      )}

      <GroupingConfiguration
        withGrouping={withGrouping}
        grouping={grouping}
        tagCatalog={tagCatalog}
        tagFilterExpressionField={tagFilterExpressionField}
        onByChange={infraExploreGrouping => {
          const { groupKey, groups } = getGroups({ isMultiGroup, infraExploreGrouping });
          onChangeGrouping(onChange, { ...grouping, [groupKey]: groups }, groupKey);
        }}
        onDirectionChange={onDirectionChange}
        onIncludeOthersChange={onIncludeOthersChange}
        GroupingConfigurator={GroupingConfigurator}
        hasError={groupingField ? groupingField.touched && !groupingField.valid : false}
        additionalContent={<TouchedMessages field={groupingField} />}
        withOptionalMarker={!isRequiringGroupingConfiguration(form)}
        maxGrouping={maxGrouping}
        additionalGetTagCatalogProps={{ ownerType: type, metric, regex: isRegex }}
        hideIncludeOthersToggle
      />

      {timeShiftConfiguration}

      {thresholdConfiguration}

      {labelSection}

      {withEmptyValueFilterSection}
    </Stack>
  );
}

function getGrouping(form) {
  return form.get('grouping')?.get(0)?.toJS();
}

export function getCrossSeriesAggregationTooltip(
  isCrossSeriesAggregationRestricted,
  isCrossSeriesAggregationEnabled,
  aggregation
) {
  if (isCrossSeriesAggregationRestricted) {
    return t(
      'in-custom-dashboards:widgets.srcInfrastructure.metricsFormComponent.crossSeriesAggregationRestrictedHelp'
    );
  }
  return !isCrossSeriesAggregationEnabled && !['SUM', 'PER_SECOND', 'INCREASE'].includes(aggregation)
    ? t('in-custom-dashboards:widgets.srcInfrastructure.metricsFormComponent.crossSeriesAggregationDisabledHelp', {
        aggregation: aggregationLabels[aggregation]
      })
    : '';
}

function hasRegexValidationError(form) {
  return hasErrorOfCategory(form, regexValidationError);
}

export function getGroups({ isMultiGroup, infraExploreGrouping }) {
  if (!isMultiGroup) {
    return {
      groupKey: 'by',
      groups: infraExploreGrouping
    };
  }

  const groupBys = Array.isArray(infraExploreGrouping) ? infraExploreGrouping : [infraExploreGrouping];

  const uniqueGroupBys = groupBys.filter(
    (group, index) => index === groupBys.findIndex(item => group.groupbyTag === item.groupbyTag)
  );

  return {
    groupKey: 'groupBys',
    groups: uniqueGroupBys
  };
}

export function includesInSelectedAggregations(aggregationFieldValue) {
  return ['MEAN', 'MIN', 'MAX'].includes(aggregationFieldValue);
}

function getMetricDefaultFormatter({ baseUnit, isFormatterSelected, metric, formatter, uiMetricFormatter }) {
  const formatters = getInfrastructureMetricFormatter(baseUnit);
  const isFormatterAvailable = formatters.find(formatter => formatter.id === formatter);

  const metricDefaultFormatter =
    isFormatterSelected || (metric && formatter !== defaultFormatter.id && isFormatterAvailable)
      ? formatter
      : uiMetricFormatter;

  return metricDefaultFormatter;
}
