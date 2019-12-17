import { get, findIndex } from 'lodash';
import React from 'react';

import {
  sessionIdUrlParameter,
  beaconIdUrlParameter,
  beaconTimestampUrlParameter
} from 'in-mobile-apps/navigation/urlParameters';
import NavigatorSplitScreen from 'in-analyze/TraceDetail/components/NavigatorSplitScreen/NavigatorSplitScreen';
import getMobileAppBeaconsForSession from 'in-mobile-apps/subscriptions/getMobileAppBeaconsForSession';
import BeaconsNavigator from 'in-mobile-apps/analyze/AnalyzeView/Beacons/BeaconsNavigator';
import { getHighlighterId } from 'in-mobile-apps/analyze/SessionView/tabs/Summary/Beacon';
import { triggerHighlight } from 'in-new-components/SelectedElementHighlighter';
import BreadcrumbHeader from 'in-components/breadcrumb/BreadcrumbHeader';
import { closeSessionViewLink } from 'in-mobile-apps/navigation/paths';
import TabView from 'in-new-components/LocationAwareTabView/TabView';
import DashboardHeader from 'in-new-components/DashboardHeader';
import Breadcrumbs from 'in-components/breadcrumb/Breadcrumbs';
import { shorten, isNotBlank } from 'in-services/util/string';
import Breadcrumb from 'in-components/breadcrumb/Breadcrumb';
import tabs from 'in-mobile-apps/analyze/SessionView/tabs';
import { dataSourceTitles } from 'in-mobile-apps/tags';
import withUrlState from 'in-hoc/withUrlState';
import Button from 'in-new-components/Button';
import SvgIcon from 'in-components/SvgIcon';
import Tooltip from 'in-components/Tooltip';
import Sticky from 'in-components/Sticky';
import Link from 'in-components/Link';

import locals from './SessionView.mless';

export default withUrlState({
  bind: [sessionIdUrlParameter, beaconIdUrlParameter, beaconTimestampUrlParameter],
  reducerName: 'onChange',
  reduceAndGetAsUrlName: 'getChangeAsUrl'
})(SessionView);

function SessionView(props) {
  const { sessionId, items, beaconType, onChange, beaconTimestamp } = props;
  const beaconId = props.beaconId || sessionId;
  return (
    <>
      <Sticky header={<BreadcrumbHeader />}>
        <NavigatorSplitScreen
          {...props}
          navigator={<BeaconsNavigator {...props} beaconId={beaconId} />}
          typeLabel={dataSourceTitles[beaconType]}
          openItemIndex={findIndex(items, item => item.beacon.beaconId === beaconId)}
          openItem={e => {
            triggerHighlight(getHighlighterId(e.beacon.beaconId));
            onChange({
              sessionId: e.beacon.sessionId,
              beaconId: e.beacon.beaconId
            });
          }}
        >
          <TabView
            // Discard all state when the session ID changes
            key={sessionId}
            HeaderComponent={Header}
            location={location}
            tabs={tabs}
            result$={getMobileAppBeaconsForSession({ sessionId, beaconTimestamp })}
            withProps={({ result }) => ({
              beacons: result.data,
              sessionLabel: shorten(calculateLabel(result))
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
    <>
      <Breadcrumbs
        items={[
          <Breadcrumb label={`${dataSourceTitles[props.beaconType]} Analytics`} href$={closeSessionViewLink} />,
          props.sessionLabel && <Breadcrumb label="Session">{shorten(props.sessionLabel, 32)}</Breadcrumb>
        ].filter(Boolean)}
      />
      <DashboardHeader
        {...props}
        title="Session"
        icon="lib_mobile_app"
        label={props.sessionLabel}
        renderButtonLine={renderButtonLine}
      />
      <div className={locals.tabViewPlaceholder} />
    </>
  );
}

function calculateLabel(result) {
  if (!result || !result.data || result.data.length === 0) {
    return null;
  }

  const view = get(result, ['data', 0, 'view']);
  if (isNotBlank(view)) {
    return view;
  } else {
    return get(result, ['data', 0, 'platform']);
  }
}

function renderButtonLine({ sessionId, beaconTimestamp, beacons }) {
  return (
    <>
      {beacons &&
        beacons.length > 0 && (
          <Button
            icon="lib_actions_download"
            kind="secondary"
            target="_blank"
            href={`/api/mobile-app-monitoring/session;id=${encodeURIComponent(
              sessionId
            )};timestamp=${encodeURIComponent(beaconTimestamp)}?pretty`}
          >
            Download
          </Button>
        )}

      <Link href$={closeSessionViewLink}>
        <Tooltip content="Close session details">
          <SvgIcon className={locals.closeIcon} aria-label="Close session details" type="lib_openclose_cancel" />
        </Tooltip>
      </Link>
    </>
  );
}
