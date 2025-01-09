/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Toggle, Button, DistinctSlider, Select } from '@instana/components';

import ChooseConnectionStrategyDialog from 'in-connection/components/ChooseConnectionStrategyDialog';
import { t, Trans, supportedLanguages, activeLanguage, collationLanguage } from 'in-i18n';
import useSettingsEditor from 'in-settings/tabs/UserSettings/pages/useSettingsEditor';
import HorizontalFormGroup from 'in-settings/components/HorizontalFormGroup';
import SettingsDetailPage from 'in-settings/components/SettingsDetailPage';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import Heading from 'in-settings/tabs/UserSettings/pages/Heading';
import SubViewHeader from 'in-settings/components/SubViewHeader';
import SectionLine from 'in-settings/components/SectionLine';
import { compareIgnoreCase } from 'in-services/util/string';
import { saveUserSettings } from 'in-services/userSettings';
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
          onToggle={e => saveSetting('showMaintenanceNotes', e)}
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
          onToggle={e => saveSetting('charts_adaptToDevicePixelRatio', e)}
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
        <div>
          <DistinctSlider
            min={1}
            max={10}
            step={1}
            value={Number(settings['tables_refreshRate']) / 1000}
            onChange={(_, value) => saveSetting('tables_refreshRate', (value as number) * 1000)}
          />
        </div>
      </HorizontalFormGroup>
      <HorizontalFormGroup
        helpText={<span className={locals.warning}>{t('in-settings:tabs.requiresBrowserRefreshToBecomeActive')}</span>}
        isWarning
      >
        <Heading text={t('in-settings:tabs.formatTimeAccordingToUtc')} htmlFor="format-time" />
        <Toggle
          id="format-time"
          checked={settings['formatTimestampsAsUtc']}
          onToggle={e => saveSetting('formatTimestampsAsUtc', e)}
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
          onToggle={e => saveSetting('formatNumbersAccordingToEnUs', e)}
        />
      </HorizontalFormGroup>
      <HorizontalFormGroup noHelpTextSpacer>
        <Heading text={t('in-settings:languageSelection.language')} htmlFor="language" />
        <Select
          id="language"
          name="language"
          value={activeLanguage}
          onChange={e =>
            saveUserSettings(
              collationLanguage === activeLanguage
                ? { preferredLanguage: e.target.value, collationLanguage: e.target.value }
                : { preferredLanguage: e.target.value },
              () => window.location.reload()
            )
          }
        >
          {supportedLanguages
            .map(code => ({
              code,
              label: t('language', { context: code, lng: 'en-US' }),
              localizedLabel: t('language', { context: code })
            }))
            .sort((a, b) => compareIgnoreCase(a.label, b.label))
            .map(({ code, label, localizedLabel }) => (
              <option key={code} value={code}>
                {label} {label !== localizedLabel && ` / ${localizedLabel}`}
              </option>
            ))}
        </Select>
      </HorizontalFormGroup>
      <HorizontalFormGroup noHelpTextSpacer>
        <Heading text={t('in-settings:languageSelection.collationLanguage')} htmlFor="collation-language" />
        <Select
          id="collation-language"
          name="collation-language"
          value={collationLanguage}
          onChange={e => saveUserSettings({ collationLanguage: e.target.value }, () => window.location.reload())}
        >
          {supportedLanguages
            .map(code => ({
              code,
              label: t('language', { context: code, lng: 'en-US' }),
              localizedLabel: t('language', { context: code })
            }))
            .sort((a, b) => compareIgnoreCase(a.label, b.label))
            .map(({ code, label, localizedLabel }) => (
              <option key={code} value={code}>
                {label} {label !== localizedLabel && ` / ${localizedLabel}`}
              </option>
            ))}
        </Select>
      </HorizontalFormGroup>
      <HorizontalFormGroup noHelpTextSpacer>
        <Heading text={t('in-settings:tabs.connectionStrategy')} htmlFor="maintenance-notes" />
        <Button kind="secondary" onClick={() => addActiveDialog(<ChooseConnectionStrategyDialog />)}>
          {t('in-settings:tabs.configureConnectionStrategy')}
        </Button>
      </HorizontalFormGroup>
    </SettingsDetailPage>
  );
}
