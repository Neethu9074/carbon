import { createLogger } from 'instalog';
import { fromJS } from 'immutable';
import React from 'react';

import {
  getLinkColumnWithBadge,
  getEnableToggleColumn,
  getDeleteButtonColumn
} from 'in-views/configurationView/components/tableColumnPresets';
import { getRule, isRuleDeprecated, getRuleLabelWithDeprecationFlag } from 'in-api/rules';
import { bindingPath, getEntityIdPath } from 'in-stores/navigation/paths/settingPaths';
import { getRuleBindings, deleteRuleBinding, setEnabled } from 'in-api/ruleBindings';
import SectionHeading from 'in-views/configurationView/components/SectionHeading';
import SubViewWrapper from 'in-views/configurationView/components/SubViewWrapper';
import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';
import SubViewHeader from 'in-views/configurationView/components/SubViewHeader';
import { formatDurationAccurately } from 'in-services/formatters/date';
import Section from 'in-views/configurationView/components/Section';
import { formatDateTime } from 'in-services/formatters/date';
import { close } from 'in-components/DialogPresenter/store';
import Notification from 'in-components/form/Notification';
import { combineLatest, just } from 'reactive-observables';
import { emptyList } from 'in-services/fixedImmutables';
import Table from 'in-sdk/components/dashboard/Table';
import { goToPath } from 'in-stores/navigation';
import Button from 'in-components/Button';
import connectTo from 'in-hoc/connectTo';
import { validate } from 'in-api/search';
import Title from 'in-components/Title';
import { twoZeroModeEnabled } from 'in-services/featureFlags';

import './RuleBindings.less';

const block = 'in-rule-bindings-form';
const logger = createLogger('RuleBindings');

function checkRuleDeprecation(ruleBinding) {
  const rule$ = getRule(ruleBinding.getIn(['ruleIds', 0], ''));
  return rule$
    .map(rule => getRuleDeprecationBadgeText(isRuleDeprecated(rule)))
    .map(deprecationText => extendBadgeMessage(ruleBinding, deprecationText));
}

function getRuleDeprecationBadgeText(ruleDeprecatedFlag) {
  if (twoZeroModeEnabled && ruleDeprecatedFlag) {
    return 'Rule is deprecated';
  } else {
    return '';
  }
}

function getDfqValidationBadgeText(dfqValidFlag) {
  if (twoZeroModeEnabled && !dfqValidFlag) {
    return 'Dynamic Focus query is deprecated';
  } else {
    return '';
  }
}

function validateDfq(ruleBinding) {
  if (twoZeroModeEnabled && ruleBinding.get('query')) {
    return validate({
      query: ruleBinding.get('query'),
      newApplicationModelEnabled: true
    }).map(response => extendBadgeMessage(ruleBinding, getDfqValidationBadgeText(response.body.valid)));
  } else {
    return just(ruleBinding);
  }
}

function extendBadgeMessage(ruleBinding, text) {
  if (!text) {
    return ruleBinding;
  }
  if (!ruleBinding.get('badgeMessage')) {
    return ruleBinding.set('badgeMessage', text);
  }
  return ruleBinding.set('badgeMessage', ruleBinding.get('badgeMessage') + ', ' + text);
}

const cols = [
  getLinkColumnWithBadge(
    getEntityIdPath.bind(null, bindingPath),
    entity => entity.get('badgeMessage'),
    entity => entity.get('badgeMessage'),
    'text'
  ),
  getEnableToggleColumn(),
  getDeleteButtonColumn('text')
];

export default class extends React.Component {
  static displayName = 'RuleBindings';

