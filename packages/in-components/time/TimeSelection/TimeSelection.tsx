/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState } from 'react';

// @ts-expect-error
import TimeSelectionDialogPresenter from 'in-components/time/TimeSelectionDialogPresenter/TimeSelectionDialogPresenter';
// @ts-expect-error
import DashboardHeaderButton from 'in-components/DashboardHeader/DashboardHeaderButton';
import { TIME_WINDOW_SIZE_VIA_PICKER, track } from 'in-services/tracking/tracking';
import { getModifiedUrlStream, mutateUrl } from 'in-stores/navigation/navigation';
// @ts-expect-error
import ErrorBoundary from 'in-components/ErrorBoundary';
import { timeConfig$, urlQueryKeys } from 'in-stores/time/config';
import TimePresenter from 'in-components/time/TimePresenter';
// @ts-expect-error
import connect from 'in-hoc/connectTo';
import Overlay from 'in-components/overlays/Overlay';
import { TimeConfig } from 'in-types';
import { t } from 'in-i18n';

import locals from './TimeSelection.mless';

export default connect({
  timeConfig: timeConfig$
})(TimeSelection);

export interface TimeSelectionProps {
  timeConfig: TimeConfig;
  isHidden: boolean;
  darkTheme: boolean;
}

function TimeSelection({ timeConfig, isHidden, darkTheme }: TimeSelectionProps) {
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
        align="topRight"
        forceConfiguredAlignment
      >
        {({ toggle, refSetter, isOpen }) => (
          <TimePresenterWrapper
            isOpen={isOpen}
            toggle={toggle}
            timeConfig={timeConfig}
            darkTheme={darkTheme}
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
  darkTheme: boolean;
  refSetter?: React.MutableRefObject<HTMLElement> | ((instance: HTMLElement | null) => void);
}

function TimePresenterWrapper({ isOpen, toggle, timeConfig, darkTheme, refSetter }: TimePresenterWrapperProps) {
  return (
    <>
      <TimePresenter
        expanded={isOpen}
        timeConfig={timeConfig}
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
}

function TimeSelectionDialogPresenterWrapper({ timeConfig, close }: TimeSelectionDialogPresenterWrapperProps) {
  return <TimeSelectionDialogPresenter timeConfig={timeConfig} onChange={onChange} closeOverlay={close} />;

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
