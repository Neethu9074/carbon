import React from 'react';

import LogNavigatorSplitScreen from 'in-logging/analyze/AnalyzeView/LogDetail/components/LogNavigatorSplitScreen';
import LogsNavigator from 'in-logging/analyze/AnalyzeView/LogDetail/components/LogsNavigator';
import tabs from 'in-logging/analyze/AnalyzeView/LogDetail/tabs/index';
import TabView from 'in-new-components/LocationAwareTabView/TabView';
import { getIconByType } from 'in-analyze/AnalyzeView/dataSources';
import DashboardHeader from 'in-new-components/DashboardHeader';
import useCursorPagination from 'in-hooks/useCursorPagination';
import { formatDateTime } from 'in-services/formatters/date';
import getLogs from 'in-logging/subscriptions/getLogs';
import getLog from 'in-logging/subscriptions/getLog';
import useTimeConfig from 'in-hooks/useTimeConfig';
import Button from 'in-new-components/Button';
import Tooltip from 'in-components/Tooltip';
import SvgIcon from 'in-components/SvgIcon';
import Sticky from 'in-components/Sticky';
import Link from 'in-components/Link';

import locals from './LogDetail.mless';

export default function LogDetail(props) {
  const { detailId, orderBy, backendQueryModel } = props;

  const timeConfig = useTimeConfig();
  const tableProps = useCursorPagination(
    ({ cursor }) => getTableData({ timeConfig, backendQueryModel, orderBy, cursor }),
    [timeConfig, orderBy.by, orderBy.direction, backendQueryModel]
  );

  return (
    <>
      <Sticky
        header={
          <DashboardHeader
            {...props}
            {...tableProps}
            icon={getIconByType('logs', 'logs')}
            contextConfigurations={[{ renderContext, contextIcon: 'lib_analyze_inverted' }]}
            label="Log"
            title="Log"
          />
        }
      >
        <LogNavigatorSplitScreen
          {...props}
          {...tableProps}
          navigator={<LogsNavigator {...props} {...tableProps} />}
          logDetail={
            <TabView
              props={props}
              HeaderComponent={Header}
              location={location}
              tabs={tabs}
              result$={getLog({ id: detailId })}
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
  const time = props.result?.data?.timestamp;
  return (
    <DashboardHeader
      {...props}
      title="Log"
      icon={getIconByType('logs', 'logs')}
      label={`Log: ${time ? formatDateTime(time) : ''}`}
      renderButtonLine={renderButtonLine}
      renderTimeSelection={renderTimeSelection}
      hideUrlShortener
    />
  );
}

function renderButtonLine(props) {
  const logId = props.result?.data?.id;
  return (
    <>
      <Button
        icon="lib_actions_download"
        kind="secondary"
        target="_blank"
        href={logId && `/api/logging/log/${encodeURIComponent(logId)}?pretty`}
      >
        Download
      </Button>
    </>
  );
}

function renderContext({ getHrefToUngroupedView }) {
  return (
    <Link className={locals.analyticsLink} href={getHrefToUngroupedView()}>
      Analytics
    </Link>
  );
}

function renderTimeSelection({ getHrefToUngroupedView }) {
  return (
    <Link href={getHrefToUngroupedView()}>
      <Tooltip content="Close log details">
        <SvgIcon className={locals.closeIcon} aria-label="Close log details" type="lib_openclose_cancel" />
      </Tooltip>
    </Link>
  );
}

function getTableData({ timeConfig, backendQueryModel, orderBy, cursor }) {
  return getLogs({
    pagination: {
      cursor,
      retrievalSize: 20
    },
    order: orderBy,
    timeConfig: timeConfig,
    tagFilterExpression: backendQueryModel
  });
}
