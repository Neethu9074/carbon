import React, { Fragment } from 'react';
import { get, findIndex } from 'lodash';

import {
  pageLoadIdUrlParameter,
  beaconIdUrlParameter,
  beaconTimestampUrlParameter
} from 'in-websites/navigation/urlParameters';
import NavigatorSplitScreen from 'in-analyze/TraceDetail/components/NavigatorSplitScreen/NavigatorSplitScreen';
import getWebsiteBeaconsForPageLoad from 'in-subscription/websiteMonitoring/getWebsiteBeaconsForPageLoad';
import BeaconsNavigator from 'in-websites/analyze/AnalyzeView/Beacons/BeaconsNavigator';
import { getHighlighterId } from 'in-websites/analyze/PageLoadView/tabs/Summary/Beacon';
import { triggerHighlight } from 'in-new-components/SelectedElementHighlighter';
import Breadcrumbs from 'in-sdk/components/dashboard/breadcrumb/Breadcrumbs';
import BasicDashboardHeader from 'in-new-components/BasicDashboardHeader';
import BreadcrumbHeader from 'in-components/breadcrumb/BreadcrumbHeader';
import { closePageLoadViewLink } from 'in-websites/navigation/paths';
import TabView from 'in-new-components/LocationAwareTabView/TabView';
import { shorten, isNotBlank } from 'in-services/util/string';
import Breadcrumb from 'in-components/breadcrumb/Breadcrumb';
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
  reducerName: 'onChange',
  reduceAndGetAsUrlName: 'getChangeAsUrl'
})(PageLoadView);

function PageLoadView(props) {
  const { pageLoadId, items, beaconType, onChange, beaconTimestamp } = props;
  const beaconId = props.beaconId || pageLoadId;
  return (
    <Fragment>
      <Sticky header={<BreadcrumbHeader useFullAvailableWidth />}>
        <NavigatorSplitScreen
          {...props}
          navigator={<BeaconsNavigator {...props} beaconId={beaconId} />}
          typeLabel={dataSourceTitles[beaconType]}
          openItemIndex={findIndex(items, item => item.beacon.beaconId === beaconId)}
          openItem={e => {
            triggerHighlight(getHighlighterId(e.beacon.beaconId));
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
            useFullAvailableWidth
            withoutPadding
          />
        </NavigatorSplitScreen>
      </Sticky>
    </Fragment>
  );
}

function Header(props) {
  return (
    <Fragment>
      <Breadcrumbs
        items={[
          <Breadcrumb label={`Analyze ${dataSourceTitles[props.beaconType]}s`} href$={closePageLoadViewLink} />,
          props.pageLoadLabel && <Breadcrumb label="Page View">{shorten(props.pageLoadLabel, 32)}</Breadcrumb>
        ].filter(Boolean)}
      />
      <BasicDashboardHeader
        title="Page View"
        icon="lib_website"
        renderActions={Actions}
        getLabel={getLabelForHeader}
        {...props}
      />
      <div className={locals.tabViewPlaceholder} />
    </Fragment>
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

function getLabelForHeader(result, { pageLoadLabel }) {
  return pageLoadLabel;
}

function Actions({ pageLoadId, beaconTimestamp, pageLoadLabel }) {
  return (
    <Fragment>
      {pageLoadLabel && (
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
      )}

      <Link href$={closePageLoadViewLink}>
        <Tooltip content="Close page view details">
          <SvgIcon
            className={locals.closeIcon}
            aria-label="Close page view details"
            type="lib_openclose_cancel"
            width={24}
            height={24}
          />
        </Tooltip>
      </Link>
    </Fragment>
  );
}
