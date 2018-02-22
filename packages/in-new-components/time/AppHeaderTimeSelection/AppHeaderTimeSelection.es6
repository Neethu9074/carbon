import { compose, withState } from 'recompose';
import React, { Fragment } from 'react';

import TimeSelectionDialogPresenter from 'in-new-components/time/TimeSelectionDialogPresenter';
import TimePresenter from 'in-new-components/time/TimePresenter';
import { timeframe$, setTimeframe } from 'in-stores/timeline';
import connect from 'in-hoc/connectTo';

import locals from './AppHeaderTimeSelection.mless';

export default compose(
  withState('dialogVisible', 'setDialogVisibility', false),
  connect({
    timeframe: timeframe$
  })
)(AppHeaderTimeSelection);

function AppHeaderTimeSelection({ timeframe, dialogVisible, setDialogVisibility }) {
  return (
    <Fragment>
      <TimePresenter
        expanded={dialogVisible}
        timeframe={timeframe}
        className={locals.time}
        onClick={() => setDialogVisibility(!dialogVisible)}
      />
      {dialogVisible && (
        <TimeSelectionDialogPresenter timeframe={timeframe} className={locals.dialog} onChange={onChange} />
      )}
    </Fragment>
  );

  function onChange(timeframe) {
    setDialogVisibility(false);
    setTimeframe(timeframe.windowSize, timeframe.to);
  }
}
