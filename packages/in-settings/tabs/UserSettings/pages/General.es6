import React from 'react';

import HorizontalFormGroup from 'in-settings/components/HorizontalFormGroup';
import SettingsDetailPage from 'in-settings/components/SettingsDetailPage';
import SubViewHeader from 'in-settings/components/SubViewHeader';
import { settings$, set } from 'in-services/settings/settings';
import { twoZeroModeEnabled } from 'in-services/featureFlags';
import Section from 'in-settings/components/Section';
import Toggle from 'in-components/form/Toggle';
import Label from 'in-components/form/Label';
import Tooltip from 'in-components/Tooltip';
import SvgIcon from 'in-components/SvgIcon';
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

        <Section>
          {!twoZeroModeEnabled && (
            <Group>
              <Heading text="Automatically collapse timeline" htmlFor="toggle-timeline-expand" />
              <Toggle
                id="toggle-timeline-expand"
                checked={settings['autoCollapseTimeline']}
                onChange={e => this.saveSetting('autoCollapseTimeline', e.target.checked)}
              />
            </Group>
          )}

          <Group helpText="We will inform you about upcoming Instana server maintenance via small flyouts in the top-right corner. Sometimes though, these flyouts can disturb your workflow. Untick this checkbox to permanently hide maintenance notes.">
            <Heading text="Show maintenance notes" htmlFor="maintenance-notes" />
            <Toggle
              id="maintenance-notes"
              checked={settings['showMaintenanceNotes']}
              onChange={e => this.saveSetting('showMaintenanceNotes', e.target.checked)}
            />
          </Group>

          <Group helpText="Toggle the quality of chart rendering. Disable this to have fluent chart animations on slower systems.">
            <Heading text="High quality chart rendering" htmlFor="chart-quality" />
            <Toggle
              id="chart-quality"
              checked={settings['charts_adaptToDevicePixelRatio']}
              onChange={e => this.saveSetting('charts_adaptToDevicePixelRatio', e.target.checked)}
            />
          </Group>

          <Group
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
          </Group>

          <Group
            helpText={<span className={`${block}__warning`}>Requires browser refresh to become active.</span>}
            isWarning
          >
            <Heading text="Format time according to UTC" htmlFor="format-time" />
            <Toggle
              id="format-time"
              checked={settings['formatTimestampsAsUtc']}
              onChange={e => this.saveSetting('formatTimestampsAsUtc', e.target.checked)}
            />
          </Group>

          <Group
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
          </Group>
        </Section>
      </SettingsDetailPage>
    );
  }
}

function Group({ children, helpText, isWarning }) {
  return (
    <HorizontalFormGroup className={`${block}__wrapper`}>
      {helpText ? (
        <Tooltip content={helpText} align="rightMiddle">
          <SvgIcon
            className={`${block}__info-icon`}
            type="info"
            width={16}
            height={16}
            color={isWarning ? '#64aade' : '#172429'}
          />
        </Tooltip>
      ) : null}

      {children}
    </HorizontalFormGroup>
  );
}

function Heading({ text, htmlFor }) {
  return (
    <Label className={`${block}__label`} htmlFor={htmlFor}>
      {text}
    </Label>
  );
}
