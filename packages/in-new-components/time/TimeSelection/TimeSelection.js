/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState } from 'react';

import { just } from '@instana/observables';

import TimeSelectionDialogPresenter from 'in-new-components/time/TimeSelectionDialogPresenter';
import DashboardHeaderButton from 'in-new-components/DashboardHeader/DashboardHeaderButton';
import { isAnalyzeView as isAnalyzeApplicationsView } from 'in-analyze/navigation/paths';
import { track, TIME_WINDOW_SIZE_VIA_PICKER } from 'in-services/tracking/tracking';
import { getModifiedUrlStream, mutateUrl } from 'in-stores/navigation/navigation';
import { isApplicationsView } from 'in-applications/navigation/paths';
import { samplingIndicatorEnabled } from 'in-services/featureFlags';
import getRetention from 'in-subscription/application/getRetention';
import { isMobileAppsView } from 'in-mobile-apps/navigation/paths';
import { timeConfig$, urlQueryKeys } from 'in-stores/time/config';
import TimePresenter from 'in-new-components/time/TimePresenter';
import { isWebsitesView } from 'in-websites/navigation/paths';
import { isView } from 'in-stores/navigation/navigation';
import Overlay from 'in-new-components/overlays/Overlay';
import ErrorBoundary from 'in-components/ErrorBoundary';
import { emptyObject } from 'in-services/fixedObjects';
import connect from 'in-hoc/connectTo';
import { t } from 'in-i18n';

import locals from './TimeSelection.mless';

export function getHistoricOrLargeDataResult(timeConfig) {
  if (!samplingIndicatorEnabled) {
    return just({});
  }

  return isView(isApplicationsView, isAnalyzeApplicationsView, isWebsitesView, isMobileAppsView).flatMap(
    supportsHistoricData => {
      if (!supportsHistoricData) {
        return just({});
      }

      return getRetention({ timeConfig })
        .map(result => result?.data)
        .filter(Boolean);
    }
  );
}

export const historicOrLargeDataResult$ = timeConfig$.flatMap(timeConfig => getHistoricOrLargeDataResult(timeConfig));

export default connect({
  timeConfig: timeConfig$,
  historicOrLargeDataResult: historicOrLargeDataResult$
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
      {t('in-new-components:time.dashboardHeaderButtonLive')}
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

function setTimeframe(windowSize, to = null) {
  mutateUrl(navParams => {
    navParams.query[urlQueryKeys.to] = to;
    navParams.query[urlQueryKeys.focusedMoment] = to;
    navParams.query[urlQueryKeys.windowSize] = windowSize;
    return navParams;
  });
}

function getTimeframeNonLiveUrl() {
  return getModifiedUrlStream(navParams => {
    delete navParams.query.fm;
    navParams.query[urlQueryKeys.autoRefresh] = 'false';
  });
}

function getTimeframeLiveUrl() {
  return getModifiedUrlStream(navParams => {
    delete navParams.query.fm;
    navParams.query[urlQueryKeys.to] = '';
    navParams.query[urlQueryKeys.focusedMoment] = '';
    navParams.query[urlQueryKeys.autoRefresh] = 'true';
  });
}
