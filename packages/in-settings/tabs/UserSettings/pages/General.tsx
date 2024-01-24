/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Button, getThemeOverride, Link, setThemeOverride, Spacer, Stack, Toggle } from '@instana/components';
import { themes } from '@instana/design-tokens';

import ChooseConnectionStrategyDialog from 'in-connection/components/ChooseConnectionStrategyDialog';
import { t, Trans, supportedLanguages, activeLanguage, collationLanguage } from 'in-i18n';
import useSettingsEditor from 'in-settings/tabs/UserSettings/pages/useSettingsEditor';
import HorizontalFormGroup from 'in-settings/components/HorizontalFormGroup';
import SettingsDetailPage from 'in-settings/components/SettingsDetailPage';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import { userSettingsThemeEnabled } from 'in-services/featureFlags';
import Heading from 'in-settings/tabs/UserSettings/pages/Heading';
import SubViewHeader from 'in-settings/components/SubViewHeader';
import SectionLine from 'in-settings/components/SectionLine';
import { compareIgnoreCase } from 'in-services/util/string';
import { saveUserSettings } from 'in-services/userSettings';
import Select from 'in-components/form/Select';
import Title from 'in-components/Title';

import locals from './UiConfig.mless';

export default function UiConfigGeneralPage() {
  const [settings, saveSetting] = useSettingsEditor();

  if (!settings) {
    return null;
  }

  const currentShell = localStorage.getItem('ids-override-shell') || 'default';
  const currentTheme = getThemeOverride() ?? 'default';
  // eslint-disable-next-line no-console
  console.log('currentTheme', currentTheme);

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
      {userSettingsThemeEnabled && (
        <HorizontalFormGroup
          // This is a temporary feature behind a feature flag.
          // It won't need translation yet, as it will only be available internally.
          helpText={
            <>
              <span className={locals.warning}>{t('in-settings:tabs.requiresBrowserRefreshToBecomeActive')}</span>
              <br />
              This will set the theme for the local browser. It will not affect other users or browser windows.
              <br />
              It enables testing a different Carbon Theme for parts that are carbonized.
              <br />
              <br />
              This setting will be kept until it will get reset again.
            </>
          }
          isWarning
        >
          <Heading
            text={
              <Stack direction={'horizontal'} align={'center'}>
                <span>{t('in-settings:tabs.themeSettings')}</span>
                <Spacer horizontal="normal" />
                <Link href="/#/config/user/general" size="sm">
                  {/* no need for translation yet */}
                  You can bookmark this settings page.
                </Link>
              </Stack>
            }
            htmlFor="theme"
          />
          <Select
            id="theme"
            name="theme"
            value={currentTheme}
            onChange={event => {
              const selectTheme = event.target?.value;

              // eslint-disable-next-line no-console
              console.debug('selected theme:', selectTheme);

              if (currentTheme !== selectTheme) {
                setThemeOverride(selectTheme);
                window.location.reload();
              }
            }}
          >
            {Object.keys(themes)
              .filter(name => name != 'dark')
              .map(theme => (
                <option key={theme} value={theme}>
                  {t('in-settings:tabs.theme', { context: theme })}
                </option>
              ))}
          </Select>
        </HorizontalFormGroup>
      )}
      {userSettingsThemeEnabled && (
        <HorizontalFormGroup
          // Temporary feature behind a feature flag.
          // It does not need translation as it is only available internally.
          helpText={
            <>
              <span className={locals.warning}>{t('in-settings:tabs.requiresBrowserRefreshToBecomeActive')}</span>
              <br />
              This will set the shell for the local browser. It will not affect other users or browser windows.
              <br />
              <br />
              This setting will be kept until it is reset again.
            </>
          }
          isWarning
        >
          <Heading
            text={
              <Stack direction="horizontal" align="center">
                {/* no need for translation */}
                <span>UI Shell</span>
                <Spacer horizontal="normal" />
              </Stack>
            }
            htmlFor="shell-option"
          />
          <Select
            id="shell-option"
            name="shell"
            value={currentShell}
            onChange={event => {
              const selectedShell = event.target?.value;
              if (currentShell !== selectedShell) {
                if (selectedShell === 'default') {
                  localStorage.removeItem('ids-override-shell');
                } else {
                  localStorage.setItem('ids-override-shell', selectedShell);
                }
                window.location.reload();
              }
            }}
          >
            {/* no need for translation */}
            <option key="default" value="default">
              Default
            </option>
            <option key="instana" value="instana">
              Instana
            </option>
            <option key="carbon" value="carbon">
              Carbon
            </option>
          </Select>
        </HorizontalFormGroup>
      )}
    </SettingsDetailPage>
  );
}
