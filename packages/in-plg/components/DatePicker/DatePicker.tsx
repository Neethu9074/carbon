/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { CarbonButton, Stack } from '@instana/components';
import { useObservable } from '@instana/hooks';

// @ts-expect-error
import TimeSelectionDialogPresenter from 'in-components/time/TimeSelectionDialogPresenter/TimeSelectionDialogPresenter';
import { TIME_WINDOW_SIZE_VIA_PICKER, TIME_LIVE_MODE, track } from 'in-services/tracking/tracking';
import { IconForButton } from 'in-plg/components/IconForButton/IconForButton';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { cloneLocation } from 'in-stores/navigation/routing/clone';
import { timeConfig$, urlQueryKeys } from 'in-stores/time/config';
import ErrorBoundary from 'in-components/ErrorBoundary';
import { Location } from 'in-stores/navigation/types';
import Overlay from 'in-components/overlays/Overlay';
import Tooltip from 'in-components/Tooltip';
import DatePresenter from './DatePresenter';
import { TimeConfig } from 'in-types';
import { t } from 'in-i18n';

import locals from 'in-plg/components/DatePicker/DatePresenter.mless';

export interface DatePickerProps {
  isHidden?: boolean;
  darkTheme: boolean;
  liveModeDisabled?: boolean;
  liveModeDisabledTooltip?: string;
}

export default function DatePicker({
  isHidden,
  darkTheme,
  liveModeDisabled,
  liveModeDisabledTooltip
}: DatePickerProps) {
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
          <DatePresenterWrapper
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

interface DatePresenterWrapperProps {
  isOpen: boolean;
  toggle: () => void;
  timeConfig: TimeConfig;
  darkTheme: boolean;
  refSetter?: React.MutableRefObject<HTMLElement> | ((instance: HTMLElement | null) => void);
  liveModeDisabled?: boolean;
  liveModeDisabledTooltip?: string;
}

function DatePresenterWrapper({
  isOpen,
  toggle,
  timeConfig,
  darkTheme,
  refSetter,
  liveModeDisabled,
  liveModeDisabledTooltip
}: DatePresenterWrapperProps) {
  return (
    <Stack direction="horizontal" gap="disabled">
      <DatePresenter
        expanded={isOpen}
        timeConfig={timeConfig}
        onClick={toggle}
        refSetter={refSetter}
        darkTheme={darkTheme}
      />
      <LiveModeToggle
        isLive={timeConfig.autoRefresh}
        liveModeDisabled={liveModeDisabled}
        liveModeDisabledTooltip={liveModeDisabledTooltip}
      />
    </Stack>
  );
}

interface LiveModeToggleProps {
  isLive: boolean;
  liveModeDisabled?: boolean;
  liveModeDisabledTooltip?: string;
}

function LiveModeToggle({ isLive: isLiveProp, liveModeDisabled, liveModeDisabledTooltip }: LiveModeToggleProps) {
  const { location, createHref } = useNavigation();
  const { trackCta } = useSegmentTracking();

  const isLive = liveModeDisabled ? false : isLiveProp;
  const href = createHref(isLive ? getTimeframeNonLiveLocation(location) : getTimeframeLiveLocation(location));

  const icon = isLive ? 'lib_actions_stop' : 'lib_actions_play';

  return (
    <Tooltip content={liveModeDisabledTooltip}>
      <CarbonButton
        disabled={liveModeDisabled}
        id="live-mode-button"
        className={locals.liveButtonWrapper}
        href={href}
        renderIcon={() => <IconForButton icon={icon} iconSize="xs" />}
        kind="tertiary"
        onClick={(e: { stopPropagation: () => void }) => {
          e.stopPropagation();
          return !isLive && trackCta(TIME_LIVE_MODE);
        }}
      >
        {t('in-components:time.dashboardHeaderButtonLive')}
      </CarbonButton>
    </Tooltip>
  );
}

interface TimeSelectionDialogPresenterWrapperProps {
  timeConfig: TimeConfig;
  close: any;
}

function TimeSelectionDialogPresenterWrapper({ timeConfig, close }: TimeSelectionDialogPresenterWrapperProps) {
  const { location, navigate } = useNavigation();

  return <TimeSelectionDialogPresenter timeConfig={timeConfig} onChange={onChange} closeOverlay={close} />;

  function onChange(timeConfig: TimeConfig) {
    close();
    track(TIME_WINDOW_SIZE_VIA_PICKER, {});

    if (timeConfig) {
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
