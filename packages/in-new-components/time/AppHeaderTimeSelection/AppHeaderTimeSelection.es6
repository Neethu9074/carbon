import React, { Fragment } from 'react';

import {
  getFixedTimeframeUrl,
  getTimeframeLiveUrl,
  setTimeframe,
  setFocusedMoment,
  timeConfig$,
  to$
} from 'in-stores/timeline';
import TimeSelectionDialogPresenter from 'in-new-components/time/TimeSelectionDialogPresenter';
import TimePresenter from 'in-new-components/time/TimePresenter';
import ToggleButton from 'in-new-components/ToggleButton';
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
    <Fragment>
      <LiveModeToggle isLive={timeConfig.autoRefresh} />
      <TimePresenter
        expanded={isOpen}
        timeConfig={timeConfig}
        className={locals.time}
        onClick={toggle}
        refSetter={refSetter}
      />
    </Fragment>
  );
}

function LiveModeToggle({ isLive }) {
  const href$ = isLive
    ? to$.flatMap(to =>
        getFixedTimeframeUrl({
          to,
          focusedMoment: to
        })
      )
    : getTimeframeLiveUrl();
  return (
    <ToggleButton checked={isLive} href$={href$}>
      LIVE
    </ToggleButton>
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
