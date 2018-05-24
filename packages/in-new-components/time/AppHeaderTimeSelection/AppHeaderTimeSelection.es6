import React from 'react';

import TimeSelectionDialogPresenter from 'in-new-components/time/TimeSelectionDialogPresenter';
import { timeConfig$, setTimeframe, setFocusedMoment } from 'in-stores/timeline';
import TimePresenter from 'in-new-components/time/TimePresenter';
import Overlay from 'in-new-components/overlays/Overlay';
import connect from 'in-hoc/connectTo';

import locals from './AppHeaderTimeSelection.mless';

export default connect({
  timeConfig: timeConfig$
})(AppHeaderTimeSelection);

function AppHeaderTimeSelection({ timeConfig }) {
  return (
    <Overlay
      props={{ timeConfig }}
      content={TimeSelectionDialogPresenterWrapper}
      withoutWrapper
      withoutArrow
      position="fixed"
    >
      {TimePresenterWrapper}
    </Overlay>
  );
}

function TimePresenterWrapper({ isOpen, toggle, timeConfig, refSetter }) {
  return (
    <TimePresenter
      expanded={isOpen}
      timeConfig={timeConfig}
      className={locals.time}
      onClick={toggle}
      refSetter={refSetter}
    />
  );
}

function TimeSelectionDialogPresenterWrapper({ timeConfig, close }) {
  return <TimeSelectionDialogPresenter timeConfig={timeConfig} onChange={onChange} />;

  function onChange(timeConfig) {
    close();
    setTimeframe(timeConfig.windowSize, timeConfig.to);
    setFocusedMoment(timeConfig.to);
  }
}
