import { get, findIndex } from 'lodash';
import React from 'react';

import {
  pageLoadIdUrlParameter,
  beaconIdUrlParameter,
  beaconTimestampUrlParameter
} from 'in-websites/navigation/urlParameters';
import NavigatorSplitScreen from 'in-analyze/TraceDetail/components/NavigatorSplitScreen/NavigatorSplitScreen';
import getWebsiteBeaconsForPageLoad from 'in-websites/subscriptions/getWebsiteBeaconsForPageLoad';
import BeaconsNavigator from 'in-websites/analyze/AnalyzeView/Beacons/BeaconsNavigator';
import { getHighlighterId } from 'in-websites/analyze/PageLoadView/tabs/Summary/Beacon';
import { triggerHighlight } from 'in-new-components/SelectedElementHighlighter';
import { closePageLoadViewLink } from 'in-websites/navigation/paths';
import TabView from 'in-new-components/LocationAwareTabView/TabView';
import ViewTrackingMeta from 'in-services/tracking/ViewTrackingMeta';
import DashboardHeader from 'in-new-components/DashboardHeader';
import { shorten, isNotBlank } from 'in-services/util/string';
import tabs from 'in-websites/analyze/PageLoadView/tabs';
import { dataSourceTitles } from 'in-websites/tags';
import withUrlState from 'in-hoc/withUrlState';
import Button from 'in-new-components/Button';
import SvgIcon from 'in-components/SvgIcon';
import Tooltip from 'in-components/Tooltip';
import Sticky from 'in-components/Sticky';
import Link from 'in-components/Link';

import locals from './PageLoadView.mless';

export default withUrlState({
  bind: [pageLoadIdUrlParameter, beaconIdUrlParameter, beaconTimestampUrlParameter],
  reducerName: 'onChange'
})(PageLoadView);

function PageLoadView(props) {
  const { pageLoadId, items, beaconType, onChange, beaconTimestamp } = props;
  const beaconId = props.beaconId || pageLoadId;
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
            className={locals.header}
            title="Analytics"
            icon="lib_website"
            label={dataSourceTitles[beaconType]}
            contextConfigurations={[{ renderContext, contextIcon: 'lib_analyze_inverted' }]}
          />
        }
      >
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
            tabs={tabs}
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
      </Sticky>
    </>
  );
}

function Header(props) {
  return (
    <DashboardHeader
      {...props}
      title="Page Load"
      icon="lib_website"
      label={props.pageLoadLabel}
      renderButtonLine={renderButtonLine}
      renderTimeSelection={renderTimeSelection}
      hideUrlShortener
    />
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

function renderButtonLine({ pageLoadId, beaconTimestamp, pageLoadLabel }) {
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
      Download
    </Button>
  );
}

function renderContext() {
  return (
    <Link className={locals.analyticsLink} href$={closePageLoadViewLink}>
      Analytics
    </Link>
  );
}

function renderTimeSelection() {
  return (
    <Link href$={closePageLoadViewLink}>
      <Tooltip content="Close page load details">
        <SvgIcon className={locals.closeIcon} aria-label="Close page load details" type="lib_openclose_cancel" />
      </Tooltip>
    </Link>
  );
}
