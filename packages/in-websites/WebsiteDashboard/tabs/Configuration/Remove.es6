import { get } from 'lodash';
import React from 'react';

import HelpParagraph from 'in-websites/WebsiteDashboard/tabs/Configuration/HelpParagraph';
import { websitesPathFullyQualified } from 'in-websites/navigation/paths';
import { goToPath } from 'in-stores/navigation/navigation';
import { combineDataAndError } from 'in-services/util/ro';
import SaveError from 'in-components/form/SaveError';
import { removeKey } from 'in-api/eumKeys';
import Card from 'in-new-components/Card';
import Button from 'in-new-components/Button';

import locals from './Remove.mless';

export default class Remove extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      checkboxChecked: false,
      removeError: null,
      loading: false
    };
  }

  componentWillUnmount() {
    if (this.subscription) {
      this.subscription.dispose();
    }
  }

  render() {
    const {
      data: { label }
    } = this.props;
    const { removeError, loading } = this.state;

    return (
      <Card title="Remove Website">
        <HelpParagraph>
          If you no longer wish to monitor the website <strong>{label}</strong> using Instana, please use this form to
          remove it. Removing a website is an eventually consistent action. For this reason, removing a website may take{' '}
          <strong>up to a few minutes</strong> until it has been completely removed.
        </HelpParagraph>
        <HelpParagraph>
          <strong>Please note that neither you nor the Instana support can undo this action!</strong>
        </HelpParagraph>
        <input type="checkbox" checked={this.state.checkboxChecked} onChange={this.onTickChange} disabled={loading} /> I
        understand that this action cannot be undone.
        {removeError && <SaveError>{removeError}</SaveError>}
        <Button
          kind="danger"
          disabled={loading || !this.state.checkboxChecked}
          onClick={this.remove}
          className={locals.button}
        >
          Remove Website
        </Button>
      </Card>
    );
  }

  onTickChange = e => {
    this.setState({ checkboxChecked: e.target.checked });
  };

  remove = e => {
    e.preventDefault();

    this.setState({
      loading: true,
      removeError: null
    });

    this.subscription = combineDataAndError(removeKey(this.props.websiteId)).once(({ error }) => {
      if (error) {
        this.setState({
          loading: false,
          saveError: get(error, ['response', 'body', 'errors', 0]) || String(error)
        });
      } else {
        goToPath(websitesPathFullyQualified);
      }
    });
  };
}
