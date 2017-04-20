import { createLogger } from 'instalog';
import React from 'react';

import { getRuleBindings, deleteRuleBinding, setEnabled } from 'in-services/api/ruleBindings';
import Table from 'in-views/configurationView/subview/RuleBindings/components/Table';
import SectionHeading from 'in-views/configurationView/components/SectionHeading';
import SubViewWrapper from 'in-views/configurationView/components/SubViewWrapper';
import SubViewHeader from 'in-views/configurationView/components/SubViewHeader';
import Section from 'in-views/configurationView/components/Section';
import { openRuleBinding } from 'in-stores/navigation/configuration';
import Notification from 'in-components/form/Notification';
import { close } from 'in-components/DialogPresenter/store';
import { emptyList } from 'in-services/fixedImmutables';
import Button from 'in-components/Button';

const logger = createLogger('RuleBindings');

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
    this.responseSubscription = result$.once(ruleBindings => {
      this.setState({
        error: false,
        loading: false,
        message: null,
        ruleBindings
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
    openRuleBinding();
  };

  onDeleteRuleBinding = ruleBindingId => {
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

    return (
      <SubViewWrapper>
        <SubViewHeader>
          Custom issues
        </SubViewHeader>

        <Section>
          <Button kind="info" onClick={this.addNewRuleBinding}>
            Add Custom Issue
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
                Custom Issues
              </SectionHeading>

              <Table
                items={ruleBindings}
                onDeleteRuleBinding={this.onDeleteRuleBinding}
                setEnabled={this.setEnabled}
                status={this.state.status}
              />
            </Section>
          : null}
      </SubViewWrapper>
    );
  }
}
