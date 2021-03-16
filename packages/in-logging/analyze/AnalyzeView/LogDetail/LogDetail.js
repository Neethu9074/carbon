/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import SplitScreenLogItemContent from 'in-logging/analyze/AnalyzeView/components/SplitScreenLogItemContent';
import SplitScreenList from 'in-new-components/AnalyzeView/SplitScreenList/SplitScreenList';
import getTags from 'in-logging/analyze/AnalyzeView/LogDetail/tabs/index';
import TabView from 'in-new-components/LocationAwareTabView/TabView';
import { getIconByType } from 'in-analyze/AnalyzeView/dataSources';
import DashboardHeader from 'in-new-components/DashboardHeader';
import { formatDateTime } from 'in-services/formatters/date';
import getLog from 'in-logging/subscriptions/getLog';
import Button from 'in-new-components/Button';
import Tooltip from 'in-components/Tooltip';
import SvgIcon from 'in-components/SvgIcon';
import Sticky from 'in-components/Sticky';
import Link from 'in-components/Link';
import { t } from 'in-i18n';

import locals from './LogDetail.mless';

export default function LogDetail(props) {
  const { detailId } = props;

  return (
    <>
      <Sticky
        header={
          <DashboardHeader
            {...props}
            icon={getIconByType('logs', 'logs')}
            contextConfigurations={[{ renderContext, contextIcon: 'lib_analyze_inverted' }]}
            label={t('in-logging:log')}
            title={t('in-logging:log')}
            withBorderBottom
          />
        }
      >
        <SplitScreenList {...props} ListItemContent={SplitScreenLogItemContent}>
          <TabView
            props={props}
            HeaderComponent={Header}
            location={location}
            tabs={getTags(props)}
            result$={getLog({ id: detailId })}
            withoutBreadcrumb
            withoutPadding
          />
        </SplitScreenList>
      </Sticky>
    </>
  );
}

function Header(props) {
  const time = props.result?.data?.timestamp;
  return (
    <DashboardHeader
      {...props}
      title={t('in-logging:log')}
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
        {t('in-logging:download')}
      </Button>
    </>
  );
}

function renderContext({ getHrefToUngroupedView }) {
  return (
    <Link className={locals.analyticsLink} href={getHrefToUngroupedView()}>
      {t('in-logging:analytics')}
    </Link>
  );
}

function renderTimeSelection({ getHrefToUngroupedView }) {
  return (
    <Link href={getHrefToUngroupedView()}>
      <Tooltip content={t('in-logging:closeLogDetails')}>
        <SvgIcon
          className={locals.closeIcon}
          aria-label={t('in-logging:closeLogDetails')}
          type="lib_openclose_cancel"
        />
      </Tooltip>
    </Link>
  );
}
