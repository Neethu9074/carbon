import PropTypes from 'prop-types';
import theme from 'in-themes';
import React from 'react';

import MarkerLane from 'in-components/Chart/markerLanes/MarkerLane/MarkerLane';
import { formatDateTime } from 'in-services/formatters/date';
import { propTypeTimeConfig } from 'in-stores/time/config';

import locals from './ReleaseMarkerLanePresenter.mless';

const maxNumReleasesToShow = 3;

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
            {clusteredReleases.slice(0, maxNumReleasesToShow).map(({ name, start }) => (
              <div key={start}>
                <time dateTime={new Date(start).toISOString()}>{formatDateTime(start)}</time>
                <div className={locals.name}>{`${name}`}</div>
              </div>
            ))}
            {visibleReleasesCount > maxNumReleasesToShow && (
              <div>{`+${visibleReleasesCount - maxNumReleasesToShow} more releases`}</div>
            )}
          </div>
        );
      }}
    />
  );
}

ReleaseMarkerLanePresenter.propTypes = {
  timeConfig: propTypeTimeConfig,
  labelVisible: PropTypes.bool,
  labelAlignment: PropTypes.string,
  releases: PropTypes.array.isRequired
};
