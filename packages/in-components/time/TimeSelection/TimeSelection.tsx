/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { useObservable } from '@instana/hooks';

// @ts-expect-error
import TimeSelectionDialogPresenter from 'in-components/time/TimeSelectionDialogPresenter/TimeSelectionDialogPresenter';
// @ts-expect-error
import DashboardHeaderButton from 'in-components/DashboardHeader/DashboardHeaderButton';
import { TIME_WINDOW_SIZE_VIA_PICKER, TIME_LIVE_MODE } from 'in-services/tracking/tracking';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { cloneLocation } from 'in-stores/navigation/routing/clone';
import { timeConfig$, urlQueryKeys } from 'in-stores/time/config';
import { carbonButtonEnabled } from 'in-services/featureFlags';
import TimePresenter from 'in-components/time/TimePresenter';
import ErrorBoundary from 'in-components/ErrorBoundary';
import { Location } from 'in-stores/navigation/types';
import Overlay from 'in-components/overlays/Overlay';
import { formatRequestedTime } from '../timePresets';
import Tooltip from 'in-components/Tooltip';
import { TimeConfig } from 'in-types';
import { t } from 'in-i18n';

import locals from './TimeSelection.mless';

export interface TimeSelectionProps {
  isHidden?: boolean;
  darkTheme: boolean;
  liveModeDisabled?: boolean;
  liveModeDisabledTooltip?: string;
}

export default function TimeSelection({
  isHidden,
  darkTheme,
  liveModeDisabled,
  liveModeDisabledTooltip
}: TimeSelectionProps) {
  // NOTE: this specifically needs to grab the user selected timeConfig from in-stores/time/config
  // instead of the default useTimeConfig, because the analyze view employs a fixed timeConfig context,
  // but needs to still show the original user selection
  const timeConfig = useObservable(timeConfig$, []);

  if (isHidden || !timeConfig) {
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
            liveModeDisabled={liveModeDisabled}
            liveModeDisabledTooltip={liveModeDisabledTooltip}
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
  liveModeDisabled?: boolean;
  liveModeDisabledTooltip?: string;
}

function TimePresenterWrapper({
  isOpen,
  toggle,
  timeConfig,
  darkTheme,
  refSetter,
  liveModeDisabled,
  liveModeDisabledTooltip
}: TimePresenterWrapperProps) {
  return (
    <>
      <TimePresenter
        expanded={isOpen}
        timeConfig={timeConfig}
        onClick={toggle}
        refSetter={refSetter}
        darkTheme={darkTheme}
      />
      <LiveModeToggle
        isLive={timeConfig.autoRefresh}
        darkTheme={darkTheme}
        liveModeDisabled={liveModeDisabled}
        liveModeDisabledTooltip={liveModeDisabledTooltip}
      />
    </>
  );
}

interface LiveModeToggleProps {
  isLive: boolean;
  darkTheme: boolean;
  liveModeDisabled?: boolean;
  liveModeDisabledTooltip?: string;
}

function LiveModeToggle({
  isLive: isLiveProp,
  darkTheme,
  liveModeDisabled,
  liveModeDisabledTooltip
}: LiveModeToggleProps) {
  const { location, createHref } = useNavigation();

  const { trackCta } = useSegmentTracking();

  const isLive = liveModeDisabled ? false : isLiveProp;
  const href = createHref(isLive ? getTimeframeNonLiveLocation(location) : getTimeframeLiveLocation(location));

  const icon = isLive ? 'lib_actions_stop' : 'lib_actions_play';

  return (
    <Tooltip align="bottomRight" content={liveModeDisabledTooltip}>
      <DashboardHeaderButton
        disabled={liveModeDisabled}
        id="live-mode-button"
        href={href}
        icon={icon}
        darkTheme={darkTheme}
        className={carbonButtonEnabled ? undefined : isLive ? locals.live : locals.static}
        onClick={() => !isLive && trackCta(TIME_LIVE_MODE)}
      >
        {t('in-components:time.dashboardHeaderButtonLive')}
      </DashboardHeaderButton>
    </Tooltip>
  );
}

interface TimeSelectionDialogPresenterWrapperProps {
  timeConfig: TimeConfig;
  close: any;
}

function TimeSelectionDialogPresenterWrapper({ timeConfig, close }: TimeSelectionDialogPresenterWrapperProps) {
  const { location, navigate } = useNavigation();
  const { trackCta } = useSegmentTracking();

  return <TimeSelectionDialogPresenter timeConfig={timeConfig} onChange={onChange} closeOverlay={close} />;

  function onChange(timeConfig: TimeConfig) {
    close();
    if (timeConfig) {
      const trackingPayload = formatRequestedTime(timeConfig.to, timeConfig.windowSize);
      trackCta(TIME_WINDOW_SIZE_VIA_PICKER, trackingPayload);
      navigate(setTimeframe(timeConfig.windowSize, timeConfig.to, location));
    }
  }
}

function setTimeframe(windowSize: number, to: number | null | undefined = null, location: Location): Location {
  if (to != null) {
    location.query[urlQueryKeys.to] = `${to}`;
    location.query[urlQueryKeys.focusedMoment] = `${to}`;
  } else {
    location.query[urlQueryKeys.to] = to;
    location.query[urlQueryKeys.focusedMoment] = to;
  }
  location.query[urlQueryKeys.windowSize] = `${windowSize}`;
  return location;
}

function getTimeframeNonLiveLocation(currentLocation: Location): Location {
  const targetLocation = cloneLocation(currentLocation);
  delete targetLocation.query.fm;
  targetLocation.query[urlQueryKeys.autoRefresh] = 'false';
  return targetLocation;
}

function getTimeframeLiveLocation(currentLocation: Location): Location {
  const targetLocation = cloneLocation(currentLocation);
  delete targetLocation.query.fm;
  targetLocation.query[urlQueryKeys.to] = '';
  targetLocation.query[urlQueryKeys.focusedMoment] = '';
  targetLocation.query[urlQueryKeys.autoRefresh] = 'true';
  return targetLocation;
}
