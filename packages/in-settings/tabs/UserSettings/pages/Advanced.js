import { get } from 'lodash';
import React from 'react';

import useSettingsEditor from 'in-settings/tabs/UserSettings/pages/useSettingsEditor';
import HorizontalFormGroup from 'in-settings/components/HorizontalFormGroup';
import SettingsDetailPage from 'in-settings/components/SettingsDetailPage';
import SectionHeading from 'in-settings/components/SectionHeading';
import Heading from 'in-settings/tabs/UserSettings/pages/Heading';
import SubViewHeader from 'in-settings/components/SubViewHeader';
import SectionLine from 'in-settings/components/SectionLine';
import Toggle from 'in-components/form/Toggle';
import Footer from 'in-new-components/Footer';
import Title from 'in-components/Title';

import locals from './UiConfig.mless';

export default function UiConfigAdvancedPage() {
  const [settings, saveSetting] = useSettingsEditor();

  if (!settings) {
    return null;
  }

  return (
    <SettingsDetailPage>
      <Title title="Advanced User Interface Settings" />
      <SubViewHeader>Advanced User Interface Settings</SubViewHeader>
      <SectionLine />

      <SectionHeading>3D Maps</SectionHeading>

      <div style={{ marginBottom: '1rem' }}>
        <HorizontalFormGroup>
          <Heading text="Invert scroll direction" htmlFor="scroll-direction" />
          <Toggle
            id="scroll-direction"
            checked={settings['map_scrollDirection'] === -1}
            onChange={e => saveSetting('map_scrollDirection', e.target.checked ? -1 : 1)}
          />
        </HorizontalFormGroup>

        <HorizontalFormGroup>
          <Heading text="Show zoom panel" htmlFor="zoom-panel" />
          <Toggle
            id="zoom-panel"
            checked={settings['zoomPanelIsActive']}
            onChange={e => saveSetting('zoomPanelIsActive', e.target.checked)}
          />
        </HorizontalFormGroup>

        <HorizontalFormGroup>
          <Heading text="Show host/container labels" htmlFor="showHostLabels" />
          <Toggle
            id="host-labels"
            checked={settings['map_showHostLabels']}
            onChange={e => saveSetting('map_showHostLabels', e.target.checked)}
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
            className={locals.slider}
            value={settings['map_scrollSpeed']}
            onChange={e => saveSetting('map_scrollSpeed', e.target.value)}
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
            className={locals.slider}
            value={settings['map_packingXSpace']}
            onChange={e => saveSetting('map_packingXSpace', Number(e.target.value))}
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
            className={locals.slider}
            value={settings['map_packingYSpace']}
            onChange={e => saveSetting('map_packingYSpace', Number(e.target.value))}
          />
        </HorizontalFormGroup>

        <HorizontalFormGroup>
          <Heading text="Anti-aliasing" htmlFor="antialiasing" />
          <Toggle
            id="antialiasing"
            checked={settings['map_antialias'] === 'browserAA'}
            onChange={e => saveSetting('map_antialias', e.target.checked ? 'browserAA' : 'off')}
          />
        </HorizontalFormGroup>
      </div>

      <SectionHeading>Pod Map</SectionHeading>
      <div style={{ marginBottom: '1rem' }}>
        <HorizontalFormGroup>
          <Heading text="Show ungrouped pods" htmlFor="kubernetes_ungrouped-pods" />
          <Toggle
            id="kubernetes_ungrouped-pods"
            checked={get(settings, ['kubernetes_ungrouped_pods_enabled'], true)}
            onChange={e => saveSetting('kubernetes_ungrouped_pods_enabled', e.target.checked)}
          />
        </HorizontalFormGroup>
      </div>

      <SectionHeading>Infrastructure</SectionHeading>
      <div style={{ marginBottom: '1rem' }}>
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
            className={locals.slider}
            value={settings['map_packingXSpace']}
            onChange={e => saveSetting('map_packingXSpace', Number(e.target.value))}
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
            className={locals.slider}
            value={settings['map_packingYSpace']}
            onChange={e => saveSetting('map_packingYSpace', Number(e.target.value))}
          />
        </HorizontalFormGroup>
      </div>
      <Footer />
    </SettingsDetailPage>
  );
}
