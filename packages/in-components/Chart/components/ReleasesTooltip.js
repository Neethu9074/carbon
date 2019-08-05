import { withState, compose, setPropTypes, pure } from 'recompose';
import { interval } from 'reactive-observables';
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import evaluateClassNames, { joinClassNames } from 'in-services/util/classnames';
import { formatDateTime, fromNowAccurately } from 'in-services/formatters/date';
import SvgIcon from 'in-components/SvgIcon/SvgIcon';
import connectTo from 'in-hoc/connectTo';

import locals from './ReleasesTooltip.mless';

export default compose(
  setPropTypes({
    markerHasCrossedHalfOfTheCanvas: PropTypes.bool.isRequired,
    markerXPosition: PropTypes.number.isRequired,
    release: PropTypes.shape({
      name: PropTypes.string.isRequired,
      start: PropTypes.number.isRequired
    })
  }),
  withState('popupVisisible', 'setPopupVisible', false)
)(ReleaseTooltip);

function ReleaseTooltip({
  markerHasCrossedHalfOfTheCanvas,
  markerXPosition,
  popupVisisible,
  release,
  setPopupVisible
}) {
  return (
    <div
      className={locals.marker}
      style={{
        transform: `translate(${markerXPosition}px)`
      }}
      onMouseEnter={() => setPopupVisible(true)}
      onMouseLeave={() => setPopupVisible(false)}
    >
      <div
        className={evaluateClassNames({
          [locals.rightAlignedContent]: !markerHasCrossedHalfOfTheCanvas,
          [locals.leftAlignedContent]: markerHasCrossedHalfOfTheCanvas
        })}
      >
        {popupVisisible && <ReleaseTooltipContent start={release.start} name={release.name} />}
      </div>
      <SvgIcon
        className={joinClassNames(locals.markerIcon, locals.markerIconBackground)}
        type="lib_release_rocket"
        size={28}
      />
      <SvgIcon className={joinClassNames(locals.markerIcon, locals.markerIconForeground)} type="lib_release_rocket" />
    </div>
  );
}

function ReleaseTooltipContent({ name, start }) {
  return (
    <div className={locals.tooltipContent}>
      <h2 className={locals.heading}>
        <time dateTime={new Date(start).toISOString()}>{formatDateTime(start)}</time>
        &nbsp; (<MinutesCount start={start} /> ago)
      </h2>
      <h3 className={locals.subHeading}>Release Started</h3>
      <div className={locals.subContent}>
        <SvgIcon className={locals.tooltipIcon} type="lib_release_rocket" width={24} height={24} />
        <span>{name}</span>
      </div>
    </div>
  );
}

const MinutesCount = connectTo(({ start }) => ({
  rangeInMinutes: interval(1000)
    .startWith(start)
    .map(() => fromNowAccurately(start))
}))(
  pure(function MinutesCount({ rangeInMinutes }) {
    return <Fragment>{rangeInMinutes}</Fragment>;
  })
);
