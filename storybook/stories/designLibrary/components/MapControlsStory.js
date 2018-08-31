import { storiesOf } from '@storybook/react';
import React, { Fragment } from 'react';

import ButtonGroup from 'in-new-components/MapControls/ButtonGroup';
import Button from 'in-new-components/MapControls/Button';

import Section from '../../_helpers/Section';
import Root from '../../_helpers/Root';

storiesOf('designLibrary/Components/Map Controls', module).add('Map Controls', () => <MapControlsStory />);

function MapControlsStory() {
  return (
    <Root>
      <Section title="Single">
        <ButtonGroup>
          <Button renderContent={() => <Fragment>foobar</Fragment>} icon="lib_actions_particles" />
          <Button icon="lib_actions_particles" />
          <Button icon="lib_actions_traffic" />
        </ButtonGroup>
      </Section>

      <Section title="Groups">
        <ButtonGroup>
          <Button appendRight icon="lib_actions_force_layout" />
          <Button appendLeft icon="lib_actions_flow_layout" />
        </ButtonGroup>
        <ButtonGroup vertical>
          <Button appendBottom icon="lib_actions_zoom_in" />
          <Button appendTop icon="lib_actions_zoom_out" />
        </ButtonGroup>
      </Section>

      <Section title="Active">
        <ButtonGroup>
          <Button icon="lib_actions_particles" isActive />
          <Button icon="lib_actions_traffic" />
        </ButtonGroup>
      </Section>
    </Root>
  );
}
