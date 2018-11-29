import { createLogger } from 'instalog';
import React, { Fragment } from 'react';

import { getLinkColumn, getDeleteButtonColumn } from 'in-views/configurationView/components/tableColumnPresets';
import { getEntityIdPath, dynamicRulePath } from 'in-stores/navigation/paths/settingPaths';
import { getDynamicRules, deleteDynamicRule } from 'in-api/dynamicRules';
import SectionHeading from 'in-views/configurationView/components/SectionHeading';
import SubViewWrapper from 'in-views/configurationView/components/SubViewWrapper';
import SubViewHeader from 'in-views/configurationView/components/SubViewHeader';
import Section from 'in-views/configurationView/components/Section';
import { close } from 'in-components/DialogPresenter/store';
import Notification from 'in-components/form/Notification';
import { emptyList } from 'in-services/fixedImmutables';
import Table from 'in-sdk/components/dashboard/Table';
import PluginIcon from 'in-components/PluginIcon';
import { compare } from 'in-services/util/string';
import { goToPath } from 'in-stores/navigation';
import { getSingular } from 'in-sdk/pluginName';
import { getCategories } from 'in-sdk/metrics';
import Tooltip from 'in-components/Tooltip';
import Button from 'in-components/Button';

const logger = createLogger('DynamicRules');

const cols = [
  getLinkColumn(getEntityIdPath.bind(null, dynamicRulePath)),
  {
    title: 'Entity Type',
    type: 'custom',
    typeArgs: {
      comparator: compare,
      get(row) {
        const entityType = row.entity.getIn(['match', 'entityType']);
        return {
          value: entityType,
          content: (
            <Fragment>
              <PluginIcon dimension={16} color="#000" plugin={entityType} />
              &nbsp;&nbsp;
              {getSingular(entityType)}
            </Fragment>
          )
        };
      }
    }
  },
  {
    title: 'Metric',
    type: 'string',
    typeArgs: {
      getValue(row) {
        const metric = row.entity.getIn(['match', 'metricName']);
        return findMetricName(metric, getCategories(row.entity.getIn(['match', 'entityType']))) || metric;
      }
    }
  },
  {
    title: 'Triggering events',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.entity.get('enabled') ? 'Yes' : 'No';
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

    this.errorSubscription = result$.errors().once(error => {
      const message = `Failed to retrieve rules: ${error.message}`;
      logger.error(message, error);
      this.setState({
        error: true,
        loading: false,
        message
      });
    });
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
    goToPath(dynamicRulePath);
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
        key: rule.get('id'),
        onDelete: this.onDelete,
        entity: rule
      };
    });

    return (
      <SubViewWrapper>
        <SubViewHeader>Dynamic Rules</SubViewHeader>

        <Section>
          {rows.length >= 2 ? (
            <Tooltip content="Number of rules is restricted to 2.">
              <Button disabled kind="info" onClick={this.addNewRule}>
                Add New Rule
              </Button>
            </Tooltip>
          ) : (
            <Button kind="info" onClick={this.addNewRule}>
              Add New Rule
            </Button>
          )}

          {this.state.message ? (
            <Notification failure={this.state.error} loading={this.state.loading}>
              {this.state.message}
            </Notification>
          ) : null}
        </Section>

        {rulesAvailable ? (
          <Section>
            <SectionHeading>Custom Dynamic Rules</SectionHeading>

            <Table cols={cols} rows={rows} />
          </Section>
        ) : null}
      </SubViewWrapper>
    );
  }
}

function findMetricName(metric, tree, humanReadableMetricName) {
  if (!tree) {
    return null;
  }

  for (let i = 0, length = tree.length; i < length; i++) {
    const item = tree[i];
    if (item.type === 'category') {
      humanReadableMetricName = findMetricName(metric, item.children, humanReadableMetricName);
    }
    if (!humanReadableMetricName && item.metric === metric) {
      humanReadableMetricName = item.label;
    }
    if (humanReadableMetricName) {
      return humanReadableMetricName;
    }
  }
}
