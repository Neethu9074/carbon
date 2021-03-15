/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import useSettingsEditor from 'in-settings/tabs/UserSettings/pages/useSettingsEditor';
import HorizontalFormGroup from 'in-settings/components/HorizontalFormGroup';
import SettingsDetailPage from 'in-settings/components/SettingsDetailPage';
import { t, Trans, supportedLanguages, activeLanguage } from 'in-i18n';
import { languageSelectorEnabled } from 'in-services/featureFlags';
import Heading from 'in-settings/tabs/UserSettings/pages/Heading';
import SubViewHeader from 'in-settings/components/SubViewHeader';
import SectionLine from 'in-settings/components/SectionLine';
import { compareIgnoreCase } from 'in-services/util/string';
import { saveUserSettings } from 'in-services/userSettings';
import Toggle from 'in-components/form/Toggle';
import Select from 'in-components/form/Select';
import Title from 'in-components/Title';

import locals from './UiConfig.mless';

export default function UiConfigGeneralPage() {
  const [settings, saveSetting] = useSettingsEditor();

  if (!settings) {
    return null;
  }

  return (
    <SettingsDetailPage>
      <Title title={t('in-settings:tabs.userInterfaceSettings')} />
      <SubViewHeader>{t('in-settings:tabs.userInterfaceSettings')}</SubViewHeader>
      <SectionLine />
      <HorizontalFormGroup
        helpText={t('in-settings:tabs.weWillInformYouAboutUpcomingInstanaServerMaintenanceViaSmall')}
      >
        <Heading text={t('in-settings:tabs.showMaintenanceNotes')} htmlFor="maintenance-notes" />
        <Toggle
          id="maintenance-notes"
          checked={settings['showMaintenanceNotes']}
          onChange={e => saveSetting('showMaintenanceNotes', e.target.checked)}
        />
      </HorizontalFormGroup>
      <HorizontalFormGroup
        helpText={t(
          'in-settings:tabs.toggleTheQualityOfChartRenderingDisableThisToHaveFluentChartAnimationsOnSlowerSystems'
        )}
      >
        <Heading text={t('in-settings:tabs.highQualityChartRendering')} htmlFor="chart-quality" />
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
              {t('in-settings:tabs.requiresBrowserRefreshToBecomeActive')}
              <br />
            </span>
            {t('in-settings:tabs.defineHowOftenTablesWithLiveMetricsShouldBeRefreshed', {
              sec: settings['tables_refreshRate'] / 1000
            })}
          </span>
        }
        isWarning
      >
        <Heading
          text={t('in-settings:tabs.tableRefreshRate', { refreshRate: settings['tables_refreshRate'] / 1000 })}
          htmlFor="table-refresh-rate"
        />
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
        helpText={<span className={locals.warning}>{t('in-settings:tabs.requiresBrowserRefreshToBecomeActive')}</span>}
        isWarning
      >
        <Heading text={t('in-settings:tabs.formatTimeAccordingToUtc')} htmlFor="format-time" />
        <Toggle
          id="format-time"
          checked={settings['formatTimestampsAsUtc']}
          onChange={e => saveSetting('formatTimestampsAsUtc', e.target.checked)}
        />
      </HorizontalFormGroup>
      <HorizontalFormGroup
        helpText={
          <span>
            <span className={locals.warning}>{t('in-settings:tabs.requiresBrowserRefreshToBecomeActive')}</span>
            <br />
            <Trans i18nKey="in-settings:tabs.byDefaultWeWillAttemptToFormatNumbersInYourPreferredLocaleFormat" />
          </span>
        }
        isWarning
      >
        <Heading text={t('in-settings:tabs.formatNumbersInEnUsFormat')} htmlFor="format-numbers" />
        <Toggle
          id="format-numbers"
          checked={settings['formatNumbersAccordingToEnUs'] || false}
          onChange={e => saveSetting('formatNumbersAccordingToEnUs', e.target.checked)}
        />
      </HorizontalFormGroup>
      {languageSelectorEnabled && (
        <HorizontalFormGroup noHelpTextSpacer>
          <Heading text={t('in-settings:languageSelection.language')} htmlFor="language" />
          <Select
            id="language"
            name="language"
            value={activeLanguage}
            onChange={e => saveUserSettings({ preferredLanguage: e.target.value }, () => window.location.reload())}
          >
            {supportedLanguages
              .map(code => ({
                code,
                label: t('language', { context: code })
              }))
              .sort((a, b) => compareIgnoreCase(a.label, b.label))
              .map(({ code, label }) => (
                <option key={code} value={code}>
                  {label}
                </option>
              ))}
          </Select>
        </HorizontalFormGroup>
      )}
    </SettingsDetailPage>
  );
}
