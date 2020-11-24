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
import { closeSessionViewLink } from 'in-mobile-apps/navigation/paths';
import ViewTrackingMeta from 'in-services/tracking/ViewTrackingMeta';
import TabView from 'in-new-components/LocationAwareTabView/TabView';
import DashboardHeader from 'in-new-components/DashboardHeader';
import Breadcrumbs from 'in-components/breadcrumb/Breadcrumbs';
import Breadcrumb from 'in-components/breadcrumb/Breadcrumb';
import tabs from 'in-mobile-apps/analyze/SessionView/tabs';
import { dataSourceTitles } from 'in-mobile-apps/tags';
import { shorten } from 'in-services/util/string';
import withUrlState from 'in-hoc/withUrlState';
import Button from 'in-new-components/Button';
import SvgIcon from 'in-components/SvgIcon';
import Tooltip from 'in-components/Tooltip';
import Sticky from 'in-components/Sticky';
import Link from 'in-components/Link';

import locals from './SessionView.mless';

export default withUrlState({
  bind: [sessionIdUrlParameter, beaconIdUrlParameter, beaconTimestampUrlParameter],
  reducerName: 'onChange'
})(SessionView);

function SessionView(props) {
  const { sessionId, items, beaconType, onChange, beaconTimestamp } = props;
  const beaconId = props.beaconId || sessionId;
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
            title="Analytics"
            icon="lib_mobile_app"
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
            if (e.beacon.type !== 'sessionStart') {
              triggerHighlight(getHighlighterId(e.beacon.beaconId));
            }
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
        renderTimeSelection={renderTimeSelection}
        hideUrlShortener
      />
    </>
  );
}

function renderContext() {
  return (
    <Link className={locals.analyticsLink} href$={closeSessionViewLink}>
      Analytics
    </Link>
  );
}

function calculateLabel(result) {
  return get(result, ['data', 0, 'sessionId'], null);
}

function renderButtonLine({ sessionId, sessionLabel, beaconTimestamp }) {
  if (!sessionLabel) {
    return null;
  }
  return (
    <Button
      icon="lib_actions_download"
      kind="secondary"
      target="_blank"
      href={`/api/mobile-app-monitoring/session;id=${encodeURIComponent(sessionId)};timestamp=${encodeURIComponent(
        beaconTimestamp
      )}?pretty`}
    >
      Download
    </Button>
  );
}

function renderTimeSelection() {
  return (
    <Link href$={closeSessionViewLink}>
      <Tooltip content="Close session details">
        <SvgIcon className={locals.closeIcon} aria-label="Close session details" type="lib_openclose_cancel" />
      </Tooltip>
    </Link>
  );
}
