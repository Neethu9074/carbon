/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState } from 'react';

import { just, Observable } from '@instana/observables';

// @ts-expect-error
import TimeSelectionDialogPresenter from 'in-components/time/TimeSelectionDialogPresenter';
// @ts-expect-error
import { isAnalyzeView as isAnalyzeApplicationsView } from 'in-analyze/navigation/paths';
// @ts-expect-error
import DashboardHeaderButton from 'in-components/DashboardHeader/DashboardHeaderButton';
import { getModifiedUrlStream, isView, mutateUrl } from 'in-stores/navigation/navigation';
// @ts-expect-error
import { isApplicationsView } from 'in-applications/navigation/paths';
// @ts-expect-error
import { isMobileAppsView } from 'in-mobile-apps/navigation/paths';
import { TIME_WINDOW_SIZE_VIA_PICKER, track } from 'in-services/tracking/tracking';
// @ts-expect-error
import { isWebsitesView } from 'in-websites/navigation/paths';
// @ts-expect-error
import ErrorBoundary from 'in-components/ErrorBoundary';
import getRetention from 'in-applications/subscriptions/getRetention';
import { timeConfig$, urlQueryKeys } from 'in-stores/time/config';
import { GetRetentionResult, Result, TimeConfig } from 'in-types';
import TimePresenter from 'in-components/time/TimePresenter';
// @ts-expect-error
import connect from 'in-hoc/connectTo';
import { emptyObject } from 'in-services/fixedObjects';
import Overlay from 'in-components/overlays/Overlay';
import { t } from 'in-i18n';

import locals from './TimeSelection.mless';

export function getHistoricOrLargeDataResult(timeConfig: TimeConfig): Observable<GetRetentionResult | {} | undefined> {
  return isView(isApplicationsView, isAnalyzeApplicationsView, isWebsitesView, isMobileAppsView).flatMap(
    supportsHistoricData => {
      if (!supportsHistoricData) {
        return just({});
      }

      return getRetention({ timeConfig })
        .map((result: Result<GetRetentionResult>) => result?.data)
        .filter(Boolean);
    }
  );
}

export const historicOrLargeDataResult$ = timeConfig$.flatMap(timeConfig => getHistoricOrLargeDataResult(timeConfig));

export default connect({
  timeConfig: timeConfig$,
  historicOrLargeDataResult: historicOrLargeDataResult$
})(TimeSelection);

export interface TimeSelectionProps {
  timeConfig: TimeConfig;
  historicOrLargeDataResult: any;
  isHidden: boolean;
  showHistoricDataWarning: boolean;
  darkTheme: boolean;
}

function TimeSelection({
  timeConfig,
  historicOrLargeDataResult,
  isHidden,
  showHistoricDataWarning,
  darkTheme
}: TimeSelectionProps) {
  if (isHidden) {
    return null;
  }
  return (
    <ErrorBoundary name="time-selection">
      <Overlay
        props={{ timeConfig, historicOrLargeDataResult, darkTheme, showHistoricDataWarning }}
        content={TimeSelectionDialogPresenterWrapper}
        withoutWrapper
        withoutArrow
        align="topRight"
        forceConfiguredAlignment
      >
        {({ toggle, refSetter, isOpen }) => (
          <TimePresenterWrapper
            isOpen={isOpen}
            toggle={toggle}
            timeConfig={timeConfig}
            historicOrLargeDataResult={historicOrLargeDataResult}
            darkTheme={darkTheme}
            showHistoricDataWarning={showHistoricDataWarning}
            refSetter={refSetter}
          />
        )}
      </Overlay>
    </ErrorBoundary>
  );
}

interface TimePresenterWrapperProps {
  isOpen: boolean;
  toggle: () => void;
  timeConfig: TimeConfig;
  historicOrLargeDataResult: any;
  showHistoricDataWarning: boolean;
  darkTheme: boolean;
  refSetter?: React.MutableRefObject<HTMLElement> | ((instance: HTMLElement | null) => void);
}

function TimePresenterWrapper({
  isOpen,
  toggle,
  timeConfig,
  historicOrLargeDataResult,
  showHistoricDataWarning,
  darkTheme,
  refSetter
}: TimePresenterWrapperProps) {
  const { containsHistoricData, retention, samplingLevel } = historicOrLargeDataResult || emptyObject;
  const largeData = samplingLevel && samplingLevel.samplingRatio < 1;
  return (
    <>
      <TimePresenter
        expanded={isOpen}
        timeConfig={timeConfig}
        historicData={containsHistoricData}
        showHistoricDataWarning={showHistoricDataWarning}
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

interface LiveModeToggleProps {
  isLive: boolean;
  darkTheme: boolean;
}

function LiveModeToggle({ isLive, darkTheme }: LiveModeToggleProps) {
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
      {t('in-components:time.dashboardHeaderButtonLive')}
    </DashboardHeaderButton>
  );
}

interface TimeSelectionDialogPresenterWrapperProps {
  timeConfig: TimeConfig;
  close: any;
  historicOrLargeDataResult: boolean;
  showHistoricDataWarning: boolean;
}

function TimeSelectionDialogPresenterWrapper({
  timeConfig,
  close,
  historicOrLargeDataResult,
  showHistoricDataWarning
}: TimeSelectionDialogPresenterWrapperProps) {
  return (
    <TimeSelectionDialogPresenter
      timeConfig={timeConfig}
      onChange={onChange}
      closeOverlay={close}
      historicOrLargeDataResult={historicOrLargeDataResult}
      showHistoricDataWarning={showHistoricDataWarning}
    />
  );

  function onChange(timeConfig: TimeConfig) {
    close();
    track(TIME_WINDOW_SIZE_VIA_PICKER, {});

    if (timeConfig) {
      setTimeframe(timeConfig.windowSize, timeConfig.to);
    }
  }
}

function setTimeframe(windowSize: number, to: number | null | undefined = null) {
  mutateUrl(navParams => {
    if (to != null) {
      navParams.query[urlQueryKeys.to] = `${to}`;
      navParams.query[urlQueryKeys.focusedMoment] = `${to}`;
    } else {
      navParams.query[urlQueryKeys.to] = to;
      navParams.query[urlQueryKeys.focusedMoment] = to;
    }
    navParams.query[urlQueryKeys.windowSize] = `${windowSize}`;
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
