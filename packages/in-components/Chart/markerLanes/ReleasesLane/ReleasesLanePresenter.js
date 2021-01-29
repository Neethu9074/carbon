/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import PropTypes from 'prop-types';
import theme from 'in-themes';
import { t } from 'in-i18n';
import React from 'react';

import SingleMarkerLaneItem from 'in-components/Chart/markerLanes/MarkerLane/SingleMarkerLaneItem';
import MarkerLane from 'in-components/Chart/markerLanes/MarkerLane/MarkerLane';
import HoverLine from 'in-components/Chart/markerLanes/MarkerLane/HoverLine';
import HoverArea from 'in-components/Chart/markerLanes/MarkerLane/HoverArea';
import LaneIcon from 'in-components/Chart/markerLanes/MarkerLane/LaneIcon';
import { formatDateTime } from 'in-services/formatters/date';
import { propTypeTimeConfig } from 'in-stores/time/config';

import locals from './ReleasesLanePresenter.mless';

const maxNumReleasesToShow = 3;

export default function ReleasesLanePresenter(props) {
  return (
    <MarkerLane
      {...props}
      events={props.releases}
      label={t('in-components:chart.chartReleasesLanePresenterReleasesLabel')}
      iconConfig={{
        type: 'lib_release_rocket',
        typeCluster: 'lib_release_rocket',
        color: theme.lib.colors.N700Medium
      }}
      color={theme.lib.colors.N700Medium}
      TooltipContent={({ clusteredReleases }) => (
        <div className={locals.tooltipContent}>
          {clusteredReleases.slice(0, maxNumReleasesToShow).map(({ name, start }) => (
            <div key={start}>
              <time dateTime={new Date(start).toISOString()}>{formatDateTime(start)}</time>
              <div className={locals.name}>{`${name}`}</div>
            </div>
          ))}
          {clusteredReleases.length > maxNumReleasesToShow && (
            <div>
              {t('in-components:chart.chartReleasesLanePresenterTooltip', {
                len: clusteredReleases.length - maxNumReleasesToShow
              })}
            </div>
          )}
        </div>
      )}
      LaneItem={SingleMarkerLaneItem}
      HoverOverlay={props.isClustered ? HoverArea : HoverLine}
      renderMarkerItem={LaneIcon}
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
