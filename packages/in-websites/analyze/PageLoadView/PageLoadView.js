/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useEffect, useRef, useState } from 'react';
import { get } from 'lodash';

import { SvgIcon, Link, Button } from '@instana/components';
import { useObservable } from '@instana/hooks';
import { create } from '@instana/observables';

import {
  pageLoadIdUrlParameter,
  beaconIdUrlParameter,
  beaconTimestampUrlParameter
} from 'in-websites/navigation/urlParameters';
import SplitScreenPageLoadContent from 'in-websites/analyze/PageLoadView/SplitScreenPageLoadContent';
import getWebsiteBeaconsForPageLoad from 'in-websites/subscriptions/getWebsiteBeaconsForPageLoad';
import DashboardHeaderContext from 'in-components/DashboardHeader/DashboardHeaderContext';
import SplitScreenList from 'in-components/AnalyzeView/SplitScreenList/SplitScreenList';
import { getHighlighterId } from 'in-websites/analyze/PageLoadView/tabs/Summary/Beacon';
import { triggerHighlight } from 'in-components/SelectedElementHighlighter';
import TabView from 'in-components/LocationAwareTabView/TabView';
import { productAreas } from 'in-services/tracking/productAreas';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import { shorten, isNotBlank } from 'in-services/util/string';
import { hasError, isLoading } from 'in-services/util/result';
import { formatPathWithTU } from 'in-services/formatters/url';
import DashboardHeader from 'in-components/DashboardHeader';
import getTabs from 'in-websites/analyze/PageLoadView/tabs';
import { pageNames } from 'in-services/tracking/pageNames';
import { pendingResult } from 'in-services/fixedObjects';
import { dataSourceTitles } from 'in-websites/tags';
import useUrlState from 'in-hooks/useUrlState';
import Tooltip from 'in-components/Tooltip';
import { seconds } from 'in-services/time';
import Sticky from 'in-components/Sticky';
import { t } from 'in-i18n';

import locals from './PageLoadView.mless';

export default function PageLoadView(props) {
  const [urlState, onChange] = useUrlState({
    bind: [pageLoadIdUrlParameter, beaconIdUrlParameter, beaconTimestampUrlParameter]
  });

  const beaconType = props.dataSource;
  return (
    <>
      <ViewTrackingMeta
        data={{
          productArea: productAreas.websites_mobile_apps,
          pageRootName: pageNames.analytics
        }}
      />

      <Sticky
        header={
          <DashboardHeader
            {...urlState}
            {...props}
            onChange={onChange}
            title={t('in-websites:analyze.analyzeView.pageLoadView.labelAnalytics')}
            icon="lib_website"
            label={dataSourceTitles[beaconType]}
            contextConfigurations={[{ renderContext, contextIcon: 'lib_analyze_inverted' }]}
            withBorderBottom
          />
        }
      >
        <Content {...props} />
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

function Content(props) {
  const {
    detailId: { pageLoadId, beaconTimestamp, beaconId },
    getHrefToDetailId
  } = props;

  const result$ = useRetriableObservable({
    pageLoadId,
    beaconTimestamp,
    beaconId,
    retries: 3,
    retryDelay: seconds.toMillis(10)
  });

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
        result$={result$}
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

function useRetriableObservable({ pageLoadId, beaconTimestamp, beaconId, retries, retryDelay }) {
  const [result$, setResult$] = useState(create);
  const [retry, setRetry] = useState(0);

  const id = pageLoadId + beaconId;
  const lastIdRef = useRef(id);
  if (id !== lastIdRef.current) {
    lastIdRef.current = id;
    setResult$(create());
    setRetry(0);
  }

  const pageLoadResult =
    useObservable(getWebsiteBeaconsForPageLoadRetriable, [pageLoadId, beaconTimestamp, retry]) ?? pendingResult;

  useEffect(() => {
    const beaconDataMissing = isBeaconMissing(pageLoadResult, beaconId);
    const shouldRetry = beaconDataMissing && isAlmostNow(beaconTimestamp) && retry < retries;
    if (shouldRetry) {
      const timeoutId = setTimeout(() => setRetry(prev => prev + 1), retryDelay);
      return () => clearTimeout(timeoutId);
    }
    result$.emit(pageLoadResult);
  }, [retry, result$, pageLoadResult, beaconTimestamp, pageLoadId, beaconId, retries, retryDelay]);

  return result$;
}

function isAlmostNow(beaconTimestamp) {
  return beaconTimestamp && beaconTimestamp > Date.now() - seconds.toMillis(60);
}

function isBeaconMissing(pageLoadResult, beaconId) {
  return (
    hasError(pageLoadResult) ||
    (!isLoading(pageLoadResult) && beaconId && !pageLoadResult.data.some(beacon => beacon.beaconId === beaconId))
  );
}

function getWebsiteBeaconsForPageLoadRetriable([pageLoadId, beaconTimestamp, retry]) {
  return getWebsiteBeaconsForPageLoad({
    pageLoadId,
    // for retries, we have to modify the payload to bypass caching
    beaconTimestamp: beaconTimestamp + retry
  });
}

function calculateLabel(result) {
  if (!result || !result.data || result.data.length === 0) {
    return null;
  }

  const page = get(result, ['data', 0, 'page']);
  if (isNotBlank(page)) {
    const origin = get(result, ['data', 0, 'locationOrigin']);
    if (isNotBlank(origin)) {
      return t('in-websites:analyze.analyzeView.pageLoadView.pageLoadOnResource', { page, resource: origin });
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
      href={`${formatPathWithTU('/api/website-monitoring/page-load')};id=${encodeURIComponent(
        pageLoadId
      )};timestamp=${encodeURIComponent(beaconTimestamp)}?pretty`}
    >
      {t('in-websites:analyze.analyzeView.pageLoadView.buttonDownload')}
    </Button>
  );
}

function renderContext({ getHrefToUngroupedView }) {
  return (
    <DashboardHeaderContext
      href={getHrefToUngroupedView()}
      label={t('in-websites:analyze.analyzeView.pageLoadView.labelAnalytics')}
    />
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
