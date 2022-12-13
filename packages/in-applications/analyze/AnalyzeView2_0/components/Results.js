/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React, { useCallback } from 'react';

import { Link, SvgIcon } from '@instana/components';

import { FacetedSearchPresenter } from 'in-applications/analyze/AnalyzeView2_0/components/FacetedSearchPresenter';
import UngroupedViewTable, { retrievalSize } from 'in-components/AnalyzeView/UngroupedView/UngroupedViewTable';
import QueryBuilderWorkspace from 'in-applications/analyze/AnalyzeView2_0/components/QueryBuilderWorkspace';
import FastQueryModeToggle from 'in-applications/analyze/AnalyzeView2_0/components/FastQueryModeToggle';
import { ChartsPresenter } from 'in-applications/analyze/AnalyzeView2_0/components/ChartsPresenter';
import TraceDetailView from 'in-applications/analyze/AnalyzeView2_0/components/TraceDetailView';
import { getServerity } from 'in-applications/analyze/AnalyzeView2_0/components/utils';
import getTraceSummary from 'in-applications/subscriptions/getTraceSummary';
import { LESS_THAN } from 'in-components/QueryBuilder/tagFilter/operators';
import BatchingIndicator from 'in-analyze/components/BatchingIndicator';
import { getServiceDashboard } from 'in-applications/navigation/paths';
import { getTypeTextByCount } from 'in-applications/analyze/metrics';
import getTraces from 'in-applications/subscriptions/getTraces';
import getCalls from 'in-applications/subscriptions/getCalls';
import HealthDot from 'in-components/health/HealthDot';
import { number } from 'in-services/formatters/number';
import { collationLanguage, t } from 'in-i18n';
import Tooltip from 'in-components/Tooltip';

import locals from './Results.mless';

const getDataPerDataSource = {
  calls: getCalls,
  traces: getTraces
};

const typePerDataSource = {
  calls: 'call',
  traces: 'trace'
};

const namePerDataSource = {
  calls: t('in-applications:labelCall'),
  traces: t('in-applications:labelTrace')
};

const traceIdNamePerDataSource = {
  calls: 'traceId',
  traces: 'id'
};

const columnsPerDataSource = {
  calls: getColumnDefinitions('calls'),
  traces: getColumnDefinitions('traces')
};

export default function Results(props) {
  const {
    Chart = ChartsPresenter,
    Sidebar = FacetedSearchPresenter,
    dataSource,
    hiddenCalls,
    fastQueryModeEnabled,
    onChangeFastQueryModeEnabled,
    withoutHeader,
    detailId
  } = props;

  const getData = useCallback(
    params => {
      return getTableData({ ...params, hiddenCalls, fastQueryModeEnabled });
    },
    [hiddenCalls, fastQueryModeEnabled]
  );

  let content = (
    <UngroupedViewTable
      {...props}
      Sidebar={Sidebar}
      Chart={Chart}
      getItemName={({ count }) =>
        t('in-applications:analyze.dataSource', {
          context: dataSource,
          count,
          formattedCount: number.compact(count)
        })
      }
      columnDefinitions={columnsPerDataSource[dataSource]}
      getData={getData}
      getId={item => {
        const type = typePerDataSource[dataSource];
        const traceIdName = traceIdNamePerDataSource[dataSource];
        return {
          traceId: item[type][traceIdName],
          ...(dataSource !== 'traces' && { callId: item[type].id })
        };
      }}
      DetailView={TraceDetailView}
      getDetailData={getTraceSummary}
      dataSource={dataSource}
      hideMetricAndSortingConfigurator
      withOverflow
    />
  );

  if (!withoutHeader && !detailId) {
    content = (
      <QueryBuilderWorkspace
        CustomAction={() => (
          <FastQueryModeToggle
            fastQueryModeEnabled={fastQueryModeEnabled}
            onChangeFastQueryModeEnabled={onChangeFastQueryModeEnabled}
          />
        )}
        {...props}
      >
        {content}
      </QueryBuilderWorkspace>
    );
  }

  return content;
}

const truncateTagFilterValue = value => {
  return value.slice(0, 512);
};