  state = {
    loading: true,
    error: false,
    message: null,
    ruleBindings: emptyList,
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
      message: 'Loading custom issues…'
    });

    const result$ = getRuleBindings();
    this.responseSubscription = result$
      .flatMap(ruleBindings => {
        return combineLatest(ruleBindings.toArray().map(ruleBinding => checkRuleDeprecation(ruleBinding)));
      })
      .flatMap(ruleBindings => {
        return combineLatest(ruleBindings.map(ruleBinding => validateDfq(ruleBinding)));
      })
      .once(ruleBindings => {
        this.setState({
          error: false,
          loading: false,
          message: null,
          ruleBindings: fromJS(ruleBindings)
        });
      });

    this.errorSubscription = result$.errors().once(error => {
      const message = `Failed to retrieve custom issues: ${error.message}`;
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

  addNewRuleBinding = () => {
    this.disposeAsyncAction();

    // just open the rule dialog without an id will create a new one in the dialog
    goToPath(bindingPath);
  };

  onDelete = ruleBinding => {
    const ruleBindingId = ruleBinding.get('id');
    this.setState({
      error: false,
      loading: true,
      message: `Removing custom issue ${ruleBindingId}`
    });

    const result$ = deleteRuleBinding(ruleBindingId);
    this.responseSubscription = result$.once(() => {
      this.setState({
        error: false,
        loading: false,
        message: null,
        ruleBindings: this.state.ruleBindings.filter(eachRule => eachRule.get('id') !== ruleBindingId)
      });
    });

    this.errorSubscription = result$.errors().once(error => {
      const message = `Failed to remove custom issue ${ruleBindingId}: ${error.message}`;
      logger.error(message, error);
      this.setState({
        error: true,
        loading: false,
        message
      });
    });
    close();
  };

  setEnabled = (ruleBinding, enabled) => {
    const previousEnabled = ruleBinding.get('enabled');
    const ruleBindingId = ruleBinding.get('id');

    this.setState(state => {
      state.status[ruleBindingId] = {
        state: 'loading',
        time: Date.now(),
        message: 'Saving custom issue…'
      };

      const index = state.ruleBindings.findIndex(eachRuleBinding => ruleBindingId === eachRuleBinding.get('id'));
      const newRuleBindings = state.ruleBindings.update(index, modifiableRuleBindings =>
        modifiableRuleBindings.set('enabled', enabled)
      );
      return {
        status: state.status,
        ruleBindings: newRuleBindings
      };
    });

    const result$ = setEnabled(ruleBinding, enabled);
    result$.once(() => {
      this.setState(state => {
        state.status[ruleBindingId] = {
          state: 'success',
          time: Date.now(),
          message: 'Rule binding change successfully saved!'
        };

        return {
          status: state.status
        };
      });
    });

    result$.errors().once(error => {
      const message = `Failed to set ruleBindings enable flag: ${error.message}`;
      logger.warn(message, error);

      this.setState(state => {
        state.status[ruleBindingId] = {
          state: 'failure',
          time: Date.now(),
          message
        };

        // roll back the role change
        const index = state.ruleBindings.findIndex(eachRuleBinding => ruleBindingId === eachRuleBinding.get('id'));
        const newRuleBindings = state.ruleBindings.update(index, modifiableRuleBindings =>
          modifiableRuleBindings.set('enabled', previousEnabled)
        );
        return {
          status: state.status,
          ruleBindings: newRuleBindings
        };
      });
    });
  };

  render() {
    const { ruleBindings } = this.state;
    const rulesAvailable = ruleBindings && ruleBindings.size > 0;

    const rows = ruleBindings.toArray().map(ruleBinding => {
      return {
        key: ruleBinding.get('id'),
        entity: ruleBinding,
        onDelete: this.onDelete,
        setEnabled: this.setEnabled,
        status: this.state.status[ruleBinding.get('id')]
      };
    });

    return (
      <SubViewWrapper>
        <Title title="Custom Issues" />
        <SubViewHeader>Custom Issues</SubViewHeader>

        <Section>
          <Button kind="info" onClick={this.addNewRuleBinding}>
            Add Custom Issue
          </Button>

          {this.state.message ? (
            <Notification failure={this.state.error} loading={this.state.loading}>
              {this.state.message}
            </Notification>
          ) : null}
        </Section>

        {rulesAvailable ? (
          <Section>
            <SectionHeading>Custom Issues</SectionHeading>

            <Table cols={cols} rows={rows} getRowDetails={getRowDetails} maxItemsPerPage={20} />
          </Section>
        ) : null}
      </SubViewWrapper>
    );
  }
}

function getRowDetails(row) {
  return <Details ruleBinding={row.entity} />;
}

const Details = connectTo(
  props => {
    return {
      rule: getRule(props.ruleBinding.getIn(['ruleIds', 0], ''))
    };
  },
  function Details({ ruleBinding, rule }) {
    return (
      <div className={`${block}__details-wrapper`}>
        <DescriptionList>
          <DescriptionItem title="Text">{ruleBinding.get('text')}</DescriptionItem>
          <DescriptionItem title="Description">{ruleBinding.get('description')}</DescriptionItem>
          <DescriptionItem title="Grace period">
            {formatDurationAccurately(ruleBinding.get('expirationTime'), 1000)}
          </DescriptionItem>
          <DescriptionItem title="Severity" className={`${block}__severity`}>
            {mapSeverityToLabel(ruleBinding.get('severity'))}
          </DescriptionItem>
          <DescriptionItem title="Triggering incident">
            {ruleBinding.get('triggering') ? 'true' : 'false'}
          </DescriptionItem>
          <DescriptionItem title="Bound rule">
            {rule ? getRuleLabelWithDeprecationFlag(rule) : ruleBinding.getIn(['ruleIds', 0], '')}
          </DescriptionItem>
          <DescriptionItem title="Applied on filter query">{ruleBinding.get('query', '')}</DescriptionItem>

          <DescriptionItem title="Last update">{formatDateTime(ruleBinding.get('lastUpdated'))}</DescriptionItem>
        </DescriptionList>
      </div>
    );
  }
);

function mapSeverityToLabel(severity) {
  if (severity === 0) {
    return 'change';
  } else if (severity === 5) {
    return 'warning';
  } else {
    return 'critical';
  }
}
