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
import { TIME_WINDOW_SIZE_VIA_PICKER, TIME_LIVE_MODE, track } from 'in-services/tracking/tracking';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { cloneLocation } from 'in-stores/navigation/routing/clone';
import { timeConfig$, urlQueryKeys } from 'in-stores/time/config';
import TimePresenter from 'in-components/time/TimePresenter';
import ErrorBoundary from 'in-components/ErrorBoundary';
import { logsPath } from 'in-logging/navigation/paths';
import { Location } from 'in-stores/navigation/types';
import Overlay from 'in-components/overlays/Overlay';
import Tooltip from 'in-components/Tooltip';
import { TimeConfig } from 'in-types';
import { t } from 'in-i18n';

import locals from './TimeSelection.mless';

export interface TimeSelectionProps {
  isHidden?: boolean;
  darkTheme: boolean;
}

export default function TimeSelection({ isHidden, darkTheme }: TimeSelectionProps) {
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

const liveModeDisabledAreas: Record<string, string> = {
  [logsPath]: t('in-logging:liveModeDisabled')
};

const checkIsLiveModeDisabled = (location: Location): { disabled: boolean; tooltipMessage?: string } => {
  let disabledArea = Object.keys(location.matrix ?? {}).find(path => Object.keys(liveModeDisabledAreas).includes(path));

  if (disabledArea === undefined) {
    return { disabled: false };
  }

  return { disabled: true, tooltipMessage: liveModeDisabledAreas[disabledArea] };
};

function LiveModeToggle({ isLive: isLiveProp, darkTheme }: LiveModeToggleProps) {
  const { location, createHref } = useNavigation();
  const { disabled, tooltipMessage } = checkIsLiveModeDisabled(location);

  const isLive = disabled ? false : isLiveProp;
  const href = createHref(isLive ? getTimeframeNonLiveLocation(location) : getTimeframeLiveLocation(location));

  const icon = isLive ? 'lib_actions_stop' : 'lib_actions_play';

  return (
    <Tooltip content={tooltipMessage}>
      <DashboardHeaderButton
        disabled={disabled}
        id="live-mode-button"
        href={href}
        icon={icon}
        darkTheme={darkTheme}
        className={isLive ? locals.live : locals.static}
        onClick={() => !isLive && track(TIME_LIVE_MODE)}
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
