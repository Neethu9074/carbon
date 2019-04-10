import { compose, withState } from 'recompose';
import React, { Fragment } from 'react';

import { formatDuration, formatDateTime } from 'in-services/formatters/date';
import HorizontalTimeAxis from 'in-new-components/Axis/HorizontalTimeAxis';
import { evaluateClassNames } from 'in-services/util/classnames';
import getElementDimensions from 'in-hoc/getElementDimensions';
import SvgIcon from 'in-components/SvgIcon';
import Tooltip from 'in-components/Tooltip';
import createScale from 'in-charts/scale';
import Code from 'in-components/Code';
import theme from 'in-themes';

import locals from './SnapshotTimeline.mless';

export default compose(
  getElementDimensions,
  withState('selectedSnapshot', 'setSelectedSnapshot', null)
)(SnapshotTimeline);

function SnapshotTimeline({ selectedSnapshot, setSelectedSnapshot, width, timeConfig, snapshots }) {
  if (!width) {
    return <div className={locals.view} />;
  }
  const to = timeConfig.to;
  const scale = createScale();
  scale.setDomainFrom(to - timeConfig.windowSize);
  scale.setDomainTo(to);
  scale.setRangeFrom(0);
  scale.setRangeTo(width);

  return (
    <div className={locals.view}>
      <BeginningGap firstSnapshot={snapshots[0]} scale={scale} />
      {snapshots.map((snapshot, i) => {
        const left = Math.max(0, scale.getRange(snapshot.from));
        return (
          <Fragment key={i}>
            <Tooltip
              themeStyle="light"
              content={<DiffTootltipContent snapshot={snapshot} />}
              align={getTooltipAlign(left)}
            >
              <div
                className={evaluateClassNames({
                  [locals.snapshot]: true,
                  [locals.selectedSnapshot]: snapshot === selectedSnapshot,
                  [locals.even]: i % 2 === 0
                })}
                style={{
                  left,
                  width: scale.getRange(snapshot.to || to) - left
                }}
                onClick={() => {
                  if (selectedSnapshot === snapshot) {
                    setSelectedSnapshot(null);
                  } else {
                    setSelectedSnapshot(snapshot);
                  }
                }}
              />
            </Tooltip>
            <IntermediateGap snapshot={snapshot} nextSnapshot={snapshots[i + 1]} scale={scale} />
          </Fragment>
        );
      })}
      <EndingGap lastSnapshot={snapshots[snapshots.length - 1]} scale={scale} />
      <HorizontalTimeAxis
        tickLineColor={theme.lib.colors.N600Light}
        scale={{ from: scale.getDomainFrom(), to: scale.getDomainTo() }}
        width={width}
      />
      {selectedSnapshot && (
        <div className={locals.fullSnapshot}>{<Code code={JSON.stringify(selectedSnapshot, 0, 2)} lang="json" />}</div>
      )}
    </div>
  );
}

function IntermediateGap({ snapshot, nextSnapshot, scale }) {
  if (!nextSnapshot || nextSnapshot.from <= snapshot.to) {
    return null;
  }
  return <Gap from={snapshot.to} to={nextSnapshot.from} scale={scale} />;
}

function BeginningGap({ firstSnapshot, scale }) {
  if (firstSnapshot.from <= scale.getDomainFrom()) {
    return null;
  }
  return <Gap from={scale.getDomainFrom()} to={firstSnapshot.from} scale={scale} />;
}

function EndingGap({ lastSnapshot, scale }) {
  if (!lastSnapshot.to || lastSnapshot.to >= scale.getDomainTo()) {
    return null;
  }

  return <Gap from={lastSnapshot.from} to={scale.getDomainTo()} scale={scale} />;
}

function Gap({ from, to, scale }) {
  const left = Math.max(0, scale.getRange(from));

  return (
    <Tooltip themeStyle="light" content={<Header from={from} to={to} />}>
      <div className={locals.gap} style={{ left, width: scale.getRange(to) - left }}>
        <SvgIcon className={locals.gapIcon} type="lib_kubernetes_status_failed" width={12} height={12} />
      </div>
    </Tooltip>
  );
}

function DiffTootltipContent({ snapshot }) {
  return (
    <Fragment>
      <Header from={snapshot.from} to={snapshot.to} />
      {snapshot.__difference && <Code code={JSON.stringify(snapshot.__difference, 0, 2)} lang="json" />}
    </Fragment>
  );
}

function Header({ from, to }) {
  return (
    <div className={locals.header}>
      <div>
        from: <span className={locals.time}>{formatDateTime(from)}</span>
      </div>
      to: <span className={locals.time}>{to ? formatDateTime(to) : 'live'}</span>
      <div>{to ? formatDuration(to - from) : null}</div>
    </div>
  );
}

function getTooltipAlign(left) {
  const leftWiggleRoom = 400;
  if (left > leftWiggleRoom) {
    return 'leftMiddle';
  }
  return 'bottomMiddle';
}
