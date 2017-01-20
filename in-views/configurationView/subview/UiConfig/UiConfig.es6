import React from 'react';

import SubViewHeader from 'in-views/configurationView/components/SubViewHeader';
import Section from 'in-views/configurationView/components/Section';
import {settings$, setIn} from 'in-services/settings/settings';
import Toggle from 'in-components/form/Toggle';
import Label from 'in-components/form/Label';
import Tooltip from 'in-components/Tooltip';
import SvgIcon from 'in-components/SvgIcon';
import connectTo from 'in-hoc/connectTo';

import './UiConfig.less';

const block = 'in-ui-config';

export default connectTo({
  settings: settings$
},
function UiConfig({settings}) {
  return (
    <div className={block}>
      <SubViewHeader>
        User Interface
      </SubViewHeader>

      <Section>
        <SectionHeading>
          General
        </SectionHeading>

        <Group>
          <Toggle id='toggle-timeline-expand'
                  checked={settings.get('autoCollapseTimeline')}
                  onChange={e => setIn(['autoCollapseTimeline'], e.target.checked)} />
          <Heading text='Automatically collapse timeline'
                   htmlFor='toggle-timeline-expand' />
        </Group>

        <Group helpText='We will inform you about upcoming Instana server maintenance via small flyouts in the top-right corner. Sometimes though, these flyouts can disturb your workflow. Untick this checkbox to permanently hide maintenance notes.' >
          <Toggle id='maintenance-notes'
                  checked={settings.get('showMaintenanceNotes')}
                  onChange={e => setIn(['showMaintenanceNotes'], e.target.checked)} />
          <Heading text='Show maintenance notes'
                   htmlFor='maintenance-notes' />
        </Group>

        <Group helpText='Toggle the quality of chart rendering. Disable this to have fluent chart animations on slower systems.' >
          <Toggle id='chart-quality'
                  checked={settings.getIn(['charts', 'adaptToDevicePixelRatio'])}
                  onChange={e => setIn(['charts', 'adaptToDevicePixelRatio'], e.target.checked)} />
          <Heading text='High quality chart rendering'
                   htmlFor='chart-quality' />
        </Group>

        <Group helpText='Requires browser refresh to become active.'
               isError>
          <Toggle id='format-time'
                  checked={settings.get('formatTimestampsAsUtc')}
                  onChange={e => setIn(['formatTimestampsAsUtc'], e.target.checked)} />
          <Heading text='Format time according to UTC'
                   htmlFor='format-time' />
        </Group>
      </Section>

      <Section>
        <SectionHeading>
          3D Maps
        </SectionHeading>

        <Group>
          <Toggle id='scroll-direction'
                  checked={settings.getIn(['map', 'scrollDirection']) === -1}
                  onChange={e => setIn(['map', 'scrollDirection'], e.target.checked ? -1 : 1)} />
          <Heading text='Invert scroll direction'
                   htmlFor='scroll-direction' />
        </Group>

        <Group>
          <Toggle id='zoom-panel'
                  checked={settings.get('zoomPanelIsActive')}
                  onChange={e => setIn(['zoomPanelIsActive'], e.target.checked)} />
          <Heading text='Show zoom panel'
                   htmlFor='zoom-panel' />
        </Group>

        <Group helpText='Instana automatically detects open TCP connections to hosts which are not monitored by Instana. These hosts are visualized as unmonitored hosts on the map.' >
          <Toggle id='unmonitored-hosts'
                  checked={!settings.getIn(['map', 'excludeUnmonitoredHosts'])}
                  onChange={e => setIn(['map', 'excludeUnmonitoredHosts'], !e.target.checked)} />
          <Heading text='Show unmonitored hosts'
                   htmlFor='unmonitored-hosts' />
        </Group>

        <Group>
          <Heading text='Zoom and panning speed'
                   htmlFor='zoom-speed' />
          <input type='range'
                 id='zoom-speed'
                 min={0.1}
                 max={20}
                 step={0.1}
                 className={`${block}__zoom-speed`}
                 value={settings.getIn(['map', 'scrollSpeed'])}
                 onChange={e => setIn(['map', 'scrollSpeed'], e.target.value)} />
        </Group>

        <Group>
          <Heading text={`Space between groups in x direction (${settings.getIn(['map', 'packingXSpace'])})`}
                   htmlFor='packing_x_direction' />
          <input type='range'
                 id='packing_x_direction'
                 min={1}
                 max={10}
                 step={1}
                 className={`${block}__slider`}
                 value={settings.getIn(['map', 'packingXSpace'])}
                 onChange={e => setIn(['map', 'packingXSpace'], Number(e.target.value))} />
        </Group>

        <Group>
          <Heading text={`Space between groups in y direction (${settings.getIn(['map', 'packingYSpace'])})`}
                   htmlFor='packing_y_direction' />
          <input type='range'
                 id='packing_y_direction'
                 min={1}
                 max={10}
                 step={1}
                 className={`${block}__slider`}
                 value={settings.getIn(['map', 'packingYSpace'])}
                 onChange={e => setIn(['map', 'packingYSpace'], Number(e.target.value))} />
        </Group>


        <Group helpText='Anti-aliasing is used to improve the look of the 3D maps. While nice on the eye, it is requiring additional compute resources. Disable anti-aliasing to improve the performance of the 3D maps on slower systems.'>
          <Toggle id='antialiasing'
                  checked={settings.getIn(['map', 'antialias']) === 'browserAA'}
                  onChange={e => setIn(['map', 'antialias'], e.target.checked ? 'browserAA' : 'off')} />
          <Heading text='Anti-aliasing'
                   htmlFor='antialiasing' />
        </Group>

        <SectionHeading>
          Infrastructure
        </SectionHeading>
        <Group>
          <Heading text={`Compact layouter: Space between groups in x direction (${settings.getIn(['map', 'packingXSpace'])})`}
                   htmlFor='packing_x_direction' />
          <input type='range'
                 id='packing_x_direction'
                 min={1}
                 max={10}
                 step={1}
                 className={`${block}__slider`}
                 value={settings.getIn(['map', 'packingXSpace'])}
                 onChange={e => setIn(['map', 'packingXSpace'], Number(e.target.value))} />
        </Group>
        <Group>
          <Heading text={`Compact layouter: Space between groups in y direction (${settings.getIn(['map', 'packingYSpace'])})`}
                   htmlFor='packing_y_direction' />
          <input type='range'
                 id='packing_y_direction'
                 min={1}
                 max={10}
                 step={1}
                 className={`${block}__slider`}
                 value={settings.getIn(['map', 'packingYSpace'])}
                 onChange={e => setIn(['map', 'packingYSpace'], Number(e.target.value))} />
        </Group>

        <SectionHeading>
          Application
        </SectionHeading>
        <Group>
          <Heading text={`Number of shown hops when filtering services (${settings.getIn(['map', 'logical', 'numServiceHops'])})`}
                   htmlFor='num_service_hops' />
          <input type='range'
                 id='num_service_hops'
                 min={0}
                 max={1}
                 step={1}
                 className={`${block}__slider`}
                 value={settings.getIn(['map', 'logical', 'numServiceHops'])}
                 onChange={e => setIn(['map', 'logical', 'numServiceHops'], Number(e.target.value))} />
        </Group>

      </Section>
    </div>
  );
});

function Group({children, helpText, isError}) {
  return (
    <div className={`${block}__wrapper`}>
      {children}

      {helpText ?
        <Tooltip content={helpText}
                 align='leftMiddle'>
          <SvgIcon className={`${block}__info-icon`}
                   type='info'
                   width={16}
                   height={16}
                   color={isError ? '#ff4229' : '#172429'} />
        </Tooltip>
      : null}
    </div>
  );
}

function SectionHeading({children}) {
  return (
    <h3 className={`${block}__section-heading`}>
      {children}
    </h3>
  );
}

function Heading({text, htmlFor}) {
  return (
    <Label className={`${block}__label`}
           htmlFor={htmlFor}>
      {text}
    </Label>
  );
}
