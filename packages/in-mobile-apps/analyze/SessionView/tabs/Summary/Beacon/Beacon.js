/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useEffect, useState } from 'react';
import classNames from 'classnames';

import { toInteractiveElement } from '@instana/components';

import { PERFORMANCE_SUBTYPES } from 'in-mobile-apps/analyze/SessionView/tabs/Summary/Beacon/perTypeRenderers/PerformanceBeacon';
import ViewCrashGroupButton from 'in-mobile-apps/analyze/SessionView/tabs/Summary/Beacon/components/ViewCrashGroupButton';
import BackendTraceButton from 'in-mobile-apps/analyze/SessionView/tabs/Summary/Beacon/components/BackendTraceButton';
import HeaderToggleIcon from 'in-mobile-apps/analyze/SessionView/tabs/Summary/Beacon/components/HeaderToggleIcon';
import TypeHeader from 'in-mobile-apps/analyze/SessionView/tabs/Summary/Beacon/components/TypeHeader';
import renderers from 'in-mobile-apps/analyze/SessionView/tabs/Summary/Beacon/perTypeRenderers';
import { HighlightedEffect, triggerHighlight } from 'in-components/SelectedElementHighlighter';
import Tooltip from 'in-components/Tooltip';
import { t } from 'in-i18n';

import locals from './Beacon.mless';

export default function Beacon(props) {
  const { beacon, detailId } = props;
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (detailId.beaconId === beacon.beaconId && beacon.type !== 'sessionStart') {
      triggerHighlight(getHighlighterId(beacon.beaconId));
    }
  }, [beacon, detailId]);

  const beaconRenderers = renderers[beacon.type];
  if (!beaconRenderers) {
    return null;
  }

  return (
    <HighlightedEffect id={getHighlighterId(beacon.beaconId)}>
      {({ highlighted, ref }) => (
        <div
          ref={ref}
          className={classNames({
            [locals.beacon]: true,
            [locals.erroneous]: beacon.errorCount > 0,
            [locals.highlighted]: highlighted
          })}
        >
          <Tooltip
            content={
              beacon.performanceSubtype === PERFORMANCE_SUBTYPES.ANR
                ? '' // Empty string when performanceSubtype is ANR
                : expanded
                ? t('in-mobile-apps:sessionView.tabsSumBeacon.showlessTooltip')
                : t('in-mobile-apps:sessionView.tabsSumBeacon.showmoreTooltip')
            }
            align="topMiddle"
            overwriteBlock
          >
            <div
              className={locals.header}
              {...toInteractiveElement({
                ariaLabel: expanded
                  ? t('in-mobile-apps:sessionView.tabsSumBeacon.showlessAriaLabel')
                  : t('in-mobile-apps:sessionView.tabsSumBeacon.showmoreAriaLabel'),
                onDefaultInteraction: () => setExpanded(!expanded)
              })}
            >
              <div className={locals.leftHeader}>
                <TypeHeader beacon={beacon} />
                <beaconRenderers.LeftHeader {...props} toggleExpanded={() => setExpanded(!expanded)} />
              </div>
              <div
                className={classNames(locals.rightHeader, {
                  [locals.disabledHeader]: beacon.performanceSubtype === PERFORMANCE_SUBTYPES.ANR
                })}
              >
                <BackendTraceButton beacon={beacon} />
                {beacon.type === 'crash' && (
                  <ViewCrashGroupButton
                    mobileAppId={beacon.mobileAppId}
                    crashGroupLabel={beacon.stackTraceKeyInformation + '\n' + beacon.errorType}
                  />
                )}
                <HeaderToggleIcon {...props} />
              </div>
            </div>
          </Tooltip>

          {expanded && beacon.performanceSubtype !== PERFORMANCE_SUBTYPES.ANR && (
            <div className={locals.body}>
              <beaconRenderers.Body {...props} />
            </div>
          )}
        </div>
      )}
    </HighlightedEffect>
  );
}

export function getHighlighterId(beaconId) {
  return `session-view-beacon-${beaconId}`;
}
