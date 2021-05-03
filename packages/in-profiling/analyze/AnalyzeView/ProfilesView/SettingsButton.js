/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Button } from '@instana/components';

import DebouncedDistinctSlider from 'in-new-components/Slider/DebouncedDistinctSlider';
import { percentage } from 'in-services/formatters/number';
import Overlay from 'in-new-components/overlays/Overlay';
import KeyValue from 'in-new-components/lists/KeyValue';
import { Ul, Li } from 'in-new-components/lists/List';
import Toggle from 'in-components/form/Toggle';
import { t } from 'in-i18n';

import locals from './SettingsButton.mless';

export default function SettingsButton(props) {
  return (
    <Overlay align="bottomMiddle" content={SettingsContent} props={props}>
      {({ toggle }) => (
        <Button kind="secondary" icon="lib_actions_settings" onClick={toggle}>
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
              <div>{t('in-profiling:onlyShowMethod')}</div>
              <div>{t('in-profiling:aboveThisThreshold')}</div>
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
        <Toggle checked={selfTimeHighlighted} onChange={() => setSelfTimeHighlighted(!selfTimeHighlighted)} />
      </Li>
      <Li>
        <KeyValue value={t('in-profiling:cpuGraph')} label={t('in-profiling:showCpuOverTime')} accentuated inverted />
        <Toggle checked={showGraph} onChange={() => setShowGraph(!showGraph)} />
      </Li>
    </Ul>
  );
}
