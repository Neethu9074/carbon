/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { compose, withState } from 'recompose';
import classNames from 'classnames';
import React from 'react';

import BackendTraceButton from 'in-mobile-apps/analyze/SessionView/tabs/Summary/Beacon/components/BackendTraceButton';
import HeaderToggleIcon from 'in-mobile-apps/analyze/SessionView/tabs/Summary/Beacon/components/HeaderToggleIcon';
import TypeHeader from 'in-mobile-apps/analyze/SessionView/tabs/Summary/Beacon/components/TypeHeader';
import renderers from 'in-mobile-apps/analyze/SessionView/tabs/Summary/Beacon/perTypeRenderers';
import { toInteractiveElement } from 'in-new-components/interactiveCustomElement';
import { HighlightedEffect } from 'in-new-components/SelectedElementHighlighter';
import Tooltip from 'in-components/Tooltip';
import { t } from 'in-i18n';

import locals from './Beacon.mless';

export default compose(withState('expanded', 'setExpanded', false))(function Beacon(props) {
  const { beacon, expanded, setExpanded } = props;

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
              expanded
                ? t('in-mobile-apps:sessionView.tabsSumBeacon.showlessTooltip')
                : t('in-mobile-apps:sessionView.tabsSumBeacon.showmoreTooltip')
            }
            align="topMiddle"
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
              <div className={locals.rightHeader}>
                <BackendTraceButton beacon={beacon} />
                <HeaderToggleIcon {...props} />
              </div>
            </div>
          </Tooltip>

          {expanded && (
            <div className={locals.body}>
              <beaconRenderers.Body {...props} />
            </div>
          )}
        </div>
      )}
    </HighlightedEffect>
  );
});

export function getHighlighterId(beaconId) {
  return `session-view-beacon-${beaconId}`;
}
