/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { withState } from 'recompose';
import React from 'react';

import { toInteractiveElement } from '@instana/components';
import { SvgIcon } from '@instana/components';
import { Link } from '@instana/components';

import HeaderToggleIcon from 'in-mobile-apps/analyze/SessionView/tabs/Summary/Beacon/components/HeaderToggleIcon';
import Beacon from 'in-mobile-apps/analyze/SessionView/tabs/Summary/Beacon';
import { t } from 'in-i18n';

import locals from './BeaconViewGroup.mless';

export default withState('expanded', 'setExpanded', true)(BeaconViewGroup);

function BeaconViewGroup({ view, beacons, earliestTimestamp, sessionStart, expanded, setExpanded }) {
  return (
    <div className={locals.group}>
      <div
        className={locals.header}
        {...toInteractiveElement({
          ariaLabel: expanded
            ? t('in-mobile-apps:sessionView.tabsSumBeaconViewGroup.showlessAiralabel')
            : t('in-mobile-apps:sessionView.tabsSumBeaconViewGroup.showmoreAiralabel'),
          onDefaultInteraction: () => setExpanded(!expanded)
        })}
      >
        <div className={locals.left}>
          <SvgIcon type="lib_mobile_app_view" size="s" className={locals.viewIcon} />
          <span className={locals.viewName}>
            {view || t('in-mobile-apps:sessionView.tabsSumBeaconViewGroup.noViewName')}
          </span>

          {!view && (
            <Link
              external
              href="https://instana.com/docs/mobile_app_monitoring/ios_api/#views"
              className={locals.learnHow}
            >
              {t('in-mobile-apps:sessionView.tabsSumBeaconViewGroup.noViewGuide')}
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
