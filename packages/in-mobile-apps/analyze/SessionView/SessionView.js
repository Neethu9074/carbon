/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { get } from 'lodash';
import React from 'react';

import { Button, IconButton } from '@instana/components';

import {
  beaconIdUrlParameter,
  beaconTimestampUrlParameter,
  sessionIdUrlParameter
} from 'in-mobile-apps/navigation/urlParameters';
import getMobileAppBeaconsForSession from 'in-mobile-apps/subscriptions/getMobileAppBeaconsForSession';
import SplitScreenSessionContent from 'in-mobile-apps/analyze/SessionView/SplitScreenSessionContent';
import { getHighlighterId } from 'in-mobile-apps/analyze/SessionView/tabs/Summary/Beacon';
import DashboardHeaderContext from 'in-components/DashboardHeader/DashboardHeaderContext';
import SplitScreenList from 'in-components/AnalyzeView/SplitScreenList/SplitScreenList';
import { triggerHighlight } from 'in-components/SelectedElementHighlighter';
import { useCloseSessionViewLink } from 'in-mobile-apps/navigation/paths';
import TabView from 'in-components/LocationAwareTabView/TabView';
import { productAreas } from 'in-services/tracking/productAreas';
import Breadcrumbs from 'in-components/breadcrumb/Breadcrumbs';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import getTabs from 'in-mobile-apps/analyze/SessionView/tabs';
import { formatPathWithTU } from 'in-services/formatters/url';
import Breadcrumb from 'in-components/breadcrumb/Breadcrumb';
import DashboardHeader from 'in-components/DashboardHeader';
import { pageNames } from 'in-services/tracking/pageNames';
import { dataSourceTitles } from 'in-mobile-apps/tags';
import { shorten } from 'in-services/util/string';
import useUrlState from 'in-hooks/useUrlState';
import Tooltip from 'in-components/Tooltip';
import Sticky from 'in-components/Sticky';
import { t } from 'in-i18n';

import locals from './SessionView.mless';

export default function SessionView(props) {
  const urlStateConfig = { bind: [sessionIdUrlParameter, beaconIdUrlParameter, beaconTimestampUrlParameter] };
  const [{ sessionId, beaconId, beaconTimestamp }, onChange] = useUrlState(urlStateConfig);
  const content = renderSplitScreenContent({ sessionId, beaconId, beaconTimestamp, onChange, ...props });
  const beaconType = props.dataSource;

  return (
    <>
      <ViewTrackingMeta
        data={{
          productArea: productAreas.websites_mobile_apps,
          pageRootName: pageNames.mobile_app_session_start
        }}
      />

      <Sticky
        header={
          <DashboardHeader
            {...props}
            onChange={onChange}
            sessionId={sessionId}
            beaconId={beaconId}
            beaconTimestamp={beaconTimestamp}
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
  const closeSessionViewHref = useCloseSessionViewLink();

  return (
    <>
      <Breadcrumbs
        items={[
          <Breadcrumb
            label={t('in-mobile-apps:sessionView.analyticsBreadscrumbLabel', {
              prefix: dataSourceTitles[props.beaconType]
            })}
            href={closeSessionViewHref}
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
    <DashboardHeaderContext href={getHrefToUngroupedView()} label={t('in-mobile-apps:sessionView.analyticsLink')} />
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
      href={`${formatPathWithTU('/api/mobile-app-monitoring/session')};id=${encodeURIComponent(
        sessionId
      )};timestamp=${encodeURIComponent(beaconTimestamp)}?pretty`}
    >
      {t('in-mobile-apps:sessionView.downloadBtn')}
    </Button>
  );
}

function renderTimeSelection({ getHrefToUngroupedView }) {
  return (
    <Tooltip content={t('in-mobile-apps:sessionView.closeSessionDetailsTooltip')}>
      <IconButton
        href={getHrefToUngroupedView()}
        kind="action"
        aria-label={t('in-mobile-apps:sessionView.closeSessionDetailsArialabel')}
        type="lib_openclose_cancel"
      />
    </Tooltip>
  );
}
