import PropTypes from 'prop-types';
import theme from 'in-themes';
import React from 'react';

import MarkerLane from 'in-components/Chart/markerLanes/MarkerLane/MarkerLane';
import { formatDateTime } from 'in-services/formatters/date';
import { propTypeTimeConfig } from 'in-stores/time/config';

import locals from './ReleaseMarkerLanePresenter.mless';

export default function ReleaseMarkerLanePresenter(props) {
  return (
    <MarkerLane
      {...props}
      events={props.releases}
      label="Releases"
      iconConfig={{
        type: 'lib_release_rocket',
        typeCluster: 'lib_release_rocket',
        color: theme.lib.colors.N700Medium
      }}
      tooltipContent={({ clusteredReleases = [] }) => {
        const visibleReleasesCount = 3;
        return (
          <div className={locals.tooltipContent}>
            {clusteredReleases.slice(0, visibleReleasesCount).map(({ name, start }) => (
              <div key={start}>
                <time dateTime={new Date(start).toISOString()}>{formatDateTime(start)}</time>
                <div className={locals.name}>{`${name}`}</div>
              </div>
            ))}
            <MoreReleases clusteredReleases={clusteredReleases} visibleReleasesCount={visibleReleasesCount} />
          </div>
        );
      }}
    />
  );
}

function MoreReleases({ clusteredReleases, visibleReleasesCount }) {
  const releasesCount = clusteredReleases.length;
  if (releasesCount <= visibleReleasesCount) return null;

  const moreReleasesCount = releasesCount - visibleReleasesCount;
  return <div>{`+${moreReleasesCount} more release${moreReleasesCount > 1 ? 's' : ''}`}</div>;
}

ReleaseMarkerLanePresenter.propTypes = {
  timeConfig: propTypeTimeConfig,
  labelVisible: PropTypes.bool,
  labelAlignment: PropTypes.string,
  releases: PropTypes.arrayOf(
    PropTypes.shape({
      timestamp: PropTypes.number.isRequired,
      clusteredReleases: PropTypes.arrayOf(
        PropTypes.shape({
          name: PropTypes.string.isRequired,
          id: PropTypes.string.isRequired,
          lastUpdated: PropTypes.number,
          start: PropTypes.number
        })
      )
    })
  ).isRequired
};
