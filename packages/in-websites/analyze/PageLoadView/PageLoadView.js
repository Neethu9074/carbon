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
  pageLoadIdUrlParameter,
  beaconIdUrlParameter,
  beaconTimestampUrlParameter
} from 'in-websites/navigation/urlParameters';
import SplitScreenPageLoadContent from 'in-websites/analyze/PageLoadView/SplitScreenPageLoadContent';
import getWebsiteBeaconsForPageLoad from 'in-websites/subscriptions/getWebsiteBeaconsForPageLoad';
import SplitScreenList from 'in-components/AnalyzeView/SplitScreenList/SplitScreenList';
import { getHighlighterId } from 'in-websites/analyze/PageLoadView/tabs/Summary/Beacon';
import { triggerHighlight } from 'in-components/SelectedElementHighlighter';
import TabView from 'in-components/LocationAwareTabView/TabView';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import { shorten, isNotBlank } from 'in-services/util/string';
import DashboardHeader from 'in-components/DashboardHeader';
import getTabs from 'in-websites/analyze/PageLoadView/tabs';
import { dataSourceTitles } from 'in-websites/tags';
import withUrlState from 'in-hoc/withUrlState';
import Tooltip from 'in-components/Tooltip';
import Sticky from 'in-components/Sticky';
import { t } from 'in-i18n';

import locals from './PageLoadView.mless';

export default withUrlState({
  bind: [pageLoadIdUrlParameter, beaconIdUrlParameter, beaconTimestampUrlParameter],
  reducerName: 'onChange'
})(PageLoadView);

function PageLoadView(props) {
  const content = renderSplitScreenContent_v2(props);
  const beaconType = props.dataSource;
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
  const { pageLoadId, beaconTimestamp } = props.detailId;
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
  return (
    <Link className={locals.analyticsLink} href={getHrefToUngroupedView()}>
      {t('in-websites:analyze.analyzeView.pageLoadView.labelAnalytics')}
    </Link>
  );
}

function renderTimeSelection({ getHrefToUngroupedView }) {
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
