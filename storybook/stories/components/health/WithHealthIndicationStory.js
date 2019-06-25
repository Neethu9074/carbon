import { storiesOf } from '@storybook/react';
import React from 'react';

import WithHealthIndication from 'in-components/health/WithHealthIndication';
import SvgIcon from 'in-components/SvgIcon';

import Root from '../../_helpers/Root';
import Section from '../../_helpers/Section';

storiesOf('Components/health/WithHealthIndicationStory', module).add('default', () => <WithHealthIndicationStory />);

function WithHealthIndicationStory() {
  const sizes = [];
  for (let i = 6; i < 48; i++) {
    sizes[i] = i + 1;
  }

  return (
    <Root>
      <Section title="Types">
        <WithHealthIndication size={24} healthInfo={{ maxSeverity: 0 }}>
          <SvgIcon type="lib_application" width={24} height={24} />
        </WithHealthIndication>
        <WithHealthIndication size={24} healthInfo={{ maxSeverity: 5 }}>
          <SvgIcon type="lib_application" width={24} height={24} />
        </WithHealthIndication>
        <WithHealthIndication size={24} healthInfo={{ maxSeverity: 10 }}>
          <SvgIcon type="lib_application" width={24} height={24} />
        </WithHealthIndication>
      </Section>

      <Section title="Sizes">
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flexEnd', paddingRight: 16 }}>
          {sizes.map(size => (
            <WithHealthIndication healthInfo={{ maxSeverity: 10 }} size={size}>
              <SvgIcon style={{ margin: '0 2rem 2rem 0' }} type="lib_application" width={size} height={size} />
            </WithHealthIndication>
          ))}
        </div>
      </Section>
    </Root>
  );
}
