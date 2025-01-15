/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import React from 'react';

import { themes } from '@instana/design-tokens';
import { Link } from '@instana/components';

import {
  getFilterResultNote,
  useFilteredMetricConfiguration
} from 'in-custom-dashboards/CustomDashboard/FilterContext/FilterContext';
import { default as SyntheticTopListCatalog } from 'in-custom-dashboards/widgets/TopList/catalogs/SyntheticTopListCatalog';
import { enrichBySettingDataSource } from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/bizops/utils';
import { default as WebsiteTopListCatalog } from 'in-custom-dashboards/widgets/TopList/catalogs/WebsiteTopListCatalog';
import { default as MobileTopListCatalog } from 'in-custom-dashboards/widgets/TopList/catalogs/MobileTopListCatalog';
import { default as BizOpsTopListCatalog } from 'in-custom-dashboards/widgets/TopList/catalogs/BizOpsTopListCatalog';
import { default as InfraTopListCatalog } from 'in-custom-dashboards/widgets/TopList/catalogs/InfraTopListCatalog';
import { default as AppTopListCatalog } from 'in-custom-dashboards/widgets/TopList/catalogs/AppTopListCatalog';
import { fromBackendModel, joinExpressions } from 'in-components/QueryBuilder/transformation/formModel';
import { useLinkToExplore as useLinkToInfraEntityExplore } from 'in-infrastructure/navigation/paths';
import { useLinkToAnalyze as useLinkToApplicationAnalyze } from 'in-applications/navigation/paths';
import { hasApplicationMetrics } from 'in-custom-dashboards/widgets/_shared/hasApplicationMetrics';
import { useLinkToAnalyze as useLinkToMobileAppAnalyze } from 'in-mobile-apps/navigation/paths';
import { type as TAG_FILTER } from 'in-components/QueryBuilder/transformation/tagFilter';
import { defaultGroupings as defaultMobileAppGroupings } from 'in-mobile-apps/tags';
import TopListCardPresenter from 'in-components/TopListCard/TopListCardPresenter';
import { customDashboardsFastQueryModeEnabled } from 'in-services/featureFlags';
import { defaultGroupings as defaultWebsiteGroupings } from 'in-websites/tags';
import { useLinkToAnalyzeDeprecated } from 'in-analyze/navigation/paths';
import { hasInfrastructureAnalyzeAccess } from 'in-stores/permission';
import { NO_VALUE } from 'in-analyze/components/GroupedTraces/Group';
import { useLinkToAnalyze } from 'in-websites/navigation/paths';
import { isParseableAsNumber } from 'in-services/util/number';
import { close } from 'in-components/DialogPresenter/store';
import { getFormatter } from 'in-stores/metric/formatters';
import { operators } from 'in-analyze/applicationFilter';
import unwrapLink from 'in-stores/navigation/unwrapLink';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { getTagType } from 'in-applications/tags';
import Tooltip from 'in-components/Tooltip';
import { t } from 'in-i18n';

import locals from 'in-custom-dashboards/widgets/TopList/Widget.mless';

export default function ListWidget({ config: baseConfig, title, actions, isInModal, dragHandle }) {
  const { metricConfiguration, result: filterResult } = useFilteredMetricConfiguration(baseConfig.metricConfiguration);
  const config = { ...baseConfig, metricConfiguration };
  const timeConfig = useTimeConfig();

  switch (config.metricConfiguration.source) {
    case 'APPLICATION':
      return (
        <AppTopListCatalog
          config={config}
          title={title}
          actions={actions}
          isInModal={isInModal}
          dragHandle={dragHandle}
          timeConfig={timeConfig}
          filterResult={filterResult}
        />
      );
    case 'MOBILE_APP':
      return (
        <MobileTopListCatalog
          config={config}
          title={title}
          actions={actions}
          isInModal={isInModal}
          dragHandle={dragHandle}
          timeConfig={timeConfig}
          filterResult={filterResult}
        />
      );
    case 'WEBSITE':
      return (
        <WebsiteTopListCatalog
          config={config}
          title={title}
          actions={actions}
          isInModal={isInModal}
          dragHandle={dragHandle}
          timeConfig={timeConfig}
          filterResult={filterResult}
        />
      );
    case 'SYNTHETICS':
      return (
        <SyntheticTopListCatalog
          config={config}
          title={title}
          actions={actions}
          isInModal={isInModal}
          dragHandle={dragHandle}
          timeConfig={timeConfig}
          filterResult={filterResult}
        />
      );
    case 'INFRASTRUCTURE_METRICS':
      return (
        <InfraTopListCatalog
          config={config}
          title={title}
          actions={actions}
          isInModal={isInModal}
          dragHandle={dragHandle}
          timeConfig={timeConfig}
          filterResult={filterResult}
        />
      );
    case 'BIZOPS':
      // add bizops data source
      config.metricConfiguration = enrichBySettingDataSource(config.metricConfiguration);

      return (
        <BizOpsTopListCatalog
          config={config}
          title={title}
          actions={actions}
          isInModal={isInModal}
          dragHandle={dragHandle}
          timeConfig={timeConfig}
          filterResult={filterResult}
        />
      );
  }
}

