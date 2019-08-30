import React from 'react';

import HorizontalFormGroup from 'in-settings/components/HorizontalFormGroup';
import SettingsDetailPage from 'in-settings/components/SettingsDetailPage';
import SubViewHeader from 'in-settings/components/SubViewHeader';
import { settings$, set } from 'in-services/settings/settings';
import { urlShortenerEnabled } from 'in-services/featureFlags';
import Toggle from 'in-components/form/Toggle';
import Label from 'in-components/form/Label';
import Title from 'in-components/Title';

import './UiConfig.less';

const block = 'in-ui-config';

export default class extends React.Component {
  static displayName = 'UiConfigGeneralPage';

  constructor(props) {
    super(props);
    this.state = {
      settings: null
    };
  }

  componentDidMount() {
    this.settingsSubscription = settings$.subscribe(_settings =>
      this.setState({
        settings: _settings
      })
    );
  }

  componentWillUnmount() {
    this.settingsSubscription.dispose();
    this.settingsSubscription = null;

    set(this.state.settings);
  }

  saveSetting = (k, v) => {
    const newSettings = this.state.settings;
    newSettings[k] = v;
    this.setState({
      settings: newSettings
    });
  };

  render() {
    const { settings } = this.state;
    if (!settings) {
      return null;
    }

    return (
      <SettingsDetailPage>
        <Title title="User Interface Settings" />
        <SubViewHeader>User Interface Settings</SubViewHeader>

        <HorizontalFormGroup
          helpText="We will inform you about upcoming Instana server maintenance via small flyouts in the top-right
          corner. Sometimes though, these flyouts can disturb your workflow. Untick this checkbox to permanently hide
          maintenance notes."
        >
          <Heading text="Show maintenance notes" htmlFor="maintenance-notes" />
          <Toggle
            id="maintenance-notes"
            checked={settings['showMaintenanceNotes']}
            onChange={e => this.saveSetting('showMaintenanceNotes', e.target.checked)}
          />
        </HorizontalFormGroup>
        {urlShortenerEnabled && (
          <HorizontalFormGroup helpText="Whether we should prompt you to generate a shortened URL when using the CTRL+L/CMD+L shortcut.">
            <Heading text="Prompt for URL shortener" htmlFor="urlShortener" />
            <Toggle
              id="urlShortener"
              checked={settings['promptForUrlShortener'] == null ? true : settings['promptForUrlShortener']}
              onChange={e => this.saveSetting('promptForUrlShortener', e.target.checked)}
            />
          </HorizontalFormGroup>
        )}
        <HorizontalFormGroup helpText="Toggle the quality of chart rendering. Disable this to have fluent chart animations on slower systems.">
          <Heading text="High quality chart rendering" htmlFor="chart-quality" />
          <Toggle
            id="chart-quality"
            checked={settings['charts_adaptToDevicePixelRatio']}
            onChange={e => this.saveSetting('charts_adaptToDevicePixelRatio', e.target.checked)}
          />
        </HorizontalFormGroup>
        <HorizontalFormGroup
          helpText={
            <span>
              <span className={`${block}__warning`}>
                Requires browser refresh to become active.
                <br />
              </span>
              Define how often tables with live metrics should be refreshed. Ranges from once per second to once every
              ten seconds. Current refresh rate is once every {settings['tables_refreshRate'] / 1000} second(s).
            </span>
          }
          isWarning
        >
          <Heading
            text={`Table refresh rate (${settings['tables_refreshRate'] / 1000}s)`}
            htmlFor="table-refresh-rate"
          />
          <input
            type="range"
            id="table-refresh-rate"
            min={1000}
            max={10000}
            step={1000}
            value={settings['tables_refreshRate']}
            onChange={e => this.saveSetting('tables_refreshRate', e.target.value)}
          />
        </HorizontalFormGroup>
        <HorizontalFormGroup
          helpText={<span className={`${block}__warning`}>Requires browser refresh to become active.</span>}
          isWarning
        >
          <Heading text="Format time according to UTC" htmlFor="format-time" />
          <Toggle
            id="format-time"
            checked={settings['formatTimestampsAsUtc']}
            onChange={e => this.saveSetting('formatTimestampsAsUtc', e.target.checked)}
          />
        </HorizontalFormGroup>
        <HorizontalFormGroup
          helpText={
            <span>
              <span className={`${block}__warning`}>Requires browser refresh to become active.</span>
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
            onChange={e => this.saveSetting('formatNumbersAccordingToEnUs', e.target.checked)}
          />
        </HorizontalFormGroup>
      </SettingsDetailPage>
    );
  }
}

function Heading({ text, htmlFor }) {
  return (
    <Label className={`${block}__label`} htmlFor={htmlFor}>
      {text}
    </Label>
  );
}
