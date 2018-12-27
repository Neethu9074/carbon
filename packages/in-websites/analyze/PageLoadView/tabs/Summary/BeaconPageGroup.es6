import { withState } from 'recompose';
import React from 'react';

import HeaderToggleIcon from 'in-websites/analyze/PageLoadView/tabs/Summary/Beacon/components/HeaderToggleIcon';
import Beacon from 'in-websites/analyze/PageLoadView/tabs/Summary/Beacon';
import SvgIcon from 'in-components/SvgIcon';
import Link from 'in-components/Link';

import locals from './BeaconPageGroup.mless';

export default withState('expanded', 'setExpanded', true)(BeaconPageGroup);

function BeaconPageGroup({ page, beacons, earliestTimestamp, pageLoad, expanded, setExpanded }) {
  return (
    <div className={locals.group}>
      <div className={locals.header}>
        <div className={locals.left}>
          <SvgIcon type="lib_document" height={18} className={locals.pageIcon} />
          <span className={locals.pageName}>{page || 'Page name not set'}</span>

          {!page && (
            <Link
              external
              href="https://docs.instana.io/products/website_monitoring/api/#page"
              className={locals.learnHow}
            >
              Learn how to define pages
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
