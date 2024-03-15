/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { fromJS } from 'immutable';
import React from 'react';

import { Message } from '@instana/components';
import { Button } from '@instana/legacy';

import { fullyQualified } from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/AlertChannels/configs';
import { clickTestAlertChannelTracker } from 'in-settings/tracker';
import { alertChannelTest } from 'in-api/alertChannels';
import Section from 'in-settings/components/Section';
import { t } from 'in-i18n';

import './AlertChannelTestButton.less';

export default class extends React.Component {
  static displayName = 'AlertChannelTestButton';

  constructor(params) {
    super(params);
    this.state = {
      error: false,
      loading: false,
      message: null,
      errorResponse: false
    };
  }

  test(alertChannel, form) {
    if (!this.props.form.hierarchyValid) {
      this.props.setForm(this.props.form.setTouched(true, { recurse: true }));
      clickTestAlertChannelTracker({
        alertChannelLabel: this.props.alertChannel.get('kind'),
        testError: true,
        testMessage: 'Invalid form configuration'
      });
      return;
    }

    const successMessage = 'Alerting Channel was successfully triggered, please check the channel!';

    this.setState({
      loading: true,
      error: false,
      message: t('in-settings:tabs.loading')
    });
    return alertChannelTest(
      fromJS(fullyQualified[alertChannel.get('kind')].createEntity(alertChannel, form))
    ).subscribe(
      response => {
        this.setState({
          loading: false,
          message: response.get('result'),
          errorResponse: response.get('result') && response.get('result') === successMessage ? false : true
        });
        clickTestAlertChannelTracker({
          alertChannelLabel: this.props.alertChannel.get('kind'),
          testError: this.state.errorResponse || this.state.error,
          testMessage: this.state.message
        });
      },
      error => {
        this.setState({
          loading: false,
          error: true,
          message: error.message
        });
        clickTestAlertChannelTracker({
          alertChannelLabel: this.props.alertChannel.get('kind'),
          testError: this.state.errorResponse || this.state.error,
          testMessage: this.state.message
        });
      }
    );
  }

  render() {
    return (
      <div>
        <Section className="test_channel_dialog">
          <Button
            kind="info"
            icon={this.state.loading ? 'lib_actions_loading' : null}
            iconSpinning
            onClick={() => {
              this.test(this.props.alertChannel, this.props.form);
            }}
            disabled={!this.props.form.hierarchyValid && this.props.form.touched}
            className="test_channel_dialog_child"
          >
            {t('in-settings:tabs.testChannel')}
          </Button>
          {this.state.message && !this.state.loading ? (
            <Message
              withIcon
              type={this.state.errorResponse || this.state.error ? 'error' : 'success'}
              title={this.state.errorResponse || this.state.error ? 'Test Failed' : 'Test Successful'}
              description={
                this.state.errorResponse || this.state.error
                  ? this.state.message
                  : t('in-settings:testAlertChannelSuccess', { channel: this.props.alertChannelLabel })
              }
              className="test_channel_dialog_child"
              bold
              small
            />
          ) : null}
        </Section>
      </div>
    );
  }
}
