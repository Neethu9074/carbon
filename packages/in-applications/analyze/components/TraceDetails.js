import { empty } from 'reactive-observables';
import theme from 'in-themes';
import { get } from 'lodash';
import React from 'react';

import AppNavigatorSplitScreen from 'in-analyze/TraceDetail/components/AppNavigatorSplitScreen/AppNavigatorSplitScreen';
import { traceId as traceIdMatrixParameter, callId as callIdMatrixParameter } from 'in-analyze/navigation/matrix';
import { getIconByType, getLabelByType } from 'in-analyze/AnalyzeView/dataSources';
import TracesNavigator from 'in-applications/analyze/components/TracesNavigator';
import CallsNavigator from 'in-applications/analyze/components/CallsNavigator';
import { colorCodeMatrixParameter } from 'in-applications/navigation/matrix';
import getTraceSummary from 'in-subscription/application/getTraceSummary';
import TabView from 'in-new-components/LocationAwareTabView/TabView';
import ViewTrackingMeta from 'in-services/tracking/ViewTrackingMeta';
import DashboardHeader from 'in-new-components/DashboardHeader';
import { getLinkToAnalyze } from 'in-analyze/navigation/paths';
import useCursorPagination from 'in-hooks/useCursorPagination';
import { getColorPool } from 'in-services/util/ColorGenerator';
import { traceDetail } from 'in-analyze/navigation/paths';
import { getColor } from 'in-applications/endpointTypes';
import tabs from 'in-analyze/TraceDetail/tabs/index';
import useTimeConfig from 'in-hooks/useTimeConfig';
import useUrlState from 'in-hooks/useUrlState';
import Button from 'in-new-components/Button';
import Tooltip from 'in-components/Tooltip';
import SvgIcon from 'in-components/SvgIcon';
import Sticky from 'in-components/Sticky';
import Link from 'in-components/Link';
import { role } from 'in-stores/user';

import locals from './TraceDetails.mless';

export default function TraceDetails({
  dataSource,
  getUngroupedData,
  isValid,
  order,
  hiddenCalls,
  tagFilterExpression,
  onChangeOrder
}) {
  const urlStateConfig = {
    replaceHistory: false,
    bind: [
      {
        path: traceDetail,
        name: traceIdMatrixParameter
      },
      {
        path: traceDetail,
        name: callIdMatrixParameter
      },
      colorCodeMatrixParameter
    ]
  };

  const timeConfig = useTimeConfig();

  const paginatedResult = useCursorPagination(
    ({ cursor }) =>
      isValid
        ? getUngroupedData({
            timeConfig,
            retrievalSize: 50,
            tagFilterExpression,
            order,
            cursor,
            hiddenCalls,
            dataSource
          })
        : empty,
    [timeConfig, tagFilterExpression, isValid, hiddenCalls, dataSource, order]
  );

  const byServiceEndpointCombinationUrlIdentifier = 'byServiceAndEndpoint';
  const byEndpointTypeUrlIdentifier = 'byEndpointType';

  const getColorByEndpointType = ({ endpoint }) => getColor(endpoint ? endpoint.type : 'UNDEFINED');

  const getColorByEndpoint = ({ service, endpoint, traceId }) =>
    getColorPool(traceId, theme.lib.colors.chart.strokeColors100).getColorHex(
      `${service && service.id}__${endpoint && endpoint.id}`
    );

  const [urlState, onUrlStateChange] = useUrlState(urlStateConfig);
  const traceId = urlState.traceId;
  const callId = urlState.callId;
  const colorCode = urlState.colorCode ?? byEndpointTypeUrlIdentifier;
  const onColorCodeChange = colorCode => onUrlStateChange({ colorCode });

  const props = {
    traceId,
    getColor: args => {
      const getColorBy =
        colorCode === byServiceEndpointCombinationUrlIdentifier ? getColorByEndpoint : getColorByEndpointType;
      return getColorBy({
        ...args,
        traceId
      });
    },
    setColorCodeMechanism: onColorCodeChange,
    colorCodeType: colorCode
  };

  return (
    <>
      <ViewTrackingMeta
        data={{
          productArea: 'Applications',
          pageRootName: 'Analytics'
        }}
      />
      <Sticky
        header={
          <DashboardHeader
            {...props}
            icon={getIconByType(dataSource, 'application')}
            contextConfigurations={[{ renderContext, contextIcon: 'lib_analyze_inverted' }]}
            label={getLabelByType(dataSource)}
            title="Analytics"
            dataSource={dataSource}
          />
        }
      >
        <AppNavigatorSplitScreen
          navigator={
            dataSource === 'calls' ? (
              <CallsNavigator
                selectedTraceId={traceId}
                selectedCallId={callId}
                orderBy={order.by}
                orderDirection={order.direction}
                onChangeOrder={onChangeOrder}
                {...paginatedResult}
              />
            ) : (
              <TracesNavigator
                selectedTraceId={traceId}
                orderBy={order.by}
                orderDirection={order.direction}
                onChangeOrder={onChangeOrder}
                {...paginatedResult}
              />
            )
          }
          dataSource={dataSource}
          traceId={traceId}
          callId={callId}
          traceDetail={
            <TabView
              HeaderComponent={Header}
              tabs={tabs}
              result$={getTraceSummary({ id: traceId })}
              withoutBreadcrumb
              withoutPadding
              props={props}
            />
          }
        />
      </Sticky>
    </>
  );
}

function renderContext({ dataSource }) {
  return (
    <Link className={locals.analyticsLink} href$={getLinkToAnalyze({ dataSource })}>
      Analytics
    </Link>
  );
}

function Header(props) {
  return (
    <DashboardHeader
      {...props}
      title="Trace"
      icon="lib_application_trace"
      label={get(props.result, ['data', 'label'])}
      renderButtonLine={renderButtonLine}
      renderMetaInformation={renderMetaInformation}
      renderTimeSelection={renderTimeSelection}
      hideUrlShortener
    />
  );
}

function renderButtonLine({ traceId }) {
  if (!role.canViewLogs || !role.canViewTraceDetails) {
    return null;
  }

  return (
    <>
      <Button
        icon="lib_actions_download"
        kind="secondary"
        target="_blank"
        href={`/api/application-monitoring/analyze/traces;id=${encodeURIComponent(traceId)}?pretty`}
      >
        Download
      </Button>
    </>
  );
}

function renderMetaInformation({ result }) {
  return (
    <div>
      <span className={locals.traceIdLabel}>Trace ID: </span>
      <code className={locals.traceId}>{result.data.id}</code>
    </div>
  );
}

function renderTimeSelection({ dataSource }) {
  return (
    <Link href$={getLinkToAnalyze({ dataSource })}>
      <Tooltip content="Close trace detail">
        <SvgIcon className={locals.closeIcon} aria-label="Close trace detail" type="lib_openclose_cancel" />
      </Tooltip>
    </Link>
  );
}
