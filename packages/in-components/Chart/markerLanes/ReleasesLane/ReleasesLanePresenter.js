import PropTypes from 'prop-types';
import theme from 'in-themes';
import React from 'react';

import SingleIconLaneItem from 'in-components/Chart/markerLanes/MarkerLane/SingleIconLaneItem';
import MarkerLane from 'in-components/Chart/markerLanes/MarkerLane/MarkerLane';
import HoverLine from 'in-components/Chart/markerLanes/MarkerLane/HoverLine';
import HoverArea from 'in-components/Chart/markerLanes/MarkerLane/HoverArea';
import { formatDateTime } from 'in-services/formatters/date';
import { propTypeTimeConfig } from 'in-stores/time/config';

import locals from './ReleasesLanePresenter.mless';

const maxNumReleasesToShow = 3;

export default function ReleasesLanePresenter(props) {
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
      color={theme.lib.colors.N700Medium}
      tooltipContent={({ clusteredReleases, count }) => (
        <div className={locals.tooltipContent}>
          {clusteredReleases.slice(0, maxNumReleasesToShow).map(({ name, start }) => (
            <div key={start}>
              <time dateTime={new Date(start).toISOString()}>{formatDateTime(start)}</time>
              <div className={locals.name}>{`${name}`}</div>
            </div>
          ))}
          {count > maxNumReleasesToShow && <div>{`+${count - maxNumReleasesToShow} more Releases`}</div>}
        </div>
      )}
      renderLaneItem={SingleIconLaneItem}
      renderHoverOverlay={props.isClustered ? HoverArea : HoverLine}
    />
  );
}

ReleasesLanePresenter.propTypes = {
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
  ).isRequired,
  isClustered: PropTypes.bool
};
