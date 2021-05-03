/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { fromJS } from 'immutable';
import React from 'react';

import { Button } from '@instana/components';

import { fullyQualified } from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/AlertChannels/configs';
import Notification from 'in-components/form/Notification';
import { alertChannelTest } from 'in-api/alertChannels';
import Section from 'in-settings/components/Section';
import { t } from 'in-i18n';

export default class extends React.Component {
  static displayName = 'AlertChannelTestButton';

  constructor(params) {
    super(params);
    this.state = {
      error: false,
      loading: false,
      message: null
    };
  }

  test(alertChannel, form) {
    if (!this.props.form.hierarchyValid) {
      this.props.setForm(this.props.form.setTouched(true, { recurse: true }));
      return;
    }

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
          message: response.get('result')
        });
      },
      error => {
        this.setState({
          loading: false,
          error: true,
          message: error.message
        });
      }
    );
  }

  render() {
    return (
      <div>
        <Section>
          <Button
            kind="primaryv2"
            icon={this.state.loading ? 'lib_actions_loading' : null}
            iconSpinning
            onClick={() => this.test(this.props.alertChannel, this.props.form)}
            disabled={!this.props.form.hierarchyValid && this.props.form.touched}
          >
            {t('in-settings:tabs.testChannel')}
          </Button>
          {this.state.message ? <Notification failure={this.state.error}>{this.state.message}</Notification> : null}
        </Section>
      </div>
    );
  }
}
