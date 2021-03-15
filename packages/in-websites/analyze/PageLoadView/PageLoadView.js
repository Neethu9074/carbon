/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { get, findIndex } from 'lodash';
import React from 'react';

import {
  pageLoadIdUrlParameter,
  beaconIdUrlParameter,
  beaconTimestampUrlParameter
} from 'in-websites/navigation/urlParameters';
import NavigatorSplitScreen from 'in-analyze/TraceDetail/components/NavigatorSplitScreen/NavigatorSplitScreen';
import SplitScreenPageLoadContent from 'in-websites/analyze/PageLoadView/SplitScreenPageLoadContent';
import getWebsiteBeaconsForPageLoad from 'in-websites/subscriptions/getWebsiteBeaconsForPageLoad';
import SplitScreenList from 'in-new-components/AnalyzeView/SplitScreenList/SplitScreenList';
import BeaconsNavigator from 'in-websites/analyze/AnalyzeView/Beacons/BeaconsNavigator';
import { getHighlighterId } from 'in-websites/analyze/PageLoadView/tabs/Summary/Beacon';
import { triggerHighlight } from 'in-new-components/SelectedElementHighlighter';
import { webMobileQb2AnalyzeEnabled } from 'in-services/featureFlags';
import { closePageLoadViewLink } from 'in-websites/navigation/paths';
import TabView from 'in-new-components/LocationAwareTabView/TabView';
import ViewTrackingMeta from 'in-services/tracking/ViewTrackingMeta';
import DashboardHeader from 'in-new-components/DashboardHeader';
import { shorten, isNotBlank } from 'in-services/util/string';
import getTabs from 'in-websites/analyze/PageLoadView/tabs';
import { dataSourceTitles } from 'in-websites/tags';
import withUrlState from 'in-hoc/withUrlState';
import Button from 'in-new-components/Button';
import SvgIcon from 'in-components/SvgIcon';
import Tooltip from 'in-components/Tooltip';
import Sticky from 'in-components/Sticky';
import Link from 'in-components/Link';
import { t } from 'in-i18n';

import locals from './PageLoadView.mless';

export default withUrlState({
  bind: [pageLoadIdUrlParameter, beaconIdUrlParameter, beaconTimestampUrlParameter],
  reducerName: 'onChange'
})(PageLoadView);

