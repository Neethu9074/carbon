/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { withState } from 'recompose';
import React from 'react';

import HeaderToggleIcon from 'in-mobile-apps/analyze/SessionView/tabs/Summary/Beacon/components/HeaderToggleIcon';
import { toInteractiveElement } from 'in-new-components/interactiveCustomElement';
import Beacon from 'in-mobile-apps/analyze/SessionView/tabs/Summary/Beacon';
import SvgIcon from 'in-components/SvgIcon';
import Link from 'in-components/Link';

import locals from './BeaconViewGroup.mless';

export default withState('expanded', 'setExpanded', true)(BeaconViewGroup);

function BeaconViewGroup({ view, beacons, earliestTimestamp, sessionStart, expanded, setExpanded }) {
  return (
    <div className={locals.group}>
      <div
        className={locals.header}
        {...toInteractiveElement({
          ariaLabel: expanded ? 'Show less' : 'Show more',
          onDefaultInteraction: () => setExpanded(!expanded)
        })}
      >
        <div className={locals.left}>
          <SvgIcon type="lib_mobile_app_view" size="s" className={locals.viewIcon} />
          <span className={locals.viewName}>{view || 'View name not set'}</span>

          {!view && (
            <Link
              external
              href="https://instana.com/docs/mobile_app_monitoring/ios_api/#views"
              className={locals.learnHow}
            >
              Learn how to define views
            </Link>
          )}
        </div>

        <HeaderToggleIcon expanded={expanded} setExpanded={setExpanded} />
      </div>

      {expanded && (
        <div className={locals.beacons}>
          {beacons.map(beacon => (
            <Beacon
              beacon={beacon}
              sessionStart={sessionStart}
              earliestTimestamp={earliestTimestamp}
              key={beacon.beaconId}
            />
          ))}
        </div>
      )}
    </div>
  );
}
