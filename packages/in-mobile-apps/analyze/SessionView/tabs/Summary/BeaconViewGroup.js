/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState } from 'react';

import { SvgIcon, toInteractiveElement } from '@instana/components';
import { Link } from '@instana/components';

import HeaderToggleIcon from 'in-mobile-apps/analyze/SessionView/tabs/Summary/Beacon/components/HeaderToggleIcon';
import Beacon from 'in-mobile-apps/analyze/SessionView/tabs/Summary/Beacon';
import { t } from 'in-i18n';

import locals from './BeaconViewGroup.mless';

export default function BeaconViewGroup({ view, beacons, detailId, earliestTimestamp, sessionStart }) {
  const [expanded, setExpanded] = useState(true);
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
              href="https://www.ibm.com/docs/en/obi/current?topic=monitoring-ios-api#views"
              className={locals.learnHow}
              external
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
              detailId={detailId}
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
