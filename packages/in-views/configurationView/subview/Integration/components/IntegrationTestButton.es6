import React from 'react';
import { fromJS } from 'immutable';
import { integrationTest } from 'in-api/integrations';
import { fullyQualified } from 'in-views/configurationView/subview/Integration/configs';
import Notification from 'in-components/form/Notification';
import Section from 'in-views/configurationView/components/Section';
import Button from 'in-components/Button';

export default class extends React.Component {
  static displayName = 'IntegrationTestButton';

  constructor(params) {
    super(params);
    this.state = {
      integration: params.integration,
      form: params.form,
      error: false,
      loading: false,
      message: null
    };
  }

  test(integration, form) {
    if (!this.state.form.hierarchyValid) {
      this.setState({
        form: this.state.form.setTouched(true, { recurse: true })
      });
      return;
    }

    this.setState({
      loading: true,
      error: false,
      message: 'Loading...'
    });
    return integrationTest(fromJS(fullyQualified[integration.get('kind')].createEntity(integration, form))).subscribe(
      error => {
        if (error) {
          this.setState({
            loading: false,
            error: true,
            message: { error }
          });
        } else {
          this.setState({
            loading: false,
            message: 'Send'
          });
        }
      }
    );
  }

  render() {
    return (
      <div>
        <Section>
          <Button
            kind="success"
            onClick={() => this.test(this.state.integration, this.state.form)}
            disabled={!this.state.form.hierarchyValid && this.state.form.touched}
          >
            Test
          </Button>
          {this.state.message ? (
            <Notification failure={this.state.error} loading={this.state.loading}>
              {this.state.message}
            </Notification>
          ) : null}
        </Section>
      </div>
    );
  }
}
