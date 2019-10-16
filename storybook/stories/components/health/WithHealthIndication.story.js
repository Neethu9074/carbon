import { storiesOf } from '@storybook/react';
import React from 'react';

import WithHealthIndication from 'in-components/health/WithHealthIndication';
import SvgIcon from 'in-components/SvgIcon';

import icons from 'in-components/SvgIcon/registry.json';

import Root from '../../_helpers/Root';
import Section from '../../_helpers/Section';

storiesOf('Components/health', module).add('Icon with Health Indication', () => <WithHealthIndicationStory />);

function WithHealthIndicationStory() {
  return (
    <Root>
      <Section title="Types">
        <WithHealthIndication healthInfo={{ maxSeverity: 0 }}>
          <SvgIcon type="lib_application" />
        </WithHealthIndication>
        <WithHealthIndication healthInfo={{ maxSeverity: 5 }}>
          <SvgIcon type="lib_application" />
        </WithHealthIndication>
        <WithHealthIndication healthInfo={{ maxSeverity: 10 }}>
          <SvgIcon type="lib_application" />
        </WithHealthIndication>
      </Section>

      <Section title="Sizes">
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flexEnd' }}>
          <WithHealthIndication healthInfo={{ maxSeverity: 10 }} iconSize="xxs">
            <SvgIcon style={{ padding: '0 2rem 2rem 0' }} type="lib_application" size="xxs" />
          </WithHealthIndication>
          <WithHealthIndication healthInfo={{ maxSeverity: 10 }} iconSize="xs">
            <SvgIcon style={{ padding: '0 2rem 2rem 0' }} type="lib_application" size="xs" />
          </WithHealthIndication>
          <WithHealthIndication healthInfo={{ maxSeverity: 10 }} iconSize="s">
            <SvgIcon style={{ padding: '0 2rem 2rem 0' }} type="lib_application" size="s" />
          </WithHealthIndication>
          <WithHealthIndication healthInfo={{ maxSeverity: 10 }} iconSize="regular">
            <SvgIcon style={{ padding: '0 2rem 2rem 0' }} type="lib_application" size="regular" />
          </WithHealthIndication>
          <WithHealthIndication healthInfo={{ maxSeverity: 10 }} iconSize="l">
            <SvgIcon style={{ padding: '0 2rem 2rem 0' }} type="lib_application" size="l" />
          </WithHealthIndication>
          <WithHealthIndication healthInfo={{ maxSeverity: 10 }} iconSize="xl">
            <SvgIcon style={{ padding: '0 2rem 2rem 0' }} type="lib_application" size="xl" />
          </WithHealthIndication>
          <WithHealthIndication healthInfo={{ maxSeverity: 10 }} iconSize="xxl">
            <SvgIcon style={{ padding: '0 2rem 2rem 0' }} type="lib_application" size="xxl" />
          </WithHealthIndication>
        </div>
      </Section>

      <Section title="All icons">
        <ul>
          {Object.keys(icons)
            .sort()
            .map(icon => (
              <li
                key={icon}
                style={{ display: 'inline-flex', alignItems: 'center', padding: '0.5rem 1rem', minWidth: '13rem' }}
              >
                <WithHealthIndication healthInfo={{ maxSeverity: 10 }}>
                  <SvgIcon type={icon} color="#000" spinning={icon === 'lib_actions_loading'} />
                </WithHealthIndication>
                <span style={{ paddingLeft: '0.8rem' }}>{icon}</span>
              </li>
            ))}
        </ul>
      </Section>
    </Root>
  );
}
