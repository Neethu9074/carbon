import { withKnobs, boolean, select } from '@storybook/addon-knobs/react';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import React from 'react';

import { kinds, sizes } from 'in-new-components/Button';
import Button from 'in-new-components/Button';

import Section from '../../_helpers/Section';
import Root from '../../_helpers/Root';

const onClick = action('click');

storiesOf('designLibrary/Components/Button', module)
  .addDecorator(withKnobs)
  .add('Button', () => <ButtonStory />);

function ButtonStory() {
  const href = boolean('Render as link?', false) ? 'http://example.com' : null;
  const icon = boolean('With icon?', false) ? 'lib_actions_filter' : null;
  const size = select('Size?', sizes, 'normal');

  return (
    <Root>
      <Section title="Without Modifiers">
        <p>
          {kinds.map(kind => (
            <Button kind={kind} size={size} key={kind} onClick={onClick} href={href} icon={icon}>
              {kind}
            </Button>
          ))}
        </p>
      </Section>

      <Section title="Disabled">
        <p>
          {kinds.map(kind => (
            <Button kind={kind} size={size} disabled key={kind} href={href} icon={icon}>
              {kind}
            </Button>
          ))}
        </p>
      </Section>
    </Root>
  );
}
