import { get } from 'lodash';
import React from 'react';

import HelpParagraph from 'in-websites/WebsiteDashboard/tabs/Configuration/Options/HelpParagraph';
import { removeWebsite as removeWebsiteTracker } from 'in-websites/tracker';
import { websitesPathFullyQualified } from 'in-websites/navigation/paths';
import { goToPath } from 'in-stores/navigation/navigation';
import { combineDataAndError } from 'in-services/util/ro';
import { removeWebsite } from 'in-websites/api/websites';
import SaveError from 'in-components/form/SaveError';
import Button from 'in-new-components/Button';
import Card from 'in-new-components/Card';
import { Trans } from 'in-i18n';

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
          <Trans i18nKey="in-websites:delete.disclaimer" values={{ websiteName: label }} />
        </HelpParagraph>
        <HelpParagraph>
          <strong>Please note that neither you nor the Instana support can undo this action!</strong>
        </HelpParagraph>

        <div className={locals.confirmWrapper}>
          <input
            type="checkbox"
            checked={this.state.checkboxChecked}
            onChange={this.onTickChange}
            disabled={loading}
            className={locals.confirm}
          />{' '}
          I understand that this action cannot be undone.
        </div>

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

    removeWebsiteTracker({
      websiteName: this.props.websiteLabel
    });

    this.subscription = combineDataAndError(removeWebsite(this.props.websiteId)).once(({ error }) => {
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
