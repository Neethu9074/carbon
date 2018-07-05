import React, { Fragment } from 'react';

import {
  getTimeframeNonLiveUrl,
  getTimeframeLiveUrl,
  setTimeframe,
  setFocusedMoment,
  timeConfig$
} from 'in-stores/timeline';
import TimeSelectionDialogPresenter from 'in-new-components/time/TimeSelectionDialogPresenter';
import TimePresenter from 'in-new-components/time/TimePresenter';
import ToggleButton from 'in-new-components/ToggleButton';
import Overlay from 'in-new-components/overlays/Overlay';
import { createTracker } from 'in-services/tracking/mixpanel';
import connect from 'in-hoc/connectTo';

import locals from './AppHeaderTimeSelection.mless';

export const trackWindowSizeViaPicker = createTracker('time.windowSize.viaPicker');

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
      <TimePresenter
        expanded={isOpen}
        timeConfig={timeConfig}
        className={locals.time}
        onClick={toggle}
        refSetter={refSetter}
      />
      <LiveModeToggle isLive={timeConfig.autoRefresh} />
    </Fragment>
  );
}

function LiveModeToggle({ isLive }) {
  const href$ = isLive ? getTimeframeNonLiveUrl() : getTimeframeLiveUrl();
  return (
    <ToggleButton
      checked={isLive}
      href$={href$}
      iconOff="lib_actions_play"
      iconOn="lib_actions_loading"
      iconOnSpinning="clockwise"
      iconOnHover="lib_actions_stop"
      className={locals.liveToggle}
    >
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
    trackWindowSizeViaPicker();
  }
}
