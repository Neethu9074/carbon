import React, { Fragment } from 'react';
import { compose } from 'recompose';
import theme from 'in-themes';

import { formatDuration, formatDateTime } from 'in-services/formatters/date';
import HorizontalTimeAxis from 'in-new-components/Axis/HorizontalTimeAxis';
import classNames from 'classnames';
import getElementDimensions from 'in-hoc/getElementDimensions';
import Tooltip from 'in-components/Tooltip';
import createScale from 'in-services/scale';

import locals from './VersionTimeline.mless';

export default compose(getElementDimensions)(VersionTimeline);

function VersionTimeline({ onVersionClick, width, getTooltip, from, to, selectedVersion, versions }) {
  if (!width) {
    return <div className={locals.view} />;
  }

  const scale = createScale();
  scale.setDomainFrom(from);
  scale.setDomainTo(to);
  scale.setRangeFrom(0);
  scale.setRangeTo(width);

  return (
    <div className={locals.view}>
      {versions.length > 0 && (
        <>
          <BeginningGap firstVersion={versions[0]} scale={scale} />
          {versions.map((version, i) => {
            const left = Math.max(0, scale.getRange(version.from));
            return (
              <Fragment key={i}>
                <Tooltip
                  themeStyle="light"
                  content={<TooltipContent from={from} to={to} getTooltip={getTooltip} version={version} />}
                  align={getTooltipAlign(left)}
                >
                  <div
                    className={classNames({
                      [locals.version]: true,
                      [locals.selected]: selectedVersion && selectedVersion.from === version.from,
                      [locals.even]: i % 2 === 0
                    })}
                    style={{
                      left,
                      width: scale.getRange(version.to || to) - left
                    }}
                    onClick={() => onVersionClick(version)}
                  />
                </Tooltip>
                <IntermediateGap version={version} nextVersion={versions[i + 1]} scale={scale} />
              </Fragment>
            );
          })}
          <EndingGap lastVersion={versions[versions.length - 1]} scale={scale} />
        </>
      )}
      <HorizontalTimeAxis tickLineColor={theme.lib.colors.N600Light} scale={{ from, to }} width={width} />
    </div>
  );
}

function IntermediateGap({ version, nextVersion, scale }) {
  if (!nextVersion || nextVersion.from <= version.to) {
    return null;
  }
  return <Gap from={version.to} to={nextVersion.from} scale={scale} />;
}

function BeginningGap({ firstVersion, scale }) {
  if (firstVersion.from <= scale.getDomainFrom()) {
    return null;
  }
  return <Gap from={scale.getDomainFrom()} to={firstVersion.from} scale={scale} />;
}

function EndingGap({ lastVersion, scale }) {
  if (!lastVersion.to || lastVersion.to >= scale.getDomainTo()) {
    return null;
  }

  return <Gap from={lastVersion.to} to={scale.getDomainTo()} scale={scale} />;
}

function Gap({ from, to, scale }) {
  const left = Math.max(0, scale.getRange(from));

  return (
    <Tooltip themeStyle="light" content={<TooltipContent from={from} to={to} />}>
      <div className={locals.gap} style={{ left, width: scale.getRange(to) - left }} />
    </Tooltip>
  );
}

function TooltipContent({ from, to, getTooltip, version }) {
  return (
    <Fragment>
      <div className={locals.header}>
        <div>
          from: <span className={locals.time}>{formatDateTime(from)}</span>
        </div>
        to: <span className={locals.time}>{to ? formatDateTime(to) : 'live'}</span>
        <div>{to ? formatDuration(to - from) : null}</div>
      </div>
      {version && getTooltip(version)}
    </Fragment>
  );
}

function getTooltipAlign(left) {
  const leftWiggleRoom = 400;
  if (left > leftWiggleRoom) {
    return 'leftMiddle';
  }
  return 'bottomMiddle';
}
