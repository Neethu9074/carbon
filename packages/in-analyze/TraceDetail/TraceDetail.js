import theme from 'in-themes';
import { get } from 'lodash';
import React from 'react';

import AppNavigatorSplitScreen from 'in-analyze/TraceDetail/components/AppNavigatorSplitScreen/AppNavigatorSplitScreen';
import { getIconByType, getLabelByType } from 'in-analyze/AnalyzeView/dataSources';
import { traceId as traceIdMatrixParameter } from 'in-analyze/navigation/matrix';
import getTraceSummary from 'in-subscription/application/getTraceSummary';
import TabView from 'in-new-components/LocationAwareTabView/TabView';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import withUrlDependingState from 'in-hoc/withUrlDependingState';
import DashboardHeader from 'in-new-components/DashboardHeader';
import { getColorPool } from 'in-services/util/ColorGenerator';
import { getLinkToAnalyze } from 'in-analyze/navigation/paths';
import { traceDetail } from 'in-analyze/navigation/paths';
import { getColor } from 'in-applications/endpointTypes';
import tabs from 'in-analyze/TraceDetail/tabs/index';
import Button from 'in-new-components/Button';
import Tooltip from 'in-components/Tooltip';
import SvgIcon from 'in-components/SvgIcon';
import Sticky from 'in-components/Sticky';
import Link from 'in-components/Link';

import locals from './TraceDetail.mless';

const getColorByEndpointType = ({ endpoint }) => getColor(endpoint ? endpoint.type : 'UNDEFINED');
const getColorByEndpoint = ({ service, endpoint, traceId }) =>
  getColorPool(traceId, theme.lib.colors.chart.strokeColors100).getColorHex(
    `${service && service.id}__${endpoint && endpoint.id}`
  );
const byServiceEndpointCombinationUrlIdentifier = 'byServiceAndEndpoint';
const byEndpointTypeUrlIdentifier = 'byEndpointType';

export default withUrlDependingState({
  getPathSegment: () => traceDetail,
  getMatrixPrefix: () => '',
  boundKeys: ['colorCode'],
  getInitialState: () => ({ colorCode: getColorByEndpointType }),
  reducerName: 'setColorCodeMechanism',
  reducer: (state, newColorCoding) => ({
    ...state,
    colorCode:
      newColorCoding === byServiceEndpointCombinationUrlIdentifier ? getColorByEndpoint : getColorByEndpointType
  }),
  getParsedUrlValues: ({ colorCode }) => ({
    colorCode: colorCode === byServiceEndpointCombinationUrlIdentifier ? getColorByEndpoint : getColorByEndpointType
  }),
  getSerializedUrlValues: ({ colorCode }) => ({
    colorCode:
      colorCode === getColorByEndpoint ? byServiceEndpointCombinationUrlIdentifier : byEndpointTypeUrlIdentifier
  })
})(TraceDetail);

function TraceDetail({ location, colorCode: getColor, navigator, filters, setColorCodeMechanism, dataSource }) {
  const traceId = getMatrixParameter(location, traceDetail, traceIdMatrixParameter);
  const props = {
    traceId,
    filters,
    getColor: args =>
      getColor({
        ...args,
        traceId
      }),
    setColorCodeMechanism,
    colorCodeType:
      getColor === getColorByEndpoint ? byServiceEndpointCombinationUrlIdentifier : byEndpointTypeUrlIdentifier
  };

  return (
    <>
      <Sticky
        header={
          <DashboardHeader
            {...props}
            icon={getIconByType(dataSource, 'application')}
            contextIcon="lib_analyze_inverted"
            renderContext={renderContext}
            label={getLabelByType(dataSource)}
            title="Analytics"
          />
        }
      >
        <AppNavigatorSplitScreen
          navigator={navigator}
          dataSource={filters.dataSource}
          traceDetail={
            <TabView
              HeaderComponent={Header}
              location={location}
              tabs={tabs}
              result$={getTraceSummary({ id: traceId })}
              props={props}
              withoutBreadcrumb
              withoutPadding
            />
          }
        />
      </Sticky>
    </>
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
    />
  );
}

function renderButtonLine({ traceId }) {
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

function renderContext({ filters }) {
  return (
    <Link className={locals.analyticsLink} href$={getLinkToAnalyze({ dataSource: filters.dataSource })}>
      Analytics
    </Link>
  );
}

function renderTimeSelection({ filters }) {
  return (
    <Link href$={getLinkToAnalyze({ dataSource: filters.dataSource })}>
      <Tooltip content="Close trace detail">
        <SvgIcon className={locals.closeIcon} aria-label="Close trace detail" type="lib_openclose_cancel" />
      </Tooltip>
    </Link>
  );
}
