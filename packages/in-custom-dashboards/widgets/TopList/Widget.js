/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { useObservable } from '@instana/hooks';
import { Link } from '@instana/components';

import { fromBackendModel, joinExpressions } from 'in-components/QueryBuilder/transformation/formModel';
import { getTagCatalog } from 'in-applications/analyze/components/workspace/CallQueryBuilder';
import { type as TAG_FILTER } from 'in-components/QueryBuilder/transformation/tagFilter';
import TopListCardPresenter from 'in-components/TopListCard/TopListCardPresenter';
import { getLinkToAnalyzeDeprecated } from 'in-analyze/navigation/paths';
import { NO_VALUE } from 'in-analyze/components/GroupedTraces/Group';
import { extendWindowSizeOnLiveMode } from 'in-applications/metrics';
import { getLinkToAnalyze } from 'in-applications/navigation/paths';
import getUnifiedMetrics from 'in-subscription/getUnifiedMetrics';
import useTagCatalog from 'in-applications/hooks/useTagCatalog';
import { isParseableAsNumber } from 'in-services/util/number';
import { close } from 'in-components/DialogPresenter/store';
import { getFormatter } from 'in-stores/metric/formatters';
import { operators } from 'in-analyze/applicationFilter';
import { pendingResult } from 'in-services/fixedObjects';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { getTagType } from 'in-applications/tags';
import Tooltip from 'in-components/Tooltip';
import theme from 'in-themes';
import { t } from 'in-i18n';

import locals from './Widget.mless';

export default function ListWidget({ config, title, actions, dragHandle }) {
  const timeConfig = useTimeConfig();
  const tagCatalog = useTagCatalog(getTagCatalog);
  let result = useResultData(config, timeConfig) ?? pendingResult;
  const isErroneous =
    config.metricConfiguration.metric === 'erroneousCalls' || config.metricConfiguration.metric === 'errors';
  return (
    <TopListCardPresenter
      title={title}
      result={result}
      getItemsFromResult={result => result.data}
      getMetricValueFromItem={(selectedMetric, item) => item.values?.[0]?.[1]}
      selectedMetricFormatter={metricValue => getFormatter(config.formatter)(metricValue)}
      selectedMetricColor={isErroneous ? theme.lib.colors.failure : null}
      Label={Label}
      Metric={Metric}
      config={config}
      tagCatalog={tagCatalog}
      header={
        <>
          {dragHandle}
          {actions}
        </>
      }
    />
  );
}

function Label({ item, config, result, tagCatalog }) {
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

  let formModel = fromBackendModel(config.metricConfiguration.tagFilterExpression);

  if (item.label !== 'other_group') {
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
              value: getConvertedValue(item.label),
              operator: operators.EQUALS,
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

  const link = config.metricConfiguration.tagFilterExpression
    ? getLinkToAnalyze({
        dataSource: 'calls',
        formModel
      })
    : tagCatalog &&
      getLinkToAnalyzeDeprecated({
        dataSource: 'calls',
        filters,
        tagCatalog
      });

  return (
    config.metricConfiguration.grouping && (
      <Link href$={link} onClick={close}>
        <LinkContent item={item} groupBy={groupBy} />
      </Link>
    )
  );
}

function Metric({ formattedMetricValue }) {
  return formattedMetricValue;
}

function useResultData(config, timeConfig) {
  const timeConfigExtendedForLiveMode = extendWindowSizeOnLiveMode(timeConfig);

  const metrics = {
    list: {
      ...config.metricConfiguration,
      timeShift: {
        offset: 0
      },
      timeConfig: timeConfigExtendedForLiveMode,
      resultType: 'SINGLE_NUMBER'
    }
  };

  return useObservable(() => getUnifiedMetrics({ metrics }), [timeConfig, config]);
}

function LinkContent({ item, groupBy }) {
  if (item.label === 'other_group') {
    return (
      <Tooltip content={t('in-custom-dashboards:widgets.topList.widget.aggregOtherGroup')} align="rightMiddle">
        <div className={locals.italic}>{t('in-custom-dashboards:widgets.topList.widget.other')}</div>
      </Tooltip>
    );
  }

  if (item.label === NO_VALUE) {
    const label = groupBy.groupbyTagSecondLevelKey
      ? `${groupBy.groupbyTag} > ${groupBy.groupbyTagSecondLevelKey}`
      : groupBy.groupbyTag;
    return t('in-custom-dashboards:widgets.topList.widget.tagNoValue', { labelname: label });
  }

  return item.label;
}

function getConvertedValue(value) {
  if (isParseableAsNumber(value)) {
    return parseFloat(value);
  }
  if (value === 'true' || value === 'false') {
    return JSON.parse(value);
  }
  return value;
}
