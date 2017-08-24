import { createLogger } from 'instalog';
import React from 'react';

import { getLinkColumn } from 'in-views/configurationView/components/tableColumnPresets';
import SectionHeading from 'in-views/configurationView/components/SectionHeading';
import SubViewWrapper from 'in-views/configurationView/components/SubViewWrapper';
import { getForecastRules, deleteForecastRule } from 'in-services/api/forecasts';
import SubViewHeader from 'in-views/configurationView/components/SubViewHeader';
import { getForecastRuleLink } from 'in-stores/navigation/configuration';
import { getMetricDefinition } from 'in-sdk/metrics/metricDefinitions';
import { openForecastRule } from 'in-stores/navigation/configuration';
import Section from 'in-views/configurationView/components/Section';
import { close } from 'in-components/DialogPresenter/store';
import Notification from 'in-components/form/Notification';
import { emptyList } from 'in-services/fixedImmutables';
import Table from 'in-sdk/components/dashboard/Table';
import { always } from 'in-services/fixedStreams';
import { getSnapshot } from 'in-stores/snapshot';
import Button from 'in-components/Button';
import connectTo from 'in-hoc/connectTo';
import Chart from 'in-components/Chart';

const logger = createLogger('Forecasts');

const cols = [
  getLinkColumn(getForecastRuleLink),
  {
    title: 'Entity',
    type: 'snapshotLink',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      }
    }
  },
  {
    title: 'Metric',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.metricName;
      }
    }
  }
];

export default class extends React.Component {
  static displayName = 'Forecasts';

  state = {
    loading: true,
    error: false,
    message: null,
    forecasts: emptyList,
    status: {}
  };

  componentWillMount() {
    this.refreshRules();
  }

  refreshRules = () => {
    this.disposeAsyncAction();

    this.setState({
      error: false,
      loading: true,
      message: 'Loading forecasts…'
    });

    const result$ = getForecastRules();
    this.responseSubscription = result$.once(forecasts => {
      this.setState({
        error: false,
        loading: false,
        message: null,
        forecasts
      });
    });

    // this.errorSubscription = result$.errors().once(error => {
    //   const message = `Failed to retrieve forecasts: ${error.message}`;
    //   logger.error(message, error);
    //   this.setState({
    //     error: true,
    //     loading: false,
    //     message
    //   });
    // });
  };

  componentWillUnmount() {
    this.disposeAsyncAction();
  }

  disposeAsyncAction = () => {
    if (this.responseSubscription) {
      this.responseSubscription.dispose();
    }

    if (this.errorSubscription) {
      this.errorSubscription.dispose();
    }
  };

  addNewRule = () => {
    this.disposeAsyncAction();

    // just open the rule dialog without an id will create a new one in the dialog
    openForecastRule();
  };

  onDelete = rule => {
    const ruleId = rule.get('id');
    this.setState({
      error: false,
      loading: true,
      message: `Removing rule ${ruleId}`
    });

    const result$ = deleteForecastRule(ruleId);
    this.responseSubscription = result$.once(() => {
      this.setState({
        error: false,
        loading: false,
        message: null,
        forecasts: this.state.forecasts.filter(eachRule => eachRule.get('id') !== ruleId)
      });
    });

    this.errorSubscription = result$.errors().once(error => {
      const message = `Failed to remove rule ${ruleId}: ${error.message}`;
      logger.error(message, error);
      this.setState({
        error: true,
        loading: false,
        message
      });
    });
    close();
  };

  render() {
    const { forecasts } = this.state;
    const rulesAvailable = forecasts && forecasts.size > 0;

    const rows = forecasts.toArray().map(rule => {
      return {
        key: rule.get('snapshotId') + rule.get('metricName'),
        snapshotId: rule.get('snapshotId'),
        metricName: rule.get('metricName'),
        entity: rule
      };
    });

    return (
      <SubViewWrapper>
        <SubViewHeader>
          Forecasts
        </SubViewHeader>

        <Section>
          <Button kind="info" onClick={this.addNewRule}>
            Add New Forecast Rule
          </Button>

          {this.state.message
            ? <Notification failure={this.state.error} loading={this.state.loading}>
                {this.state.message}
              </Notification>
            : null}
        </Section>

        {rulesAvailable
          ? <Section>
              <SectionHeading>
                Custom forecast rules
              </SectionHeading>

              <Table cols={cols} rows={rows} getRowDetails={getRowDetails} />
            </Section>
          : null}
      </SubViewWrapper>
    );
  }
}

function getRowDetails(row) {
  return <RowDetails snapshotId={row.snapshotId} row={row} />;
}

const RowDetails = connectTo(
  props => {
    return {
      snapshot: getSnapshot(props.snapshotId)
    };
  },
  function getRowDetails({ snapshot, row }) {
    if (!snapshot) {
      return null;
    }

    const metricDefinition = getMetricDefinition(snapshot.get('plugin'), row.metricName);
    const timeframe = {
      windowSize: 1000 * 60 * 60 * 24 * 14,
      to: Date.now() + 1000 * 60 * 60 * 24
    };
    return (
      <div>
        <Chart
          snapshotId={row.snapshotId}
          timeframe={timeframe}
          timeframe$={always(timeframe)}
          margins={{
            left: 80
          }}
          y1={{
            min: 0,
            metrics: [row.metricName],
            labels: [metricDefinition.label],
            type: 'line',
            formatter: metricDefinition.formatter.compact
          }}
        />
      </div>
    );
  }
);
