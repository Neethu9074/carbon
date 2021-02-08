/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import useSettingsEditor from 'in-settings/tabs/UserSettings/pages/useSettingsEditor';
import HorizontalFormGroup from 'in-settings/components/HorizontalFormGroup';
import SettingsDetailPage from 'in-settings/components/SettingsDetailPage';
import { languageSelectorEnabled } from 'in-services/featureFlags';
import Heading from 'in-settings/tabs/UserSettings/pages/Heading';
import SubViewHeader from 'in-settings/components/SubViewHeader';
import SectionLine from 'in-settings/components/SectionLine';
import { saveUserSettings } from 'in-services/userSettings';
import ComboBox from 'in-components/ComboBox/ComboBox';
import Toggle from 'in-components/form/Toggle';
import { activeLanguage } from 'in-i18n';
import Title from 'in-components/Title';

import locals from './UiConfig.mless';

export default function UiConfigGeneralPage() {
  const [settings, saveSetting] = useSettingsEditor();

  if (!settings) {
    return null;
  }

  return (
    <SettingsDetailPage>
      <Title title="User Interface Settings" />
      <SubViewHeader>User Interface Settings</SubViewHeader>
      <SectionLine />
      <HorizontalFormGroup
        helpText="We will inform you about upcoming Instana server maintenance via small flyouts in the top-right
        corner. Sometimes though, these flyouts can disturb your workflow. Untick this checkbox to permanently hide
        maintenance notes."
      >
        <Heading text="Show maintenance notes" htmlFor="maintenance-notes" />
        <Toggle
          id="maintenance-notes"
          checked={settings['showMaintenanceNotes']}
          onChange={e => saveSetting('showMaintenanceNotes', e.target.checked)}
        />
      </HorizontalFormGroup>
      <HorizontalFormGroup helpText="Toggle the quality of chart rendering. Disable this to have fluent chart animations on slower systems.">
        <Heading text="High quality chart rendering" htmlFor="chart-quality" />
        <Toggle
          id="chart-quality"
          checked={settings['charts_adaptToDevicePixelRatio']}
          onChange={e => saveSetting('charts_adaptToDevicePixelRatio', e.target.checked)}
        />
      </HorizontalFormGroup>
      <HorizontalFormGroup
        helpText={
          <span>
            <span className={locals.warning}>
              Requires browser refresh to become active.
              <br />
            </span>
            Define how often tables with live metrics should be refreshed. Ranges from once per second to once every ten
            seconds. Current refresh rate is once every {settings['tables_refreshRate'] / 1000} second(s).
          </span>
        }
        isWarning
      >
        <Heading text={`Table refresh rate (${settings['tables_refreshRate'] / 1000}s)`} htmlFor="table-refresh-rate" />
        <input
          type="range"
          id="table-refresh-rate"
          min={1000}
          max={10000}
          step={1000}
          value={settings['tables_refreshRate']}
          onChange={e => saveSetting('tables_refreshRate', e.target.value)}
        />
      </HorizontalFormGroup>
      <HorizontalFormGroup
        helpText={<span className={locals.warning}>Requires browser refresh to become active.</span>}
        isWarning
      >
        <Heading text="Format time according to UTC" htmlFor="format-time" />
        <Toggle
          id="format-time"
          checked={settings['formatTimestampsAsUtc']}
          onChange={e => saveSetting('formatTimestampsAsUtc', e.target.checked)}
        />
      </HorizontalFormGroup>
      <HorizontalFormGroup
        helpText={
          <span>
            <span className={locals.warning}>Requires browser refresh to become active.</span>
            <br />
            By default we will attempt to format numbers in your preferred locale
            {`'`}s format. By checking this, you can force an <code>en-US</code> number format.
          </span>
        }
        isWarning
      >
        <Heading text="Format numbers in en-US format" htmlFor="format-numbers" />
        <Toggle
          id="format-numbers"
          checked={settings['formatNumbersAccordingToEnUs'] || false}
          onChange={e => saveSetting('formatNumbersAccordingToEnUs', e.target.checked)}
        />
      </HorizontalFormGroup>
      {languageSelectorEnabled && (
        <HorizontalFormGroup noHelpTextSpacer>
          <Heading text="Language" htmlFor="language" />
          <ComboBox
            name="language"
            value={activeLanguage}
            options={[
              { value: 'en-US', label: 'English' }
              // TODO: Activate once supported { value: 'de-DE', label: 'Deutsch' }
              // TODO: add more languages here
            ]}
            onChange={e => saveUserSettings({ preferredLanguage: e.value }, () => window.location.reload())}
            clearable={false}
          />
        </HorizontalFormGroup>
      )}
    </SettingsDetailPage>
  );
}
