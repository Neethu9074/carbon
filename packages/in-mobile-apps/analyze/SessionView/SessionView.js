/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { get } from 'lodash';
import React from 'react';

import { SvgIcon } from '@instana/components';
import { Button } from '@instana/components';
import { Link } from '@instana/components';

import {
  sessionIdUrlParameter,
  beaconIdUrlParameter,
  beaconTimestampUrlParameter
} from 'in-mobile-apps/navigation/urlParameters';
import getMobileAppBeaconsForSession from 'in-mobile-apps/subscriptions/getMobileAppBeaconsForSession';
import SplitScreenSessionContent from 'in-mobile-apps/analyze/SessionView/SplitScreenSessionContent';
import { getHighlighterId } from 'in-mobile-apps/analyze/SessionView/tabs/Summary/Beacon';
import SplitScreenList from 'in-components/AnalyzeView/SplitScreenList/SplitScreenList';
import { triggerHighlight } from 'in-components/SelectedElementHighlighter';
import { closeSessionViewLink } from 'in-mobile-apps/navigation/paths';
import ViewTrackingMeta from 'in-services/tracking/ViewTrackingMeta';
import TabView from 'in-components/LocationAwareTabView/TabView';
import Breadcrumbs from 'in-components/breadcrumb/Breadcrumbs';
import getTabs from 'in-mobile-apps/analyze/SessionView/tabs';
import Breadcrumb from 'in-components/breadcrumb/Breadcrumb';
import DashboardHeader from 'in-components/DashboardHeader';
import { dataSourceTitles } from 'in-mobile-apps/tags';
import { shorten } from 'in-services/util/string';
import withUrlState from 'in-hoc/withUrlState';
import Tooltip from 'in-components/Tooltip';
import Sticky from 'in-components/Sticky';
import { t } from 'in-i18n';

import locals from './SessionView.mless';

export default withUrlState({
  bind: [sessionIdUrlParameter, beaconIdUrlParameter, beaconTimestampUrlParameter],
  reducerName: 'onChange'
})(SessionView);

function SessionView(props) {
  const content = renderSplitScreenContent(props);
  const beaconType = props.dataSource;
  return (
    <>
      <ViewTrackingMeta
        data={{
          productArea: 'EUM: Mobile Apps',
          pageRootName: 'Analytics'
        }}
      />

      <Sticky
        header={
          <DashboardHeader
            {...props}
            className={locals.header}
            title={t('in-mobile-apps:sessionView.analyticsTitle')}
            icon="lib_mobile_app"
            label={dataSourceTitles[beaconType]}
            contextConfigurations={[{ renderContext, contextIcon: 'lib_analyze_inverted' }]}
          />
        }
      >
        {content}
      </Sticky>
    </>
  );
}

function Header(props) {
  return (
    <>
      <Breadcrumbs
        items={[
          <Breadcrumb
            label={t('in-mobile-apps:sessionView.analyticsBreadscrumbLabel', {
              prefix: dataSourceTitles[props.beaconType]
            })}
            href$={closeSessionViewLink}
          />,
          props.sessionLabel && (
            <Breadcrumb label={t('in-mobile-apps:sessionView.sessionBreadscrumbLabel')}>
              {shorten(props.sessionLabel, 32)}
            </Breadcrumb>
          )
        ].filter(Boolean)}
      />
      <DashboardHeader
        {...props}
        title={t('in-mobile-apps:sessionView.sessionTitle')}
        icon="lib_mobile_app"
        label={props.sessionLabel}
        renderButtonLine={renderButtonLine}
        renderTimeSelection={renderTimeSelection}
        hideUrlShortener
      />
    </>
  );
}

function renderSplitScreenContent(props) {
  const {
    detailId: { sessionId, beaconTimestamp },
    getHrefToDetailId
  } = props;
  return (
    <SplitScreenList
      {...props}
      ListItemContent={SplitScreenSessionContent}
      getHrefToDetailId={getHrefToDetailId}
      isPageLoadView
      onOpenItem={item => {
        const { type, beaconId } = item.beacon;
        if (type !== 'sessionStart') {
          triggerHighlight(getHighlighterId(beaconId));
        }
      }}
    >
      <TabView
        key={sessionId}
        props={props}
        HeaderComponent={Header}
        location={location}
        tabs={getTabs({ path: '/mobileAppMonitoring/analyzeBeacons' })}
        result$={getMobileAppBeaconsForSession({ sessionId, beaconTimestamp })}
        withoutBreadcrumb
        withoutPadding
        withProps={({ result }) => ({
          beacons: result.data,
          sessionLabel: shorten(calculateLabel(result))
        })}
      />
    </SplitScreenList>
  );
}

function renderContext({ getHrefToUngroupedView }) {
  return (
    <Link className={locals.analyticsLink} href={getHrefToUngroupedView()}>
      {t('in-mobile-apps:sessionView.analyticsLink')}
    </Link>
  );
}

function calculateLabel(result) {
  return get(result, ['data', 0, 'sessionId'], null);
}

function renderButtonLine({ sessionLabel, detailId, sessionId, beaconTimestamp }) {
  if (!sessionLabel) {
    return null;
  }
  // In UA2 'sessionId' are 'beaconTimestamp' are nested inside of 'detailId'
  ({ sessionId, beaconTimestamp } = detailId ?? { sessionId, beaconTimestamp });
  return (
    <Button
      icon="lib_actions_download"
      kind="secondary"
      target="_blank"
      href={`/api/mobile-app-monitoring/session;id=${encodeURIComponent(sessionId)};timestamp=${encodeURIComponent(
        beaconTimestamp
      )}?pretty`}
    >
      {t('in-mobile-apps:sessionView.downloadBtn')}
    </Button>
  );
}

function renderTimeSelection() {
  return (
    <Link href$={closeSessionViewLink}>
      <Tooltip content={t('in-mobile-apps:sessionView.closeSessionDetailsTooltip')}>
        <SvgIcon
          className={locals.closeIcon}
          aria-label={t('in-mobile-apps:sessionView.closeSessionDetailsArialabel')}
          type="lib_openclose_cancel"
        />
      </Tooltip>
    </Link>
  );
}
