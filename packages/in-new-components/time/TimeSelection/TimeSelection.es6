import React from 'react';

import {
  eventsPath,
  physicalPath,
  containerPath,
  settingsPath,
  isTableView
} from 'in-stores/navigation/paths/mainPaths';
import {
  getTimeframeNonLiveUrl,
  getTimeframeLiveUrl,
  setTimeframe,
  setFocusedMoment,
  timeConfig$
} from 'in-stores/timeline';
import TimeSelectionDialogPresenter from 'in-new-components/time/TimeSelectionDialogPresenter';
import { evaluateClassNames } from 'in-services/util/classnames';
import TimePresenter from 'in-new-components/time/TimePresenter';
import { createTracker } from 'in-services/tracking/mixpanel';
import ToggleButton from 'in-new-components/ToggleButton';
import Overlay from 'in-new-components/overlays/Overlay';
import { isView } from 'in-stores/navigation/navigation';
import { any } from 'in-services/fixedStreams';
import connect from 'in-hoc/connectTo';

import locals from './TimeSelection.mless';

export const trackWindowSizeViaPicker = createTracker('time.windowSize.viaPicker');

export default connect({
  timeConfig: timeConfig$,
  isHidden: isView(settingsPath).distinct(),
  useLightTheme: any(
    isView(physicalPath),
    isView(containerPath),
    isTableView('physical'),
    isView(eventsPath)
  ).distinct()
})(TimeSelection);

function TimeSelection({ timeConfig, isHidden, useLightTheme }) {
  if (isHidden) {
    return null;
  }

  return (
    <Overlay
      props={{ timeConfig, useLightTheme }}
      content={TimeSelectionDialogPresenterWrapper}
      withoutWrapper
      withoutArrow
    >
      {TimePresenterWrapper}
    </Overlay>
  );
}

function TimePresenterWrapper({ isOpen, toggle, timeConfig, useLightTheme, refSetter }) {
  return (
    <div
      className={evaluateClassNames({
        [locals.timePresenter]: true,
        [locals.light]: useLightTheme
      })}
    >
      <TimePresenter
        className={locals.time}
        expanded={isOpen}
        timeConfig={timeConfig}
        onClick={toggle}
        refSetter={refSetter}
      />
      <LiveModeToggle isLive={timeConfig.autoRefresh} />
    </div>
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
