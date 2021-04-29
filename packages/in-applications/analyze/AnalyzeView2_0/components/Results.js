/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { Link } from '@instana/components';
import { clamp } from 'lodash';
import React from 'react';

import QueryBuilderWorkspace from 'in-applications/analyze/AnalyzeView2_0/components/QueryBuilderWorkspace';
import UngroupedViewTable, { retrievalSize } from 'in-new-components/AnalyzeView/UngroupedViewTable';
import TraceDetailView from 'in-applications/analyze/AnalyzeView2_0/components/TraceDetailView';
import PreviewToggle from 'in-applications/analyze/AnalyzeView2_0/components/PreviewToggle';
import getTraceSummary from 'in-subscription/application/getTraceSummary';
import TableLinkWithIcon from 'in-analyze/components/TableLinkWithIcon';
import BatchingIndicator from 'in-analyze/components/BatchingIndicator';
import { getServiceDashboard } from 'in-applications/navigation/paths';
import { getTypeTextByCount } from 'in-applications/analyze/metrics';
import getTraces from 'in-subscription/application/getTraces';
import { latencyFixed } from 'in-services/formatters/number';
import getCalls from 'in-subscription/application/getCalls';
import HealthDot from 'in-new-components/health/HealthDot';
import { number } from 'in-services/formatters/number';
import SvgIcon from 'in-components/SvgIcon';
import Tooltip from 'in-components/Tooltip';
import { t } from 'in-i18n';

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
  const { dataSource, hiddenCalls, previewEnabled, onChangePreviewEnabled, withoutHeader, detailId } = props;
  let content = (
    <UngroupedViewTable
      {...props}
      getItemName={({ count }) =>
        t('in-applications:analyze.dataSource', {
          context: dataSource,
          count,
          formattedCount: number.compact(count)
        })
      }
      columnDefinitions={columnsPerDataSource[dataSource]}
      getData={({ timeConfig, backendQueryModel, orderBy, cursor }) =>
        getTableData({
          timeConfig,
          backendQueryModel,
          orderBy,
          cursor,
          dataSource: dataSource,
          hiddenCalls: hiddenCalls,
          previewEnabled: previewEnabled
        })
      }
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
      withSamplingTooltip
      CustomHeaderActions={() => (
        <PreviewToggle previewEnabled={previewEnabled} onChangePreviewEnabled={onChangePreviewEnabled} />
      )}
      additionalGetDataDependencies={[hiddenCalls, previewEnabled]}
      hideMetricAndSortingConfigurator
    />
  );

  if (!withoutHeader && !detailId) {
    content = <QueryBuilderWorkspace {...props}>{content}</QueryBuilderWorkspace>;
  }

  return content;
}

function getTableData({ timeConfig, backendQueryModel, orderBy, cursor, dataSource, hiddenCalls, previewEnabled }) {
  const { includeSynthetic = false, includeInternal = false } = hiddenCalls;
  const getData = getDataPerDataSource[dataSource];
  return getData({
    pagination: {
      cursor,
      retrievalSize
    },
    order: orderBy,
    tagFilterExpression: backendQueryModel,
    filter: {
      timeConfig: timeConfig
    },
    includeSynthetic,
    includeInternal,
    queryPrecision: previewEnabled ? 'APPROXIMATE' : 'FULL'
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
        const severity = item[type].errorCount;
        return (
          <Tooltip
            content={severity > 0 ? t('in-applications:analyze.containsErrors') : t('in-applications:analyze.noErrors')}
            align="rightMiddle"
          >
            <div className={locals.erroneous}>
              <HealthDot severity={clamp(severity, 10)} iconSize={10} />
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
      ellipsis: true,
      getContent(item, { getHrefToDetailId, groupLabel }) {
        return (
          <div className={locals.batchedLine}>
            <LinkToDetailPage
              item={item}
              dataSource={dataSource}
              getHrefToDetailId={getHrefToDetailId}
              linkLabel={item[type].label}
              groupLabel={groupLabel}
            />
            <BatchingIndicator
              batchCount={item[type].batchCount}
              tooltipContent={t('in-applications:analyze.listBatchTypeTooltip', {
                type: getTypeTextByCount(type, 1),
                batchCount: item[type].batchCount,
                types: getTypeTextByCount(type, item[type].batchCount)
              })}
            />
          </div>
        );
      }
    },
    {
      id: 'service',
      label: t('in-applications:labelService'),
      sortable: false,
      getContent(item) {
        return (
          <TableLinkWithIcon href$={getServiceDashboard(item[type].service.id)}>
            {item[type].service.label}
          </TableLinkWithIcon>
        );
      },
      width: '25'
    },
    {
      id: 'latency',
      label: t('in-applications:labelLatency'),
      getContent(item) {
        return (
          <>
            {latencyFixed.compact(item[type].duration)}
            <BatchingIndicator
              batchCount={item[type].batchCount}
              tooltipContent={t('in-applications:analyze.listBatchLatencyTooltip', {
                batchCount: item[type].batchCount,
                type: getTypeTextByCount(item, item[type].batchCount)
              })}
            />
          </>
        );
      },
      widthInAbsoluteUnit: true,
      width: '7rem'
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
