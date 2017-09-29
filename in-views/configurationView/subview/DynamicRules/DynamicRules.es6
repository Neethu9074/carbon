/* eslint-disable react/no-multi-comp, react/prop-types */
import { createLogger } from 'instalog';
import React from 'react';

import { getLinkColumn, getDeleteButtonColumn } from 'in-views/configurationView/components/tableColumnPresets';
import { getDynamicRules, deleteDynamicRule } from 'in-services/api/dynamicRules';
import SectionHeading from 'in-views/configurationView/components/SectionHeading';
import SubViewWrapper from 'in-views/configurationView/components/SubViewWrapper';
import SubViewHeader from 'in-views/configurationView/components/SubViewHeader';
import { getDynamicRuleLink } from 'in-stores/navigation/configuration';
import { getMetricDefinition } from 'in-sdk/metrics/metricDefinitions';
import { openDynamicRule } from 'in-stores/navigation/configuration';
import Section from 'in-views/configurationView/components/Section';
import { close } from 'in-components/DialogPresenter/store';
import Notification from 'in-components/form/Notification';
import { emptyList } from 'in-services/fixedImmutables';
import Table from 'in-sdk/components/dashboard/Table';
import { always } from 'in-services/fixedStreams';
import { getSnapshot } from 'in-stores/snapshot';
import Slider from 'in-components/Slider';
import Button from 'in-components/Button';
import connectTo from 'in-hoc/connectTo';
import Chart from 'in-components/Chart';

import 'in-views/configurationView/subview/DynamicRules/DynamicRules.less';

const logger = createLogger('DynamicRules');
const block = 'in-dynamic-rule-config';

const cols = [
  getLinkColumn(getDynamicRuleLink),
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
  },
  getDeleteButtonColumn()
];

export default class extends React.Component {
  static displayName = 'DynamicRules';

  state = {
    loading: true,
    error: false,
    message: null,
    rules: emptyList,
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
      message: 'Loading dynamic rules…'
    });

    const result$ = getDynamicRules();
    this.responseSubscription = result$.once(rules => {
      this.setState({
        error: false,
        loading: false,
        message: null,
        rules
      });
    });

    // this.errorSubscription = result$.errors().once(error => {
    //   const message = `Failed to retrieve rules: ${error.message}`;
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
    openDynamicRule();
  };

  onDelete = rule => {
    const ruleId = rule.get('id');
    this.setState({
      error: false,
      loading: true,
      message: `Removing rule ${ruleId}`
    });

    const result$ = deleteDynamicRule(ruleId);
    this.responseSubscription = result$.once(() => {
      this.setState({
        error: false,
        loading: false,
        message: null,
        rules: this.state.rules.filter(eachRule => eachRule.get('id') !== ruleId)
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
    const { rules } = this.state;
    const rulesAvailable = rules && rules.size > 0;

    const rows = rules.toArray().map(rule => {
      return {
        key: rule.get('snapshotId') + rule.get('metricName'),
        snapshotId: rule.get('snapshotId'),
        metricName: rule.get('metricName'),
        onDelete: this.onDelete,
        entity: rule
      };
    });

    return (
      <SubViewWrapper>
        <SubViewHeader>DynamicRules</SubViewHeader>

        <Section>
          <Button kind="info" onClick={this.addNewRule}>
            Add New Dynamic Rule
          </Button>

          {this.state.message ? (
            <Notification failure={this.state.error} loading={this.state.loading}>
              {this.state.message}
            </Notification>
          ) : null}
        </Section>

        {rulesAvailable ? (
          <Section>
            <SectionHeading>Custom dynamic rules</SectionHeading>

            <Table cols={cols} rows={rows} getRowDetails={getRowDetails} />
          </Section>
        ) : null}
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
  class extends React.Component {
    static displayName = 'getRowDetails';

    state = {
      sensitivity: 99
    };

    render() {
      const { snapshot, row } = this.props;
      if (!snapshot) {
        return null;
      }

      const sensitivity = this.state.sensitivity;
      const metricDefinition = getMetricDefinition(snapshot.get('plugin'), row.metricName);
      const timeframe = {
        windowSize: 1000 * 60 * 60 * 24 * 14,
        to: Date.now() + 1000 * 60 * 60 * 24
      };
      return (
        <div>
          <Slider
            onChange={e => {
              this.setState({
                sensitivity: e.target.value
              });
            }}
            min={0}
            max={100}
            step={1}
            value={sensitivity}
            className={block + '__slider'}
          />
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
              formatter: metricDefinition.formatter.compact,
              forecastSensitivity: sensitivity
            }}
          />
        </div>
      );
    }
  }
);
