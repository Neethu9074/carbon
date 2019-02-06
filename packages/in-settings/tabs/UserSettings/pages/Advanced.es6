import React, { Fragment } from 'react';

import HorizontalFormGroup from 'in-settings/components/HorizontalFormGroup';
import SettingsDetailPage from 'in-settings/components/SettingsDetailPage';
import SectionHeading from 'in-settings/components/SectionHeading';
import SubViewHeader from 'in-settings/components/SubViewHeader';
import { settings$, set } from 'in-services/settings/settings';
import { twoZeroModeEnabled } from 'in-services/featureFlags';
import Toggle from 'in-components/form/Toggle';
import Label from 'in-components/form/Label';
import Title from 'in-components/Title';

import './UiConfig.less';

const block = 'in-ui-config';

export default class extends React.Component {
  static displayName = 'UiConfigAdvancedPage';

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
        <Title title="Advanced User Interface Settings" />
        <SubViewHeader>Advanced User Interface Settings</SubViewHeader>

        <SectionHeading>3D Maps</SectionHeading>

        <div style={{ marginBottom: '1rem' }}>
          <HorizontalFormGroup>
            <Heading text="Invert scroll direction" htmlFor="scroll-direction" />
            <Toggle
              id="scroll-direction"
              checked={settings['map_scrollDirection'] === -1}
              onChange={e => this.saveSetting('map_scrollDirection', e.target.checked ? -1 : 1)}
            />
          </HorizontalFormGroup>

          <HorizontalFormGroup>
            <Heading text="Show zoom panel" htmlFor="zoom-panel" />
            <Toggle
              id="zoom-panel"
              checked={settings['zoomPanelIsActive']}
              onChange={e => this.saveSetting('zoomPanelIsActive', e.target.checked)}
            />
          </HorizontalFormGroup>

          <HorizontalFormGroup helpText="Instana automatically detects open TCP connections to hosts which are not monitored by Instana. These hosts are visualized as unmonitored hosts on the map.">
            <Heading text="Show unmonitored hosts" htmlFor="unmonitored-hosts" />
            <Toggle
              id="unmonitored-hosts"
              checked={!settings['map_excludeUnmonitoredHosts']}
              onChange={e => this.saveSetting('map_excludeUnmonitoredHosts', !e.target.checked)}
            />
          </HorizontalFormGroup>

          {!twoZeroModeEnabled && (
            <HorizontalFormGroup helpText="Instana automatically detects communication with external services. These services are visualized as external clouds on the map.">
              <Heading text="Show external services" htmlFor="external-services" />
              <Toggle
                id="external-services"
                checked={!settings['map_excludeExternalServices']}
                onChange={e => this.saveSetting('map_excludeExternalServices', !e.target.checked)}
              />
            </HorizontalFormGroup>
          )}

          <HorizontalFormGroup>
            <Heading text="Show host/container labels" htmlFor="showHostLabels" />
            <Toggle
              id="host-labels"
              checked={settings['map_showHostLabels']}
              onChange={e => this.saveSetting('map_showHostLabels', e.target.checked)}
            />
          </HorizontalFormGroup>

          <HorizontalFormGroup>
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
          </HorizontalFormGroup>

          <HorizontalFormGroup>
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
          </HorizontalFormGroup>

          <HorizontalFormGroup>
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
          </HorizontalFormGroup>

          <HorizontalFormGroup helpText="Anti-aliasing is used to improve the look of the 3D maps. While nice on the eye, it is requiring additional compute resources. Disable anti-aliasing to improve the performance of the 3D maps on slower systems.">
            <Heading text="Anti-aliasing" htmlFor="antialiasing" />
            <Toggle
              id="antialiasing"
              checked={settings['map_antialias'] === 'browserAA'}
              onChange={e => this.saveSetting('map_antialias', e.target.checked ? 'browserAA' : 'off')}
            />
          </HorizontalFormGroup>
        </div>

        <SectionHeading>Infrastructure</SectionHeading>
        <div>
          <HorizontalFormGroup>
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
          </HorizontalFormGroup>
          <HorizontalFormGroup>
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
          </HorizontalFormGroup>

          {!twoZeroModeEnabled && (
            <Fragment>
              <SectionHeading>Application</SectionHeading>
              <HorizontalFormGroup>
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
              </HorizontalFormGroup>
            </Fragment>
          )}
        </div>
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
