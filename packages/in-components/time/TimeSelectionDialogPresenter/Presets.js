/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { KeyValue } from '@instana/components';
import { Link } from '@instana/components';

import { getTimePresets, formatRequestedTime } from 'in-components/time/timePresets';
import Section from 'in-components/time/TimeSelectionDialogPresenter/Section';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import { TIME_WINDOW_SIZE_VIA_PICKER } from 'in-services/tracking/tracking';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { setTimeConfig } from 'in-stores/time/config';
import { t } from 'in-i18n';

import locals from './Presets.mless';

export default function Presets({ onChange, closeOverlay }) {
  const { trackCta } = useSegmentTracking();

  return (
    <Section title={t('in-components:time.presetsTitlePresets')}>
      <div className={locals.presetsContainer}>
        {getTimePresets().map(({ label, description, windowSize, to }) => (
          <Preset
            key={label}
            label={label}
            description={description}
            windowSize={windowSize}
            to={to}
            onClick={() => {
              const trackingPayload = formatRequestedTime(to, windowSize);
              trackCta(TIME_WINDOW_SIZE_VIA_PICKER, trackingPayload);
              onChange();
              closeOverlay();
            }}
          />
        ))}
      </div>
    </Section>
  );
}

function Preset({ label, onClick, description, windowSize, to }) {
  const { location, createHref } = useNavigation();
  setTimeConfig(location, {
    windowSize,
    to,
    focusedMoment: to,
    autoRefresh: false
  });

  return (
    <Link className={locals.preset} onClick={onClick} href={createHref(location)} size="sm">
      {description ? <KeyValue label={description} value={label} /> : label}
    </Link>
  );
}
