import React from 'react';

import TimeSelectionDialogPresenter from 'in-new-components/time/TimeSelectionDialogPresenter';
import TimePresenter from 'in-new-components/time/TimePresenter';
import { timeframe$, setTimeframe } from 'in-stores/timeline';
import Overlay from 'in-new-components/overlays/Overlay';
import connect from 'in-hoc/connectTo';

import locals from './AppHeaderTimeSelection.mless';

export default connect({
  timeframe: timeframe$
})(AppHeaderTimeSelection);

function AppHeaderTimeSelection({ timeframe }) {
  return (
    <Overlay props={{ timeframe }} content={TimeSelectionDialogPresenterWrapper} withoutWrapper withoutArrow>
      {TimePresenterWrapper}
    </Overlay>
  );
}

function TimePresenterWrapper({ isOpen, toggle, timeframe, refSetter }) {
  return (
    <TimePresenter
      expanded={isOpen}
      timeframe={timeframe}
      className={locals.time}
      onClick={toggle}
      refSetter={refSetter}
    />
  );
}

function TimeSelectionDialogPresenterWrapper({ timeframe, close }) {
  return <TimeSelectionDialogPresenter timeframe={timeframe} onChange={onChange} />;

  function onChange(timeframe) {
    close();
    setTimeframe(timeframe.windowSize, timeframe.to);
  }
}
