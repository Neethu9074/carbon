import React from 'react';

import SubViewHeader from 'in-views/configurationView/components/SubViewHeader';
import {settings$, setIn} from 'in-services/settings/settings';
import HelpBlock from 'in-components/form/HelpBlock';
import FormGroup from 'in-components/form/FormGroup';
import Toggle from 'in-components/form/Toggle';
import Label from 'in-components/form/Label';
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
        User Interface Settings
      </SubViewHeader>

      <SectionHeading>General</SectionHeading>

      <FormGroup className={`${block}__form`}>
        <Label htmlFor='toggle-timeline-expand'>Automatically collapse timeline</Label>
        <Toggle id='toggle-timeline-expand'
                checked={settings.get('autoCollapseTimeline')}
                onChange={e => setIn(['autoCollapseTimeline'], e.target.checked)} />
      </FormGroup>

      <FormGroup className={`${block}__form`}>
        <Label htmlFor='maintenance-notes'>Show maintenance notes</Label>
        <Toggle id='maintenance-notes'
                checked={settings.get('showMaintenanceNotes')}
                onChange={e => setIn(['showMaintenanceNotes'], e.target.checked)} />
        <HelpBlock>
          We will inform you about upcoming Instana server maintenance via small flyouts in the top-right corner. {' '}
          Sometimes though, these flyouts can disturb your workflow. Untick this checkbox to permanently hide
          maintenance notes.
        </HelpBlock>
      </FormGroup>

      <FormGroup className={`${block}__form`}>
        <Label htmlFor='chart-quality'>High quality chart rendering</Label>
        <Toggle id='chart-quality'
                checked={settings.getIn(['charts', 'adaptToDevicePixelRatio'])}
                onChange={e => setIn(['charts', 'adaptToDevicePixelRatio'], e.target.checked)} />
        <HelpBlock>
          Toggle the quality of chart rendering. Disable this to have fluent chart animations on slower systems.
        </HelpBlock>
      </FormGroup>

      <FormGroup className={`${block}__form`}>
        <Label htmlFor='chart-quality'>Format time according to UTC</Label>
        <Toggle id='chart-quality'
                checked={settings.get('formatTimestampsAsUtc')}
                onChange={e => setIn(['formatTimestampsAsUtc'], e.target.checked)} />
        <RequiresRefreshIndicator />
        <HelpBlock>
          Toggle the quality of chart rendering. Disable this to have fluent chart animations on slower systems.
        </HelpBlock>
      </FormGroup>


      <SectionHeading>3D Maps</SectionHeading>

      <FormGroup className={`${block}__form`}>
        <Label htmlFor='scroll-direction'>Invert scroll direction</Label>
        <Toggle id='scroll-direction'
                checked={settings.getIn(['map', 'scrollDirection']) === -1}
                onChange={e => setIn(['map', 'scrollDirection'], e.target.checked ? -1 : 1)} />
      </FormGroup>

      <FormGroup className={`${block}__form`}>
        <Label htmlFor='zoom-panel'>Show zoom panel</Label>
        <Toggle id='zoom-panel'
                checked={settings.get('zoomPanelIsActive')}
                onChange={e => setIn(['zoomPanelIsActive'], e.target.checked)} />
      </FormGroup>

      <FormGroup className={`${block}__form`}>
        <Label htmlFor='unmonitored-hosts'>Show unmonitored hosts</Label>
        <Toggle id='unmonitored-hosts'
                checked={!settings.getIn(['map', 'excludeUnmonitoredHosts'])}
                onChange={e => setIn(['map', 'excludeUnmonitoredHosts'], !e.target.checked)} />
        <HelpBlock>
          Instana automatically detects open TCP connections to hosts which are not monitored by Instana. {' '}
          These hosts are visualized as unmonitored hosts on the map.
        </HelpBlock>
      </FormGroup>

      <FormGroup className={`${block}__form`}>
        <Label htmlFor='zoom-speed'>Zoom and panning speed</Label>
        <input type='range'
               id='zoom-speed'
               min={0.1}
               max={20}
               step={0.1}
               className={`${block}__zoom-speed`}
               value={settings.getIn(['map', 'scrollSpeed'])}
               onChange={e => setIn(['map', 'scrollSpeed'], e.target.value)} />
      </FormGroup>

      <FormGroup className={`${block}__form`}>
        <Label htmlFor='antialiasing'>Anti-aliasing</Label>
        <Toggle id='antialiasing'
                checked={settings.getIn(['map', 'antialias']) === 'browserAA'}
                onChange={e => setIn(['map', 'antialias'], e.target.checked ? 'browserAA' : 'off')} />
        <HelpBlock>
          Anti-aliasing is used to improve the look of the 3D maps. While nice on the eye, it is requiring{' '}
          additional compute resources. Disable anti-aliasing to improve the performance of the 3D maps on
          slower systems.
        </HelpBlock>
      </FormGroup>
    </div>
  );
});

function RequiresRefreshIndicator() {
  return (
    <div className={`${block}__requires-refresh`}>
      Requires browser refresh to become active.
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
