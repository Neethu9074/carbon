/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { withState } from 'recompose';
import React from 'react';

import { toInteractiveElement } from '@instana/components';
import { Link } from '@instana/components';

import HeaderToggleIcon from 'in-websites/analyze/PageLoadView/tabs/Summary/Beacon/components/HeaderToggleIcon';
import Beacon from 'in-websites/analyze/PageLoadView/tabs/Summary/Beacon';
import SvgIcon from 'in-components/SvgIcon';
import { t } from 'in-i18n';

import locals from './BeaconPageGroup.mless';

export default withState('expanded', 'setExpanded', true)(BeaconPageGroup);

function BeaconPageGroup({ page, beacons, earliestTimestamp, pageLoad, expanded, setExpanded }) {
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
            <Link external href="https://instana.com/docs/website_monitoring/api/#page" className={locals.learnHow}>
              {t('in-websites:analyze.analyzeView.pageLoadView.beaconPageGroupLinkLearnHowToDefinePages')}
            </Link>
          )}
        </div>

        <HeaderToggleIcon expanded={expanded} setExpanded={setExpanded} />
      </div>

      {expanded && (
        <div className={locals.beacons}>
          {beacons.map(beacon => (
            <Beacon beacon={beacon} pageLoad={pageLoad} earliestTimestamp={earliestTimestamp} key={beacon.beaconId} />
          ))}
        </div>
      )}
    </div>
  );
}
