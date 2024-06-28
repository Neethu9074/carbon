/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useEffect, useState } from 'react';
import classNames from 'classnames';

import { toInteractiveElement } from '@instana/components';

import BackendTraceButton from 'in-websites/analyze/PageLoadView/tabs/Summary/Beacon/components/BackendTraceButton';
import HeaderToggleIcon from 'in-websites/analyze/PageLoadView/tabs/Summary/Beacon/components/HeaderToggleIcon';
import TypeHeader from 'in-websites/analyze/PageLoadView/tabs/Summary/Beacon/components/TypeHeader';
import { HighlightedEffect, triggerHighlight } from 'in-components/SelectedElementHighlighter';
import renderers from 'in-websites/analyze/PageLoadView/tabs/Summary/Beacon/perTypeRenderers';
import Tooltip from 'in-components/Tooltip';
import { t } from 'in-i18n';

import locals from './Beacon.mless';

export default function Beacon(props) {
  const [expanded, setExpanded] = useState(false);
  const { detailId, beacon } = props;

  useEffect(() => {
    if (detailId.beaconId === beacon.beaconId && beacon.type !== 'pageLoad') {
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
              expanded
                ? t('in-websites:analyze.analyzeView.pageLoadView.beaconTooltipShowLess')
                : t('in-websites:analyze.analyzeView.pageLoadView.beaconTooltipShowMore')
            }
            align="topMiddle"
            overwriteBlock
          >
            <div
              className={locals.header}
              {...toInteractiveElement({
                ariaLabel: expanded
                  ? t('in-websites:analyze.analyzeView.pageLoadView.beaconTooltipShowLess')
                  : t('in-websites:analyze.analyzeView.pageLoadView.beaconTooltipShowMore'),
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
}

export function getHighlighterId(beaconId) {
  return `page-load-view-beacon-${beaconId}`;
}
