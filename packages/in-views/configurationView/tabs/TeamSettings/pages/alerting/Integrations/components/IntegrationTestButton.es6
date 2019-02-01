import { fromJS } from 'immutable';
import React from 'react';

import { fullyQualified } from 'in-views/configurationView/tabs/TeamSettings/pages/alerting/Integrations/configs';
import Section from 'in-views/configurationView/components/Section';
import Notification from 'in-components/form/Notification';
import { integrationTest } from 'in-api/integrations';
import Button from 'in-new-components/Button';

export default class extends React.Component {
  static displayName = 'IntegrationTestButton';

  constructor(params) {
    super(params);
    this.state = {
      error: false,
      loading: false,
      message: null
    };
  }

  test(integration, form) {
    if (!this.props.form.hierarchyValid) {
      this.props.setForm(this.props.form.setTouched(true, { recurse: true }));
      return;
    }

    this.setState({
      loading: true,
      error: false,
      message: 'Loading...'
    });
    return integrationTest(fromJS(fullyQualified[integration.get('kind')].createEntity(integration, form))).subscribe(
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
            icon={this.state.loading ? 'spinner' : null}
            iconSpinning
            onClick={() => this.test(this.props.integration, this.props.form)}
            disabled={!this.props.form.hierarchyValid && this.props.form.touched}
          >
            Test Integration
          </Button>
          {this.state.message ? <Notification failure={this.state.error}>{this.state.message}</Notification> : null}
        </Section>
      </div>
    );
  }
}