export function ListWidgetRenderer({
  result,
  isErroneous,
  tagCatalog,
  config,
  title,
  actions,
  isInModal,
  dragHandle,
  timeConfig,
  filterResult
}) {
  const hasApproximateData =
    result?.data?.filter(elem => elem?.resultPrecisionDetails?.resultPrecision === 'PRECISION_APPROXIMATE').length > 0;
  const approximateTooltipText =
    customDashboardsFastQueryModeEnabled && hasApplicationMetrics(config)
      ? t('in-components:approximateDataIndicator.dataRetentionOrFastQueryMode')
      : t('in-components:approximateDataIndicator.dataRetention');
  return (
    <TopListCardPresenter
      title={title}
      result={result}
      getItemsFromResult={result => result.data}
      getMetricValueFromItem={(_, item) => item.values?.[0]?.[1]}
      selectedMetricFormatter={metricValue => getFormatter(config.formatter)(metricValue)}
      selectedMetricColor={isErroneous ? themes.default.ids.color.option.red['500'] : null}
      Label={Label}
      Metric={Metric}
      config={config}
      tagCatalog={tagCatalog}
      renderHistoricDataIndicator
      hasApproximateData={hasApproximateData}
      approximateTooltipText={approximateTooltipText}
      isScrollbarVisible
      isInModal={isInModal}
      header={
        <>
          {dragHandle}
          {actions}
        </>
      }
      timeConfig={timeConfig}
      topLevelFilterInfo={getFilterResultNote(filterResult)}
    />
  );
}

