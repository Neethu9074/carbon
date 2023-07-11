/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState } from 'react';

import { SvgIcon, toInteractiveElement } from '@instana/components';
import { Link } from '@instana/components';

import HeaderToggleIcon from 'in-websites/analyze/PageLoadView/tabs/Summary/Beacon/components/HeaderToggleIcon';
import Beacon from 'in-websites/analyze/PageLoadView/tabs/Summary/Beacon';
import { t } from 'in-i18n';

import locals from './BeaconPageGroup.mless';

export default function BeaconPageGroup({ detailId, page, beacons, earliestTimestamp, pageLoad }) {
  const [expanded, setExpanded] = useState(true);
  return (
    <div className={locals.group}>
      <div
        className={locals.header}
        {...toInteractiveElement({
          ariaLabel: expanded
            ? t('in-websites:analyze.analyzeView.pageLoadView.beaconTooltipShowLess')
            : t('in-websites:analyze.analyzeView.pageLoadView.beaconTooltipShowMore'),
          onDefaultInteraction: () => setExpanded(!expanded)
        })}
      >
        <div className={locals.left}>
          <SvgIcon type="lib_document" size="s" className={locals.pageIcon} />
          <span className={locals.pageName}>
            {page || t('in-websites:analyze.analyzeView.pageLoadView.beaconPageGroupPageNameNotSet')}
          </span>

          {!page && (
            <Link
              external
              href="https://www.ibm.com/docs/en/obi/current?topic=websites-javascript-agent-api#page"
              className={locals.learnHow}
            >
              {t('in-websites:analyze.analyzeView.pageLoadView.beaconPageGroupLinkLearnHowToDefinePages')}
            </Link>
          )}
        </div>

        <HeaderToggleIcon expanded={expanded} setExpanded={setExpanded} />
      </div>

      {expanded && (
        <div className={locals.beacons}>
          {beacons.map(beacon => (
            <Beacon
              detailId={detailId}
              beacon={beacon}
              pageLoad={pageLoad}
              earliestTimestamp={earliestTimestamp}
              key={beacon.beaconId}
            />
          ))}
        </div>
      )}
    </div>
  );
}
