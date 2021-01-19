/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { just } from '@instana/observables';
import React, { useState } from 'react';

import { getTimeframeNonLiveUrl, getTimeframeLiveUrl, setTimeframe, timeConfig$ } from 'in-stores/timeline';
import TimeSelectionDialogPresenter from 'in-new-components/time/TimeSelectionDialogPresenter';
import DashboardHeaderButton from 'in-new-components/DashboardHeader/DashboardHeaderButton';
import { track, TIME_WINDOW_SIZE_VIA_PICKER } from 'in-services/tracking/tracking';
import getSamplingLevel from 'in-subscription/application/getSamplingLevel';
import { isApplicationsView } from 'in-applications/navigation/paths';
import { samplingIndicatorEnabled } from 'in-services/featureFlags';
import getRetention from 'in-subscription/application/getRetention';
import TimePresenter from 'in-new-components/time/TimePresenter';
import { isAnalyzeView } from 'in-analyze/navigation/paths';
import { isView } from 'in-stores/navigation/navigation';
import Overlay from 'in-new-components/overlays/Overlay';
import ErrorBoundary from 'in-components/ErrorBoundary';
import { emptyObject } from 'in-services/fixedObjects';
import connect from 'in-hoc/connectTo';

import locals from './TimeSelection.mless';

export const historicOrLargeDataResult$ = timeConfig$.flatMap(timeConfig =>
  getRetention({ timeConfig })
    .map(result => result?.data)
    .filter(Boolean)
    .flatMap(data => {
      if (data.containsHistoricData) {
        // if the selected timeframe contains historic data,
        // there's no need to query for the sampling level
        return just(data);
      }

      // if not, query the sampling level on large data supported views
      return isView(isApplicationsView, isAnalyzeView).flatMap(supportsLargeData => {
        if (!supportsLargeData) {
          return just(data);
        }

        return getSamplingLevel({ timeConfig }).map(result => ({
          ...data,
          samplingLevel: result?.data
        }));
      });
    })
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
  const { containsHistoricData, retention, samplingLevel } = historicOrLargeDataResult || emptyObject;
  const largeData = samplingLevel && samplingLevel.samplingRatio < 1;
  return (
    <>
      <TimePresenter
        expanded={isOpen}
        timeConfig={timeConfig}
        historicData={containsHistoricData}
        retention={retention}
        largeData={largeData}
        onClick={toggle}
        refSetter={refSetter}
        darkTheme={darkTheme}
      />
      <LiveModeToggle isLive={timeConfig.autoRefresh} darkTheme={darkTheme} />
    </>
  );
}

function LiveModeToggle({ isLive, darkTheme }) {
  const [hover, setHover] = useState(false);
  const href$ = isLive ? getTimeframeNonLiveUrl() : getTimeframeLiveUrl();

  let icon;
  let iconSpinning = false;
  if (isLive) {
    if (hover) {
      icon = 'lib_actions_stop';
    } else {
      icon = 'lib_actions_loading';
      iconSpinning = true;
    }
  } else {
    icon = 'lib_actions_play';
  }

  return (
    <DashboardHeaderButton
      href$={href$}
      icon={icon}
      iconSpinning={iconSpinning}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      darkTheme={darkTheme}
      className={isLive ? locals.live : locals.static}
    >
      Live
    </DashboardHeaderButton>
  );
}

function TimeSelectionDialogPresenterWrapper({ timeConfig, close, historicOrLargeDataResult }) {
  return (
    <TimeSelectionDialogPresenter
      timeConfig={timeConfig}
      onChange={onChange}
      closeOverlay={close}
      historicOrLargeDataResult={historicOrLargeDataResult}
    />
  );

  function onChange(timeConfig) {
    close();
    track(TIME_WINDOW_SIZE_VIA_PICKER);

    if (timeConfig) {
      setTimeframe(timeConfig.windowSize, timeConfig.to);
    }
  }
}
