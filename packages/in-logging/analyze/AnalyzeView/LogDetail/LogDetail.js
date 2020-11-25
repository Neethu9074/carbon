import React from 'react';

import LogNavigatorSplitScreen from 'in-logging/analyze/AnalyzeView/LogDetail/components/LogNavigatorSplitScreen';
import LogsNavigator from 'in-logging/analyze/AnalyzeView/LogDetail/components/LogsNavigator';
import tabs from 'in-logging/analyze/AnalyzeView/LogDetail/tabs/index';
import TabView from 'in-new-components/LocationAwareTabView/TabView';
import { getIconByType } from 'in-analyze/AnalyzeView/dataSources';
import DashboardHeader from 'in-new-components/DashboardHeader';
import useCursorPagination from 'in-hooks/useCursorPagination';
import { getLinkToAnalyze } from 'in-logging/navigation/paths';
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
  const { logId, orderBy, backendQueryModel, hash } = props;

  const timeConfig = useTimeConfig();
  const tableProps = useCursorPagination(
    ({ cursor }) => getTableData({ timeConfig, backendQueryModel, orderBy, cursor }),
    [timeConfig, orderBy.by, orderBy.direction, hash]
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
              result$={getLog({ id: logId })}
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
      title="Log"
      icon={getIconByType('logs', 'logs')}
      label="Log details"
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

function renderContext() {
  return (
    <Link className={locals.analyticsLink} href$={getLinkToAnalyze()}>
      Analyse logs
    </Link>
  );
}

function renderTimeSelection() {
  return (
    <Link href$={getLinkToAnalyze()}>
      <Tooltip content="Close foobar trace detail">
        <SvgIcon className={locals.closeIcon} aria-label="Close trace detail" type="lib_openclose_cancel" />
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
