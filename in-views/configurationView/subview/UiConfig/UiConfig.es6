import React from 'react';

import SubViewHeader from 'in-views/configurationView/components/SubViewHeader';
import {settings$, setIn} from 'in-services/settings/settings';
import FormGroup from 'in-components/form/FormGroup';
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
        User Interface Settings
      </SubViewHeader>

      <SectionHeading>General</SectionHeading>

      <FormGroup className={`${block}__form`}>
        <Heading text='Automatically collapse timeline'
                 htmlFor='toggle-timeline-expand' />
        <Toggle id='toggle-timeline-expand'
                checked={settings.get('autoCollapseTimeline')}
                onChange={e => setIn(['autoCollapseTimeline'], e.target.checked)} />
      </FormGroup>

      <FormGroup className={`${block}__form`}>
        <Heading text='Show maintenance notes'
                 htmlFor='maintenance-notes'
                 helpText='We will inform you about upcoming Instana server maintenance via small flyouts in the top-right corner. Sometimes though, these flyouts can disturb your workflow. Untick this checkbox to permanently hide maintenance notes.' />
        <Toggle id='maintenance-notes'
                checked={settings.get('showMaintenanceNotes')}
                onChange={e => setIn(['showMaintenanceNotes'], e.target.checked)} />
      </FormGroup>

      <FormGroup className={`${block}__form`}>
        <Heading text='High quality chart rendering'
                 htmlFor='chart-quality'
                 helpText='Toggle the quality of chart rendering. Disable this to have fluent chart animations on slower systems.' />
        <Toggle id='chart-quality'
                checked={settings.getIn(['charts', 'adaptToDevicePixelRatio'])}
                onChange={e => setIn(['charts', 'adaptToDevicePixelRatio'], e.target.checked)} />
      </FormGroup>

      <FormGroup className={`${block}__form`}>
        <Heading text='Format time according to UTC'
                 htmlFor='format-time' />
        <Toggle id='format-time'
                checked={settings.get('formatTimestampsAsUtc')}
                onChange={e => setIn(['formatTimestampsAsUtc'], e.target.checked)} />
        <RequiresRefreshIndicator />
      </FormGroup>


      <SectionHeading>3D Maps</SectionHeading>

      <FormGroup className={`${block}__form`}>
        <Heading text='Invert scroll direction'
                 htmlFor='scroll-direction' />
        <Toggle id='scroll-direction'
                checked={settings.getIn(['map', 'scrollDirection']) === -1}
                onChange={e => setIn(['map', 'scrollDirection'], e.target.checked ? -1 : 1)} />
      </FormGroup>

      <FormGroup className={`${block}__form`}>
        <Heading text='Show zoom panel'
                 htmlFor='zoom-panel' />
        <Toggle id='zoom-panel'
                checked={settings.get('zoomPanelIsActive')}
                onChange={e => setIn(['zoomPanelIsActive'], e.target.checked)} />
      </FormGroup>

      <FormGroup className={`${block}__form`}>
        <Heading text='Show unmonitored hosts'
                 htmlFor='unmonitored-hosts'
                 helpText='Instana automatically detects open TCP connections to hosts which are not monitored by Instana. These hosts are visualized as unmonitored hosts on the map.' />
        <Toggle id='unmonitored-hosts'
                checked={!settings.getIn(['map', 'excludeUnmonitoredHosts'])}
                onChange={e => setIn(['map', 'excludeUnmonitoredHosts'], !e.target.checked)} />
      </FormGroup>

      <FormGroup className={`${block}__form`}>
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
      </FormGroup>

      <FormGroup className={`${block}__form`}>
        <Heading text='Anti-aliasing'
                 htmlFor='antialiasing'
                 helpText='Anti-aliasing is used to improve the look of the 3D maps. While nice on the eye, it is requiring additional compute resources. Disable anti-aliasing to improve the performance of the 3D maps on slower systems.' />
        <Toggle id='antialiasing'
                checked={settings.getIn(['map', 'antialias']) === 'browserAA'}
                onChange={e => setIn(['map', 'antialias'], e.target.checked ? 'browserAA' : 'off')} />
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

function Heading({text, htmlFor, helpText}) {
  if (!helpText) {
    return (
      <Label htmlFor={htmlFor}>
        {text}
      </Label>
    );
  }

  return (
    <div className={`${block}__heading-wrapper`}>
      <Label className={`${block}__label`}
             htmlFor='antialiasing'>
        Anti-aliasing
      </Label>
      <Tooltip content={helpText} align='rightTop'>
        <SvgIcon className={`${block}__info-icon`}
                 type='info'
                 width={16}
                 height={16}
                 color='#172429' />
      </Tooltip>
    </div>
  );
}