const replaceZeroFilterValueForLatency = element => {
  element.value = 1;
  element.operator = LESS_THAN;
  return element;
};
function getTableData({
  timeConfig,
  backendQueryModel,
  orderBy,
  cursor,
  dataSource,
  hiddenCalls,
  fastQueryModeEnabled
}) {
  const { includeSynthetic = false, includeInternal = false } = hiddenCalls;
  const getData = getDataPerDataSource[dataSource];
  if (Object.keys(backendQueryModel) && !backendQueryModel.elements) {
    if (backendQueryModel.name === 'call.latency' && backendQueryModel.value === 0) {
      replaceZeroFilterValueForLatency(backendQueryModel);
    }
  }
  backendQueryModel?.elements?.forEach(element => {
    if (element.value?.length > 512) {
      element.value = truncateTagFilterValue(element.value);
    }
    if (element.name === 'call.latency' && element.value === 0) {
      replaceZeroFilterValueForLatency(element);
    }
  });
  return getData({
    pagination: {
      cursor,
      retrievalSize
    },
    order: { ...orderBy, collation: collationLanguage },
    tagFilterExpression: backendQueryModel,
    filter: {
      timeConfig: timeConfig
    },
    includeSynthetic,
    includeInternal,
    queryPrecision: fastQueryModeEnabled ? 'APPROXIMATE' : 'FULL'
  });
}

function getColumnDefinitions(dataSource) {
  const type = typePerDataSource[dataSource];
  return [
    {
      id: 'erroneous',
      label: <div className={locals.dot} />,
      sortable: false,
      getContent(item) {
        const severity = getServerity({ item, dataSource });
        return (
          <Tooltip
            content={severity > 0 ? t('in-applications:analyze.containsErrors') : t('in-applications:analyze.noErrors')}
            align="rightMiddle"
          >
            <div className={locals.erroneous}>
              <HealthDot severity={severity} iconSize={10} />
            </div>
          </Tooltip>
        );
      },
      widthInAbsoluteUnit: true,
      width: '3rem'
    },
    {
      id: `${type}_icon`,
      label: '',
      sortable: false,
      getContent() {
        return <SvgIcon type={`lib_application_${type}`} />;
      },
      widthInAbsoluteUnit: true,
      width: '3rem'
    },
    {
      id: type,
      label: namePerDataSource[dataSource],
      sortable: false,
      getContent(item, { getHrefToDetailId, groupLabel }) {
        const label = item[type].label;
        return (
          <Tooltip content={label} align="bottomLeft" delay={1000}>
            <div className={locals.batchedLine}>
              <LinkToDetailPage
                item={item}
                dataSource={dataSource}
                getHrefToDetailId={getHrefToDetailId}
                linkLabel={label}
                groupLabel={groupLabel}
              />
              <BatchingIndicator
                batchCount={item[type].batchCount}
                tooltipContent={t('in-applications:analyze.listBatchTypeTooltip', {
                  type: getTypeTextByCount(type, 1),
                  batchCount: item[type].batchCount,
                  types: getTypeTextByCount(type, item[type].batchCount)
                })}
                noTopPosition
              />
            </div>
          </Tooltip>
        );
      }
    },
    {
      id: 'service',
      label: t('in-applications:labelService'),
      sortable: false,
      getContent(item) {
        const label = item[type].service.label;
        return (
          <Tooltip content={label} align="bottomLeft" delay={1000}>
            <Link className={locals.link} href$={getServiceDashboard(item[type].service.id)}>
              {label}
            </Link>
          </Tooltip>
        );
      }
    }
  ];
}

function LinkToDetailPage({ item, dataSource, getHrefToDetailId, linkLabel, groupLabel }) {
  const type = typePerDataSource[dataSource];
  const traceIdName = traceIdNamePerDataSource[dataSource];
  return (
    <Link
      className={locals.link}
      href={getHrefToDetailId(
        {
          traceId: item[type][traceIdName],
          ...(dataSource !== 'traces' && { callId: item[type].id })
        },
        groupLabel
      )}
    >
      {linkLabel}
    </Link>
  );
}
