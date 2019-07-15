import { storiesOf } from '@storybook/react';
import React from 'react';

import { KubernetesServiceToInstanaServicesButton } from 'in-kubernetes/components/KubernetesServiceToInstanaServicesButton';
import OverlayPresenter from 'in-new-components/overlays/OverlayPresenter';

import Section from '../_helpers/Section';
import Root from '../_helpers/Root';

storiesOf('Application/Service', module).add('Service List Popup', () => <ServiceListPopupStory />);

function ServiceListPopupStory() {
  return (
    <Root>
      <Section title="One Service">
        <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
          <KubernetesServiceToInstanaServicesButton
            instanaServices={[
              {
                id: 42,
                label: 'foobar',
                metrics: { maxSeverity: [[0, 0]], latencyAgg: [[0, 123]], errorsAgg: [[0, 0]], callsAgg: [[0, 1234]] }
              }
            ]}
          />
          <OverlayPresenter />
        </div>
      </Section>

      <Section title="Many Services">
        <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
          <KubernetesServiceToInstanaServicesButton
            instanaServices={[
              {
                id: 42,
                label: 'foobar',
                metrics: { maxSeverity: [[0, 0]], latencyAgg: [[0, 123]], errorsAgg: [[0, 0]], callsAgg: [[0, 1234]] }
              },
              {
                id: 43,
                label: 'very long label which is very long. seriously, this is a long label',
                metrics: {
                  maxSeverity: [[0, 5]],
                  latencyAgg: [[0, 1230]],
                  errorsAgg: [[0, 0.5]],
                  callsAgg: [[0, 1234]]
                }
              },
              {
                id: 44,
                label: 'foobar',
                metrics: {
                  maxSeverity: [[0, 10]],
                  latencyAgg: [[0, 12300]],
                  errorsAgg: [[0, 1]],
                  callsAgg: [[0, 1234]]
                }
              },
              {
                id: 45,
                label: 'foobar',
                metrics: { maxSeverity: [[0, 0]], latencyAgg: [[0, 123]], errorsAgg: [[0, 0]], callsAgg: [[0, 1234]] }
              },
              {
                id: 46,
                label: 'foobar',
                metrics: {
                  maxSeverity: [[0, 5]],
                  latencyAgg: [[0, 7645]],
                  errorsAgg: [[0, 0.125]],
                  callsAgg: [[0, 1234]]
                }
              },
              {
                id: 47,
                label: 'foobar',
                metrics: {
                  maxSeverity: [[0, 5]],
                  latencyAgg: [[0, 7645]],
                  errorsAgg: [[0, 0.125]],
                  callsAgg: [[0, 1234]]
                }
              }
            ]}
          />
          <OverlayPresenter />
        </div>
      </Section>
    </Root>
  );
}
