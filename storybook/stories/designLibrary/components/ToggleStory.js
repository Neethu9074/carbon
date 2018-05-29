import { storiesOf } from '@storybook/react';
import React from 'react';

import ToggleButton from 'in-new-components/ToggleButton';
import Toggle from 'in-components/form/Toggle';

import Section from '../../_helpers/Section';
import Root from '../../_helpers/Root';

storiesOf('designLibrary/Components/Toggle', module)
  .add('Toggle', () => <ToggleStory />)
  .add('ToggleButton', () => <ToggleButtonStory />);

function ToggleStory() {
  return (
    <Root>
      <Section title="On">
        <Toggle checked onChange={() => {}} />
      </Section>

      <Section title="Off">
        <Toggle checked={false} onChange={() => {}} />
      </Section>

      <Section title="On-disabled">
        <Toggle checked disabled onChange={() => {}} />
      </Section>

      <Section title="Off-disabled">
        <Toggle checked={false} disabled onChange={() => {}} />
      </Section>
    </Root>
  );
}

function ToggleButtonStory() {
  return (
    <Root>
      <p>
        The ToggleButton is currently only used in the top navigation to toggle between live and non-live. It is always
        rendered on a black background, that's why we render it on a black background here as well.
      </p>

      <Section title="With icons and hover effects">
        <BlackBackground>
          <StatefulToggleButton />
        </BlackBackground>
      </Section>

      <Section title="On">
        <BlackBackground>
          <ToggleButton checked onChange={() => {}}>
            LIVE
          </ToggleButton>
        </BlackBackground>
      </Section>

      <Section title="Off">
        <BlackBackground>
          <ToggleButton checked={false} onChange={() => {}} style={{ fontWeight: 'bold' }}>
            LIVE
          </ToggleButton>
        </BlackBackground>
      </Section>

      <Section title="On-disabled">
        <BlackBackground>
          <ToggleButton checked disabled onChange={() => {}} style={{ fontWeight: 'bold' }}>
            LIVE
          </ToggleButton>
        </BlackBackground>
      </Section>

      <Section title="Off-disabled">
        <BlackBackground>
          <ToggleButton checked={false} disabled onChange={() => {}} style={{ fontWeight: 'bold' }}>
            LIVE
          </ToggleButton>
        </BlackBackground>
      </Section>

      <Section title="Toggle by link (rendered as anchor instead of button)">
        <BlackBackground>
          <ToggleButton checked href={'#'} style={{ fontWeight: 'bold' }}>
            LIVE
          </ToggleButton>
        </BlackBackground>
      </Section>
    </Root>
  );
}

function BlackBackground({ children }) {
  return (
    <div
      style={{
        background: 'black',
        padding: '1rem'
      }}
    >
      {children}
    </div>
  );
}

class StatefulToggleButton extends React.Component {
  static displayName = 'ToggleButtonWithState';

  state = {
    checked: false
  };

  render() {
    return (
      <Root>
        <ToggleButton
          checked={this.state.checked}
          onChange={() => {
            this.setState({ checked: !this.state.checked });
          }}
          iconOff="lib_actions_play"
          iconOn="lib_actions_loading"
          iconOnSpinning="clockwise"
          iconOnHover="lib_actions_stop"
          style={{ fontWeight: 'bold' }}
        >
          LIVE
        </ToggleButton>
      </Root>
    );
  }
}
