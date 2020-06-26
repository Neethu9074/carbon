import PropTypes from 'prop-types';
import theme from 'in-themes';
import React from 'react';

import MarkerLane from 'in-components/Chart/markerLanes/MarkerLane';
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
        typeCluster: '',
        color: theme.lib.colors.N700Medium
      }}
      tooltipContent={({ start, name }) => (
        <div className={locals.tooltipContent}>
          <time dateTime={new Date(start).toISOString()}>{formatDateTime(start)}</time>
          <div>Release: {name}</div>
        </div>
      )}
    />
  );
}

ReleaseMarkerLanePresenter.propTypes = {
  timeConfig: propTypeTimeConfig,
  labelVisible: PropTypes.bool,
  labelAlignment: PropTypes.string,
  releases: PropTypes.array.isRequired
};
