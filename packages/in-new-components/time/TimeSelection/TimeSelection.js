import { just } from 'reactive-observables';
import React from 'react';

import {
  getTimeframeNonLiveUrl,
  getTimeframeLiveUrl,
  setTimeframe,
  setFocusedMoment,
  timeConfig$
} from 'in-stores/timeline';
import TimeSelectionDialogPresenter from 'in-new-components/time/TimeSelectionDialogPresenter';
import { containsPastLiveData$ } from 'in-subscription/application/containsPastLiveData';
import { track, TIME_WINDOW_SIZE_VIA_PICKER } from 'in-services/tracking/tracking';
import { getSamplingLevel$ } from 'in-subscription/application/getSamplingLevel';
import { isApplicationsView } from 'in-applications/navigation/paths';
import { samplingIndicatorEnabled } from 'in-services/featureFlags';
import { evaluateClassNames } from 'in-services/util/classnames';
import { getSamplingLevel$ } from 'in-subscription/application/getSamplingLevel';
import { isApplicationsView } from 'in-applications/navigation/paths';
import { samplingIndicatorEnabled } from 'in-services/featureFlags';
import TimePresenter from 'in-new-components/time/TimePresenter';
import { isAnalyzeView } from 'in-analyze/navigation/paths';
import ToggleButton from 'in-new-components/ToggleButton';
import { isView } from 'in-stores/navigation/navigation';
import Overlay from 'in-new-components/overlays/Overlay';
import ErrorBoundary from 'in-components/ErrorBoundary';
import { just } from 'reactive-observables';
import connect from 'in-hoc/connectTo';

import locals from './TimeSelection.mless';

const largeDataSupportedViews = [isApplicationsView, isAnalyzeView];

export const historicOrLargeDataResult$ = timeConfig$.flatMap(timeConfig =>
  containsPastLiveData$(timeConfig)
    .flatMap(
      containsPastLiveData =>
        containsPastLiveData
          ? // if the selected timeframe contains historic data,
            // there's no need to query for the sampling level
            just({
              containsPastLiveData: true
            })
          : // if not, query the sampling level on large data supported views
            isView.apply(this, largeDataSupportedViews).flatMap(
              supportLargeData =>
                supportLargeData
                  ? getSamplingLevel$(timeConfig).flatMap(samplingLevel =>
                      just({
                        containsPastLiveData: false,
                        samplingLevel
                      })
                    )
                  : just({
                      containsPastLiveData: false
                    })
            )
    )
    .startWith(false)
);

export default connect({
  timeConfig: timeConfig$,
  historicOrLargeDataResult: samplingIndicatorEnabled ? historicOrLargeDataResult$ : just({})
})(TimeSelection);

function TimeSelection({ timeConfig, historicOrLargeDataResult, isHidden, darkTheme }) {
  if (isHidden) {
    return null;
  }

  return (
    <ErrorBoundary name="time-selection">
      <Overlay
        props={{ timeConfig, historicOrLargeDataResult, darkTheme }}
        content={TimeSelectionDialogPresenterWrapper}
        withoutWrapper
        withoutArrow
      >
        {TimePresenterWrapper}
      </Overlay>
    </ErrorBoundary>
  );
}

function TimePresenterWrapper({ isOpen, toggle, timeConfig, historicOrLargeDataResult, darkTheme, refSetter }) {
  const { containsPastLiveData, samplingLevel } = historicOrLargeDataResult;
  const largeData = samplingLevel && samplingLevel.samplingRatio < 1;
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
        historicData={containsPastLiveData}
        largeData={largeData}
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
