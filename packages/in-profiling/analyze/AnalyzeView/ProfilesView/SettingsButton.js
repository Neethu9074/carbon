/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Spacer, Ul, Li, KeyValue, Toggle, Button } from '@instana/components';

import DebouncedDistinctSlider from 'in-components/Slider/DebouncedDistinctSlider';
import { percentage } from 'in-services/formatters/number';
import Overlay from 'in-components/overlays/Overlay';
import { t } from 'in-i18n';

import locals from './SettingsButton.mless';

export default function SettingsButton(props) {
  return (
    <Overlay align="bottomMiddle" content={SettingsContent} props={props}>
      {({ toggle }) => (
        <Button size="compact" kind="secondary" icon="lib_actions_settings" onClick={toggle}>
          {t('in-profiling:settings')}
        </Button>
      )}
    </Overlay>
  );
}

function SettingsContent({
  threshold,
  setThreshold,
  showGraph,
  setShowGraph,
  selfTimeHighlighted,
  setSelfTimeHighlighted
}) {
  return (
    <Ul className={locals.overlayContent} framed={false}>
      <Li>
        <KeyValue
          className={locals.keyValue}
          value={t('in-profiling:threshold')}
          label={
            <div>
              <div>{t('in-profiling:onlyShowMethodAboveThisThreshold')}</div>
            </div>
          }
          accentuated
          inverted
        />
        <div className={locals.thresholdSliderWrapper}>
          <DebouncedDistinctSlider
            valueLabelDisplay={t('in-profiling:on')}
            valueLabelFormat={v => percentage.detailed(v / 100)}
            marks={[0, 20, 40, 60, 80, 100].map(value => ({ value, label: percentage.compact(value / 100) }))}
            min={0}
            max={100}
            step={0.1}
            value={threshold}
            onChange={setThreshold}
          />
        </div>
      </Li>
      <Li>
        <KeyValue
          value={t('in-profiling:highlightSelfCpu')}
          label={t('in-profiling:onFlameGraphHighlightTimeSpentOnMethodsThemselves')}
          accentuated
          inverted
        />
        <Spacer horizontal="xxsmall" />
        <Toggle checked={selfTimeHighlighted} onToggle={() => setSelfTimeHighlighted(!selfTimeHighlighted)} />
      </Li>
      <Li>
        <KeyValue value={t('in-profiling:cpuGraph')} label={t('in-profiling:showCpuOverTime')} accentuated inverted />
        <Spacer horizontal="xxsmall" />
        <Toggle checked={showGraph} onChange={() => setShowGraph(!showGraph)} />
      </Li>
    </Ul>
  );
}
