import { withKnobs } from '@storybook/addon-knobs/react';
import { storiesOf } from '@storybook/react';
import React from 'react';

import { number, ms, percentage } from 'in-services/formatters/number';
import AppKpiPresenter from 'in-components/Kpis/AppKpiPresenter';
import { KpiSection } from 'in-components/Kpis/KpiSection';
import Root from '../_helpers/Root';

storiesOf('old_components/KpiStory', module)
  .addDecorator(withKnobs)
  .add('AppKpi', () => <AppKpi />)
  .add('KpiError', () => <AppKpiError />)
  .add('KpiLoading', () => <AppKpiLoading />);

function AppKpi() {
  return (
    <Root>
      <h2>AppKpi</h2>

      <KpiSection>
        <AppKpiPresenter
          formatter={number}
          label="Calls"
          metricName="calls"
          result={{
            data: {
              calls: [[0, 15]]
            },
            errors: [],
            progress: {
              loading: false
            }
          }}
        />
        <AppKpiPresenter
          formatter={ms}
          label="Latency"
          metricName="latency"
          result={{
            data: {
              latency: [[0, 666]]
            },
            errors: [],
            progress: {
              loading: false
            }
          }}
        />
        <AppKpiPresenter
          formatter={percentage}
          label="Errors"
          metricName="errors"
          result={{
            data: {
              errors: [[0, 12]]
            },
            errors: [],
            progress: {
              loading: false
            }
          }}
        />
      </KpiSection>
    </Root>
  );
}

function AppKpiError() {
  return (
    <Root>
      <h2>Kpis with error</h2>

      <KpiSection>
        <AppKpiPresenter
          formatter={number}
          label="Calls"
          metricName="calls"
          result={{
            data: {
              calls: [[0, 15]]
            },
            errors: ['Something went wrong'],
            progress: {
              loading: false
            }
          }}
        />
      </KpiSection>
    </Root>
  );
}

function AppKpiLoading() {
  return (
    <Root>
      <h2>Kpis with error</h2>

      <KpiSection>
        <AppKpiPresenter
          formatter={number}
          label="Calls"
          metricName="calls"
          result={{
            data: {
              calls: [[0, 15]]
            },
            errors: [],
            progress: {
              loading: true
            }
          }}
        />
      </KpiSection>
    </Root>
  );
}

//label, result, metricName, formatter