function PageLoadView(props) {
  const content = webMobileQb2AnalyzeEnabled ? renderSplitScreenContent_v2(props) : renderSplitScreenContent(props);
  const beaconType = webMobileQb2AnalyzeEnabled ? props.dataSource : props.beaconType;
  return (
    <>
      <ViewTrackingMeta
        data={{
          productArea: 'EUM: Websites',
          pageRootName: 'Analytics'
        }}
      />

      <Sticky
        header={
          <DashboardHeader
            {...props}
            title={t('in-websites:analyze.analyzeView.pageLoadView.labelAnalytics')}
            icon="lib_website"
            label={dataSourceTitles[beaconType]}
            contextConfigurations={[{ renderContext, contextIcon: 'lib_analyze_inverted' }]}
            withBorderBottom
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
    <DashboardHeader
      {...props}
      title={t('in-websites:analyze.analyzeView.pageLoadView.titlePageLoad')}
      icon="lib_website"
      label={props.pageLoadLabel}
      renderButtonLine={renderButtonLine}
      renderTimeSelection={renderTimeSelection}
      hideUrlShortener
    />
  );
}

function renderSplitScreenContent_v2(props) {
  const {
    detailId: { pageLoadId, beaconTimestamp },
    getHrefToDetailId
  } = props;
  return (
    <SplitScreenList
      {...props}
      ListItemContent={SplitScreenPageLoadContent}
      getHrefToDetailId={getHrefToDetailId}
      isPageLoadView
      onOpenItem={item => {
        const { type, beaconId } = item.beacon;
        if (type !== 'pageLoad') {
          triggerHighlight(getHighlighterId(beaconId));
        }
      }}
    >
      <TabView
        key={pageLoadId}
        props={props}
        HeaderComponent={Header}
        location={location}
        // Todo: use path from props?
        tabs={getTabs({ path: '/websiteMonitoring/analyzeBeacons' })}
        result$={getWebsiteBeaconsForPageLoad({ pageLoadId, beaconTimestamp })}
        withoutBreadcrumb
        withoutPadding
        withProps={({ result }) => ({
          beacons: result.data,
          pageLoadLabel: shorten(calculateLabel(result))
        })}
      />
    </SplitScreenList>
  );
}

function renderSplitScreenContent(props) {
  const { items, onChange, beaconTimestamp, beaconType, pageLoadId, beaconId } = props;
  return (
    <NavigatorSplitScreen
      {...props}
      navigator={<BeaconsNavigator {...props} beaconId={beaconId} />}
      typeLabel={dataSourceTitles[beaconType]}
      openItemIndex={findIndex(items, item => item.beacon.beaconId === beaconId)}
      openItem={e => {
        if (e.beacon.type !== 'pageLoad') {
          triggerHighlight(getHighlighterId(e.beacon.beaconId));
        }
        onChange({
          pageLoadId: e.beacon.pageLoadId,
          beaconId: e.beacon.beaconId
        });
      }}
    >
      <TabView
        // Discard all state when the page load ID changes
        key={pageLoadId}
        HeaderComponent={Header}
        location={location}
        tabs={getTabs(props)}
        result$={getWebsiteBeaconsForPageLoad({ pageLoadId, beaconTimestamp })}
        withProps={({ result }) => ({
          beacons: result.data,
          pageLoadLabel: shorten(calculateLabel(result))
        })}
        props={props}
        withoutBreadcrumb
        withoutPadding
      />
    </NavigatorSplitScreen>
  );
}

function calculateLabel(result) {
  if (!result || !result.data || result.data.length === 0) {
    return null;
  }

  const page = get(result, ['data', 0, 'page']);
  if (isNotBlank(page)) {
    const origin = get(result, ['data', 0, 'locationOrigin']);
    if (isNotBlank(origin)) {
      return `${page} on ${origin}`;
    }
    return page;
  } else {
    return get(result, ['data', 0, 'locationUrl']);
  }
}

function renderButtonLine(props) {
  const { pageLoadLabel } = props;
  const { pageLoadId, beaconTimestamp } = webMobileQb2AnalyzeEnabled ? props.detailId : props;
  if (!pageLoadLabel) {
    return null;
  }

  return (
    <Button
      icon="lib_actions_download"
      kind="secondary"
      target="_blank"
      href={`/api/website-monitoring/page-load;id=${encodeURIComponent(pageLoadId)};timestamp=${encodeURIComponent(
        beaconTimestamp
      )}?pretty`}
    >
      {t('in-websites:analyze.analyzeView.pageLoadView.buttonDownload')}
    </Button>
  );
}

function renderContext({ getHrefToUngroupedView }) {
  if (!webMobileQb2AnalyzeEnabled) {
    return (
      <Link className={locals.analyticsLink} href$={closePageLoadViewLink}>
        {t('in-websites:analyze.analyzeView.pageLoadView.labelAnalytics')}
      </Link>
    );
  }
  return (
    <Link className={locals.analyticsLink} href={getHrefToUngroupedView()}>
      {t('in-websites:analyze.analyzeView.pageLoadView.labelAnalytics')}
    </Link>
  );
}

function renderTimeSelection({ getHrefToUngroupedView }) {
  if (!webMobileQb2AnalyzeEnabled) {
    return (
      <Link href$={closePageLoadViewLink}>
        <Tooltip content="Close page load details">
          <SvgIcon className={locals.closeIcon} aria-label="Close page load details" type="lib_openclose_cancel" />
        </Tooltip>
      </Link>
    );
  }
  return (
    <Link href={getHrefToUngroupedView()}>
      <Tooltip content={t('in-websites:analyze.analyzeView.pageLoadView.renderTimeSelectionTooltip')}>
        <SvgIcon
          className={locals.closeIcon}
          aria-label={t('in-websites:analyze.analyzeView.pageLoadView.renderTimeSelectionTooltip')}
          type="lib_openclose_cancel"
        />
      </Tooltip>
    </Link>
  );
}
