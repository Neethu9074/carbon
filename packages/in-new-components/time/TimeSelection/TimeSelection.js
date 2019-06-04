import React from 'react';

import {
  getTimeframeNonLiveUrl,
  getTimeframeLiveUrl,
  setTimeframe,
  setFocusedMoment,
  timeConfig$
} from 'in-stores/timeline';
import TimeSelectionDialogPresenter from 'in-new-components/time/TimeSelectionDialogPresenter';
import { track, TIME_WINDOW_SIZE_VIA_PICKER } from 'in-services/tracking/tracking';
import { evaluateClassNames } from 'in-services/util/classnames';
import TimePresenter from 'in-new-components/time/TimePresenter';
import ToggleButton from 'in-new-components/ToggleButton';
import Overlay from 'in-new-components/overlays/Overlay';
import ErrorBoundary from 'in-components/ErrorBoundary';
import connect from 'in-hoc/connectTo';

import locals from './TimeSelection.mless';

export default connect({
  timeConfig: timeConfig$
})(TimeSelection);

function TimeSelection({ timeConfig, isHidden, darkTheme }) {
  if (isHidden) {
    return null;
  }

  return (
    <ErrorBoundary name="time-selection">
      <Overlay
        props={{ timeConfig, darkTheme }}
        content={TimeSelectionDialogPresenterWrapper}
        withoutWrapper
        withoutArrow
      >
        {TimePresenterWrapper}
      </Overlay>
    </ErrorBoundary>
  );
}

function TimePresenterWrapper({ isOpen, toggle, timeConfig, darkTheme, refSetter }) {
  return (
    <div
      className={evaluateClassNames({
        [locals.timePresenterWrapper]: true,
        [locals.darkTheme]: darkTheme
      })}
    >
      <TimePresenter
        className={locals.time}
        expanded={isOpen}
        timeConfig={timeConfig}
        onClick={toggle}
        refSetter={refSetter}
        darkTheme={darkTheme}
      />
      <LiveModeToggle isLive={timeConfig.autoRefresh} darkTheme={darkTheme} />
    </div>
  );
}

function LiveModeToggle({ isLive, darkTheme }) {
  const href$ = isLive ? getTimeframeNonLiveUrl() : getTimeframeLiveUrl();
  return (
    <ToggleButton
      checked={isLive}
      href$={href$}
      iconOff="lib_actions_play"
      iconOn="lib_actions_loading"
      iconOnSpinning="clockwise"
      iconOnHover="lib_actions_stop"
      darkTheme={darkTheme}
    >
      Live
    </ToggleButton>
  );
}

function TimeSelectionDialogPresenterWrapper({ timeConfig, close }) {
  return <TimeSelectionDialogPresenter timeConfig={timeConfig} onChange={onChange} />;

  function onChange(timeConfig) {
    close();
    setTimeframe(timeConfig.windowSize, timeConfig.to);
    setFocusedMoment(timeConfig.to);
    track(TIME_WINDOW_SIZE_VIA_PICKER);
  }
}
