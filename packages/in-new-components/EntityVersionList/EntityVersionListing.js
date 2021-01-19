/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React, { Fragment } from 'react';

import { formatDateTime } from 'in-services/formatters/date';
import { Ul, Li } from 'in-new-components/lists/List/List';
import { getFixedTimeframeUrl } from 'in-stores/timeline';
import Link from 'in-components/Link';

import locals from './EntityVersionListing.mless';

export default function EntityVersionListing({ versions }) {
  versions.sort(sortByTo);
  const clusters = cluster(versions);

  return (
    <Fragment>
      <div className={locals.listHeading}>Available time ranges</div>
      <Ul className={locals.list}>
        {clusters.map((clusterVersions, iC) => {
          const clusterFrom = clusterVersions[clusterVersions.length - 1].from;
          const clusterTo = clusterVersions[0].to;

          return (
            <Fragment key={iC}>
              {clusterVersions.length > 1 ? (
                <Cluster from={clusterFrom} to={clusterTo} clusterVersions={clusterVersions} />
              ) : (
                <SimpleVersion from={clusterFrom} to={clusterTo} />
              )}
            </Fragment>
          );
        })}
      </Ul>
    </Fragment>
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

function Cluster({ from, to, clusterVersions }) {
  return (
    <Li
      key={'cluster' + from}
      size="compact"
      renderNestedContent={() => (
        <Ul framed={false}>
          {clusterVersions.map(version => (
            <Li key={version.from} size="compact">
              <VersionLink {...version} />
            </Li>
          ))}
        </Ul>
      )}
    >
      <VersionLink from={from} to={to} />
    </Li>
  );
}

function SimpleVersion({ from, to }) {
  return (
    <Li key={from} size="compact">
      <VersionLink from={from} to={to} />
    </Li>
  );
}

function VersionLink({ from, to }) {
  const windowSize = (to || Date.now()) - from;
  return (
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
  );
}

// exports for test
export function cluster(versions) {
  let currentCluster = [];
  const clusters = [];
  let prevVersion = null;
  for (let i = 0; i < versions.length; i++) {
    if (i === 0) {
      clusters.push(currentCluster);
    }
    const version = versions[i];
    if (prevVersion && prevVersion.from !== version.to) {
      currentCluster = [];
      clusters.push(currentCluster);
    }
    currentCluster.push(version);
    prevVersion = version;
  }

  return clusters;
}
