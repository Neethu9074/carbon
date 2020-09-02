import React from 'react';

import SelectableItem from 'in-new-components/time/TimeSelectionDialogPresenter/SelectableItem';
import { track, TIME_WINDOW_SIZE_VIA_PICKER } from 'in-services/tracking/tracking';
import { stopPropagationAndPreventDefault } from 'in-services/util/function';
import { formatDurationAccurately } from 'in-services/formatters/date';
import DropdownButton from 'in-new-components/Button/DropdownButton';
import Overlay from 'in-new-components/overlays/Overlay';
import timePresets from 'in-amp/components/timePresets';
import ErrorBoundary from 'in-components/ErrorBoundary';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { setTimeframe } from 'in-stores/timeline';

import locals from './TimeSelection.mless';

export default function TimeSelection() {
  const timeConfig = useTimeConfig();

  return (
    <ErrorBoundary name="amp-time-selection">
      <Overlay
        props={{ timeConfig }}
        content={TimeSelectionDialogPresenterWrapper}
        align="bottomRight"
        withoutWrapper
        withoutArrow
      >
        {TimePresenterWrapper}
      </Overlay>
    </ErrorBoundary>
  );
}

function TimePresenterWrapper({ isOpen, toggle, timeConfig, refSetter }) {
  return (
    <>
      <DropdownButton
        refSetter={refSetter}
        kind="secondary"
        expanded={isOpen}
        onClick={e => {
          stopPropagationAndPreventDefault(e);
          toggle();
        }}
      >
        {formatDurationAccurately(timeConfig.windowSize)}
      </DropdownButton>
    </>
  );
}

function TimeSelectionDialogPresenterWrapper({ timeConfig, close }) {
  return <Presets timeConfig={timeConfig} onChange={onChange} closeOverlay={close} />;

  function onChange(timeConfig) {
    close();
    setTimeframe(timeConfig.windowSize, timeConfig.to);
    track(TIME_WINDOW_SIZE_VIA_PICKER);
  }
}

function Presets({ timeConfig, onChange }) {
  return (
    <div className={locals.wrapper}>
      {timePresets.map((preset, i) => (
        <SelectableItem key={i} timeConfig={timeConfig} newTimeframe={preset} onChange={onChange} hideTimeIcon />
      ))}
    </div>
  );
}
