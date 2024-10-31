/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { fromJS } from 'immutable';
import React from 'react';

import { Button, Message, Stack } from '@instana/components';

import { fullyQualified } from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/AlertChannels/configs';
import { clickTestAlertChannelTracker, alertChannelCTATrackerSegment } from 'in-settings/tracker';
import { SETTINGS_ALERT_CHANNEL_TEST_CLICK } from 'in-services/tracking/eventNames';
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
      // Todo - modernize
      alertChannelCTATrackerSegment({
        EVENT_NAME: SETTINGS_ALERT_CHANNEL_TEST_CLICK,
        path: '',
        channel: this.props.alertChannel.get('kind'),
        additionalLabel: this.props.alertChannel.get('id')
      });
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
        alertChannelCTATrackerSegment({
          EVENT_NAME: SETTINGS_ALERT_CHANNEL_TEST_CLICK,
          path: '',
          channel: this.props.alertChannel.get('kind'),
          additionalLabel: this.props.alertChannel.get('id')
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
        alertChannelCTATrackerSegment({
          EVENT_NAME: SETTINGS_ALERT_CHANNEL_TEST_CLICK,
          path: '',
          channel: this.props.alertChannel.get('kind'),
          additionalLabel: this.props.alertChannel.get('id')
        });
      }
    );
  }

  render() {
    return (
      <div>
        <Section className="test_channel_dialog">
          <Stack>
            <Button
              kind="info"
              icon={this.state.loading ? 'lib_actions_loading' : null}
              iconSpinning
              onClick={() => {
                this.test(this.props.alertChannel, this.props.form);
              }}
              disabled={!this.props.form.hierarchyValid && this.props.form.touched}
            >
              {this.props.testAlertChannelLabel || t('in-settings:tabs.testChannel')}
            </Button>
            {this.state.message && !this.state.loading ? (
              <Message
                type={this.state.errorResponse || this.state.error ? 'error' : 'success'}
                title={this.state.errorResponse || this.state.error ? 'Test Failed' : 'Test Successful'}
                description={
                  this.state.errorResponse || this.state.error
                    ? this.state.message
                    : t('in-settings:testAlertChannelSuccess', { channel: this.props.alertChannelLabel })
                }
              />
            ) : null}
          </Stack>
        </Section>
      </div>
    );
  }
}
