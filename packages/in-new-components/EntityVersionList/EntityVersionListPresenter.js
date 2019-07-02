import React from 'react';

import { formatDateTime } from 'in-services/formatters/date';
import { getFixedTimeframeUrl } from 'in-stores/timeline';
import PluginIcon from 'in-components/PluginIcon';
import { getSingular } from 'in-sdk/pluginName';
import Link from 'in-components/Link';

import locals from './EntityVersionListPresenter.mless';

export default function EntityVersionListPresenter({ plugin, snapshotVersions }) {
  snapshotVersions.sort(sortByTo);

  return (
    <div className={locals.frame}>
      <PluginIcon className={locals.icon} plugin={plugin} dimension={48} />
      <h2 className={locals.title}>{`${getSingular(plugin)} not found`}</h2>
      <p className={locals.explanation}>
        We could not find a version of this entity in the selected time range. We found other versions in different time
        ranges:
      </p>

      <div className={locals.listHeading}>Available time ranges</div>
      <ul className={locals.list}>
        {snapshotVersions.map(({ from, to }, i) => {
          const windowSize = (to || Date.now()) - from;

          return (
            <li key={i} size="compact" className={locals.item}>
              <Link
                className={locals.link}
                href$={getFixedTimeframeUrl({
                  windowSize,
                  to,
                  focusedMoment: to ? to - windowSize / 2 : ''
                })}
              >
                <span className={locals.fromTimestamp}>{formatDateTime(from)}</span>
                <span className={locals.toSpan}>to</span>
                <span className={locals.toTimestamp}>{to ? formatDateTime(to) : 'Now'}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function sortByTo(versionA, versionB) {
  if (!versionA.to) {
    return -Number.MAX_VALUE;
  }
  if (!versionB.to) {
    return Number.MAX_VALUE;
  }

  return versionB.to - versionA.to;
}
