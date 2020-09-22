import React from 'react';

import Secion from 'in-new-components/time/TimeSelectionDialogPresenter/Section';
import { getModifiedUrlStream } from 'in-stores/navigation/navigation';
import { getTimePresets } from 'in-new-components/time/timePresets';
import KeyValue from 'in-new-components/lists/KeyValue';
import { setTimeConfig } from 'in-stores/time/config';
import Link from 'in-components/Link';

import locals from './Presets.mless';

export default function Presets({ onChange, closeOverlay }) {
  return (
    <Secion title="Presets">
      <div className={locals.presetsContainer}>
        {getTimePresets().map(({ label, description, windowSize, to }) => (
          <Preset
            key={label}
            label={label}
            description={description}
            windowSize={windowSize}
            to={to}
            onClick={() => {
              onChange();
              closeOverlay();
            }}
          />
        ))}
      </div>
    </Secion>
  );
}

function Preset({ label, onClick, description, windowSize, to }) {
  return (
    <Link
      className={locals.preset}
      onClick={onClick}
      href$={getModifiedUrlStream(params => {
        setTimeConfig(params, {
          windowSize,
          to,
          focusedMoment: to,
          autoRefresh: false
        });
      })}
    >
      {description ? <KeyValue label={description} value={label} /> : label}
    </Link>
  );
}