function Label({ item, config, result, tagCatalog }) {
  let formModel = fromBackendModel(config.metricConfiguration.tagFilterExpression);

  const analyzeHref = useLinkToAnalyze({
    groupBy: defaultWebsiteGroupings[config.metricConfiguration.beaconType],
    formModel,
    beaconType: config.metricConfiguration.beaconType,
    tagCatalog
  });
  const getLinkToApplicationAnalyze = useLinkToApplicationAnalyze();
  const getLinkToAnalyzeDeprecated = useLinkToAnalyzeDeprecated();
  const getLinkToMobileAppAnalyze = useLinkToMobileAppAnalyze();
  const getLinkToInfraEntityExplore = useLinkToInfraEntityExplore();

  //Synthetic monitoring does not have Analytics page yet so no link to it.
  if (config.metricConfiguration.source === 'SYNTHETICS') {
    return <div className={locals.italic}>{item.label}</div>;
  }

  let filters = config.metricConfiguration.tagFilters;
  if (filters) {
    if (config.metricConfiguration.grouping) {
      if (item.label !== 'other_group') {
        filters = filters.concat([
          {
            name: config.metricConfiguration.grouping[0].by.groupbyTag,
            value: item.label,
            operator: operators.EQUALS,
            entity: config.metricConfiguration.grouping[0].by.groupbyTagEntity
          }
        ]);
      } else {
        filters = filters.concat(
          result.data
            .filter(item => item.label !== 'other_group')
            .map(item => {
              return {
                name: config.metricConfiguration.grouping[0].by.groupbyTag,
                value: item.label,
                operator: operators.NOT_EQUAL,
                entity: config.metricConfiguration.grouping[0].by.groupbyTagEntity
              };
            })
        );
      }
    }
  }

  const groupBy = config.metricConfiguration.grouping?.[0].by;

  if (item.label !== 'other_group') {
    const convertedValue = getConvertedValue(item.label);
    formModel = joinExpressions({
      expressions: [
        formModel,
        getTagType(groupBy?.groupbyTag) === 'KEY_VALUE_PAIR' && !groupBy?.groupbyTagSecondLevelKey
          ? {
              type: TAG_FILTER,
              name: groupBy?.groupbyTag,
              key: item.label,
              operator: operators.NOT_EMPTY,
              entity: groupBy?.groupbyTagEntity
            }
          : {
              type: TAG_FILTER,
              name: groupBy?.groupbyTag,
              key: groupBy?.groupbyTagSecondLevelKey ? groupBy?.groupbyTagSecondLevelKey : undefined,
              value: convertedValue !== '' ? convertedValue : undefined,
              operator: convertedValue !== '' ? operators.EQUALS : operators.IS_BLANK,
              entity: groupBy?.groupbyTagEntity
            }
      ]
    });
  } else {
    const filteredTags = result.data
      .filter(item => item.label !== 'other_group')
      .map(item => {
        return getTagType(groupBy?.groupbyTag) === 'KEY_VALUE_PAIR' && !groupBy?.groupbyTagSecondLevelKey
          ? {
              type: TAG_FILTER,
              name: groupBy?.groupbyTag,
              key: item.label,
              operator: operators.IS_EMPTY,
              entity: groupBy?.groupbyTagEntity
            }
          : {
              type: TAG_FILTER,
              name: groupBy?.groupbyTag,
              key: groupBy?.groupbyTagSecondLevelKey ? groupBy?.groupbyTagSecondLevelKey : undefined,
              value: getConvertedValue(item.label),
              operator: operators.NOT_EQUAL,
              entity: groupBy?.groupbyTagEntity
            };
      });
    filteredTags.push(formModel);
    filteredTags.push({
      type: TAG_FILTER,
      name: groupBy?.groupbyTag,
      key: groupBy?.groupbyTagSecondLevelKey,
      operator: operators.NOT_EMPTY,
      entity: groupBy?.groupbyTagEntity
    });
    formModel = joinExpressions({
      expressions: filteredTags
    });
  }
  const { includeInternal = false, includeSynthetic = false } = config.metricConfiguration;
  const hiddenCalls = {
    includeInternal,
    includeSynthetic
  };
  let link = config.metricConfiguration.tagFilterExpression
    ? getLinkToApplicationAnalyze({
        dataSource: 'calls',
        formModel,
        hiddenCalls
      })
    : tagCatalog &&
      getLinkToAnalyzeDeprecated({
        dataSource: 'calls',
        filters,
        tagCatalog
      });

  switch (config.metricConfiguration.source) {
    case 'MOBILE_APP':
      link = getLinkToMobileAppAnalyze({
        groupBy: defaultMobileAppGroupings[config.metricConfiguration.beaconType],
        formModel,
        beaconType: config.metricConfiguration.beaconType,
        tagCatalog
      });
      break;
    case 'WEBSITE':
      link = analyzeHref;
      break;
    case 'INFRASTRUCTURE_METRICS':
      link =
        (hasInfrastructureAnalyzeAccess && getLinkToEntityExplore(config, formModel, getLinkToInfraEntityExplore)) ||
        '';
      break;
  }

  const { href$, href } = unwrapLink(link);

  return (
    config.metricConfiguration.grouping && (
      <Link href={href$ ?? href} onClick={close} className={locals.compactLink}>
        <LinkContent item={item} groupBy={groupBy} />
      </Link>
    )
  );
}

function Metric({ formattedMetricValue }) {
  return formattedMetricValue;
}

function LinkContent({ item, groupBy }) {
  if (item.label === 'other_group') {
    return (
      <Tooltip content={t('in-custom-dashboards:widgets.topList.widget.aggregOtherGroup')} align="rightMiddle">
        <div className={locals.italic}>{t('in-custom-dashboards:widgets.topList.widget.other')}</div>
      </Tooltip>
    );
  }

  if (item.label === '') {
    return <div className={locals.italic}>{t('in-components:chart.chartLegendBlankLabel')}</div>;
  }

  if (item.label === NO_VALUE) {
    const label = groupBy.groupbyTagSecondLevelKey
      ? `${groupBy.groupbyTag} > ${groupBy.groupbyTagSecondLevelKey}`
      : groupBy.groupbyTag;
    return t('in-custom-dashboards:widgets.topList.widget.tagNoValue', { labelname: label });
  }

  return item.label ?? null;
}

function getConvertedValue(value) {
  if (value === '') {
    return '';
  }
  if (isParseableAsNumber(value)) {
    return parseFloat(value);
  }
  if (value === 'true' || value === 'false') {
    return JSON.parse(value);
  }
  return value;
}

function getLinkToEntityExplore(config, formModel, getLinkToInfraEntityExplore) {
  return getLinkToInfraEntityExplore({
    type: config.metricConfiguration.type,
    ...infraMetrics(config),
    tagFilterExpression: formModel
  });
}

function infraMetrics(config) {
  if (config.metricConfiguration.metric === 'count') {
    return {};
  }
  return {
    order: {
      by: `${config.metricConfiguration.metric}.${config.metricConfiguration.aggregation}`,
      direction: config.metricConfiguration.grouping[0].direction
    },
    metrics: [
      {
        metric: config.metricConfiguration.metric,
        aggregation: config.metricConfiguration.aggregation
      }
    ]
  };
}
