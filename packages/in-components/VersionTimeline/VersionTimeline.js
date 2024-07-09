/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';
import classNames from 'classnames';

import { themes } from '@instana/design-tokens';

import { formatDateTime, formatDuration } from 'in-services/formatters/date';
import HorizontalTimeAxis from 'in-components/Axis/HorizontalTimeAxis';
import useResizeObserverCustom from 'in-hooks/useResizeObserver';
import Tooltip from 'in-components/Tooltip';
import createScale from 'in-services/scale';

import locals from './VersionTimeline.mless';

export default function VersionTimeline({ onVersionClick, getTooltip, from, to, selectedVersion, versions }) {
  const { width, ref } = useResizeObserverCustom();

  const scale = createScale();
  scale.setDomainFrom(from);
  scale.setDomainTo(to);
  scale.setRangeFrom(0);
  scale.setRangeTo(width);

  return (
    <div className={locals.view} ref={ref}>
      {width && versions.length > 0 && (
        <>
          <BeginningGap firstVersion={versions[0]} scale={scale} />
          {versions.map((version, i) => {
            const left = Math.max(0, scale.getRange(version.from));
            return (
              <Fragment key={i}>
                <Tooltip
                  themeStyle="light"
                  content={
                    <TooltipContent from={version.from} to={version.to} getTooltip={getTooltip} version={version} />
                  }
                  align={'auto'}
                  legacy
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
      {width && (
        <HorizontalTimeAxis
          tickLineColor={themes.default.ids.color.option.neutral['600']}
          scale={{ from, to }}
          width={width}
        />
      )}
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
