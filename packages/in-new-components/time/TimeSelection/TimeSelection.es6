import React from 'react';

import {
  getTimeframeNonLiveUrl,
  getTimeframeLiveUrl,
  setTimeframe,
  setFocusedMoment,
  timeConfig$
} from 'in-stores/timeline';
import TimeSelectionDialogPresenter from 'in-new-components/time/TimeSelectionDialogPresenter';
import TimePresenter from 'in-new-components/time/TimePresenter';
import { createTracker } from 'in-services/tracking/mixpanel';
import ToggleButton from 'in-new-components/ToggleButton';
import Overlay from 'in-new-components/overlays/Overlay';
import ErrorBoundary from 'in-components/ErrorBoundary';
import connect from 'in-hoc/connectTo';

import locals from './TimeSelection.mless';

export const trackWindowSizeViaPicker = createTracker('time.windowSize.viaPicker');

export default connect({
  timeConfig: timeConfig$
})(TimeSelection);

function TimeSelection({ timeConfig, isHidden }) {
  if (isHidden) {
    return null;
  }

  return (
    <ErrorBoundary name="time-selection">
      <Overlay props={{ timeConfig }} content={TimeSelectionDialogPresenterWrapper} withoutWrapper withoutArrow>
        {TimePresenterWrapper}
      </Overlay>
    </ErrorBoundary>
  );
}

function TimePresenterWrapper({ isOpen, toggle, timeConfig, refSetter }) {
  return (
    <div className={locals.timePresenter}>
      <LiveModeToggle isLive={timeConfig.autoRefresh} />
      <TimePresenter
        className={locals.time}
        expanded={isOpen}
        timeConfig={timeConfig}
        onClick={toggle}
        refSetter={refSetter}
      />
    </div>
  );
}

function LiveModeToggle({ isLive }) {
  const href$ = isLive ? getTimeframeNonLiveUrl() : getTimeframeLiveUrl();
  return (
    <div className={locals.liveModeToggle}>
      <ToggleButton
        checked={isLive}
        href$={href$}
        iconOff="lib_actions_play"
        iconOn="lib_actions_loading"
        iconOnSpinning="clockwise"
        iconOnHover="lib_actions_stop"
      >
        Live
      </ToggleButton>
    </div>
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
