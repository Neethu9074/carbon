import React, { Fragment } from 'react';

import HorizontalFormGroupWithBackground from 'in-views/configurationView/components/HorizontalFormGroupWithBackground';
import SectionHeading from 'in-views/configurationView/components/SectionHeading';
import SubViewWrapper from 'in-views/configurationView/components/SubViewWrapper';
import SubViewHeader from 'in-views/configurationView/components/SubViewHeader';
import Section from 'in-views/configurationView/components/Section';
import { settings$, set } from 'in-services/settings/settings';
import { twoZeroModeEnabled } from 'in-services/featureFlags';
import Toggle from 'in-components/form/Toggle';
import Label from 'in-components/form/Label';
import Tooltip from 'in-components/Tooltip';
import SvgIcon from 'in-components/SvgIcon';
import Title from 'in-components/Title';

import './UiConfig.less';

const block = 'in-ui-config';

export default class extends React.Component {
  static displayName = 'UiConfig';

  constructor(props) {
    super(props);
    this.state = {
      settings: null
    };
  }

  componentWillMount() {
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
    return (
      <SubViewWrapper>
        <Title title="User Interface Settings" />
        <SubViewHeader>User Interface</SubViewHeader>

        <Section>
          <SectionHeading>General</SectionHeading>

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
                  Requires browser refresh to become active.<br />
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
        </Section>

        <Section>
          <SectionHeading>3D Maps</SectionHeading>

          <Group>
            <Heading text="Invert scroll direction" htmlFor="scroll-direction" />
            <Toggle
              id="scroll-direction"
              checked={settings['map_scrollDirection'] === -1}
              onChange={e => this.saveSetting('map_scrollDirection', e.target.checked ? -1 : 1)}
            />
          </Group>

          <Group>
            <Heading text="Show zoom panel" htmlFor="zoom-panel" />
            <Toggle
              id="zoom-panel"
              checked={settings['zoomPanelIsActive']}
              onChange={e => this.saveSetting('zoomPanelIsActive', e.target.checked)}
            />
          </Group>

          <Group helpText="Instana automatically detects open TCP connections to hosts which are not monitored by Instana. These hosts are visualized as unmonitored hosts on the map.">
            <Heading text="Show unmonitored hosts" htmlFor="unmonitored-hosts" />
            <Toggle
              id="unmonitored-hosts"
              checked={!settings['map_excludeUnmonitoredHosts']}
              onChange={e => this.saveSetting('map_excludeUnmonitoredHosts', !e.target.checked)}
            />
          </Group>

          {!twoZeroModeEnabled && (
            <Group helpText="Instana automatically detects communication with external services. These services are visualized as external clouds on the map.">
              <Heading text="Show external services" htmlFor="external-services" />
              <Toggle
                id="external-services"
                checked={!settings['map_excludeExternalServices']}
                onChange={e => this.saveSetting('map_excludeExternalServices', !e.target.checked)}
              />
            </Group>
          )}

          <Group>
            <Heading text="Show host/container labels" htmlFor="showHostLabels" />
            <Toggle
              id="host-labels"
              checked={settings['map_showHostLabels']}
              onChange={e => this.saveSetting('map_showHostLabels', e.target.checked)}
            />
          </Group>

          <Group>
            <Heading text="Zoom and panning speed" htmlFor="zoom-speed" />
            <input
              type="range"
              id="zoom-speed"
              min={0.1}
              max={20}
              step={0.1}
              className={`${block}__zoom-speed`}
              value={settings['map_scrollSpeed']}
              onChange={e => this.saveSetting('map_scrollSpeed', e.target.value)}
            />
          </Group>

          <Group>
            <Heading
              text={`Space between groups in x direction (${settings['map_packingXSpace']})`}
              htmlFor="packing_x_direction"
            />
            <input
              type="range"
              id="packing_x_direction"
              min={1}
              max={10}
              step={1}
              className={`${block}__slider`}
              value={settings['map_packingXSpace']}
              onChange={e => this.saveSetting('map_packingXSpace', Number(e.target.value))}
            />
          </Group>

          <Group>
            <Heading
              text={`Space between groups in y direction (${settings['map_packingYSpace']})`}
              htmlFor="packing_y_direction"
            />
            <input
              type="range"
              id="packing_y_direction"
              min={1}
              max={10}
              step={1}
              className={`${block}__slider`}
              value={settings['map_packingYSpace']}
              onChange={e => this.saveSetting('map_packingYSpace', Number(e.target.value))}
            />
          </Group>

          <Group helpText="Anti-aliasing is used to improve the look of the 3D maps. While nice on the eye, it is requiring additional compute resources. Disable anti-aliasing to improve the performance of the 3D maps on slower systems.">
            <Heading text="Anti-aliasing" htmlFor="antialiasing" />
            <Toggle
              id="antialiasing"
              checked={settings['map_antialias'] === 'browserAA'}
              onChange={e => this.saveSetting('map_antialias', e.target.checked ? 'browserAA' : 'off')}
            />
          </Group>

          <SectionHeading>Infrastructure</SectionHeading>
          <Group>
            <Heading
              text={`Compact layouter: Space between groups in x direction (${settings['map_packingXSpace']})`}
              htmlFor="packing_x_direction"
            />
            <input
              type="range"
              id="packing_x_direction"
              min={1}
              max={10}
              step={1}
              className={`${block}__slider`}
              value={settings['map_packingXSpace']}
              onChange={e => this.saveSetting('map_packingXSpace', Number(e.target.value))}
            />
          </Group>
          <Group>
            <Heading
              text={`Compact layouter: Space between groups in y direction (${settings['map_packingYSpace']})`}
              htmlFor="packing_y_direction"
            />
            <input
              type="range"
              id="packing_y_direction"
              min={1}
              max={10}
              step={1}
              className={`${block}__slider`}
              value={settings['map_packingYSpace']}
              onChange={e => this.saveSetting('map_packingYSpace', Number(e.target.value))}
            />
          </Group>

          {!twoZeroModeEnabled && (
            <Fragment>
              <SectionHeading>Application</SectionHeading>
              <Group>
                <Heading
                  text={`Number of shown hops when filtering services on the map (${
                    settings['map_logical_numServiceHops']
                  })`}
                  htmlFor="num_service_hops"
                />
                <input
                  type="range"
                  id="num_service_hops"
                  min={0}
                  max={1}
                  step={1}
                  className={`${block}__slider`}
                  value={settings['map_logical_numServiceHops']}
                  onChange={e => this.saveSetting('map_logical_numServiceHops', Number(e.target.value))}
                />
              </Group>
            </Fragment>
          )}
        </Section>
      </SubViewWrapper>
    );
  }
}

function Group({ children, helpText, isWarning }) {
  return (
    <HorizontalFormGroupWithBackground className={`${block}__wrapper`}>
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
    </HorizontalFormGroupWithBackground>
  );
}

function Heading({ text, htmlFor }) {
  return (
    <Label className={`${block}__label`} htmlFor={htmlFor}>
      {text}
    </Label>
  );
}
