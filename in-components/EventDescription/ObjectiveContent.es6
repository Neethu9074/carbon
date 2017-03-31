import React from 'react';

import { getColorForEventAtFocusedMomentAsStream } from 'in-stores/events';
import SnapshotDescription from 'in-components/SnapshotDescription';
import connectTo from 'in-hoc/connectTo';

const block = 'in-event-description';

export default function ObjectiveContent({ objective }) {
  const problem = objective.get('problem');

  return (
    <div>
      <div className={block + '__header'}>
        {`Objective violation (${objective.get('issues').size}) events`}
      </div>

      <span className={block + '__incident-started'}>
        started here:
      </span>

      <Header event={objective} text={problem.get('problemText')} />

      <SnapshotDescription snapshotId={problem.get('snapshotId', '')} time={objective.get('start')} />
    </div>
  );
}

const Header = connectTo(
  props => {
    return {
      color: getColorForEventAtFocusedMomentAsStream(props.event)
    };
  },
  ({ color, text }) => {
    return (
      <div
        className={block + '__header'}
        style={{
          color: color ? color : '#ffffff'
        }}
      >
        {text}
      </div>
    );
  }
);
