import { storiesOf } from '@storybook/react';
import React from 'react';

import Tag, { kinds } from 'in-new-components/Tag/Tag';

import Section from '../../_helpers/Section';
import Root from '../../_helpers/Root';

storiesOf('designLibrary/Components/Tag', module).add('Kinds', () => <Tags />);

function Tags() {
  return (
    <Root>
      {kinds.map(kind => {
        return (
          <Section key={kind} title={kind}>
            <Tag kind={kind}>{kind}</Tag>
          </Section>
        );
      })}
    </Root>
  );
}
