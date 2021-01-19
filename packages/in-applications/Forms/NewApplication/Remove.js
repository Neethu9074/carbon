/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { get } from 'lodash';
import React from 'react';

import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import { deleteApplicationConfig } from 'in-api/applicationConfigs';
import { applicationsList } from 'in-applications/navigation/paths';
import DescriptionText from 'in-components/form/DescriptionText';
import CheckboxFancy from 'in-components/form/CheckboxFancy';
import { combineDataAndError } from 'in-services/util/ro';
import SaveError from 'in-components/form/SaveError';
import { goToPath } from 'in-stores/navigation';
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
    const { application } = this.props;
    if (!application) {
      return null;
    }

    const { removeError, loading } = this.state;

    return (
      <MaxWidthFullscreenContainer className={locals.maxWidthFullscreenContainer}>
        <Card title="Remove Application Perspective">
          <DescriptionText>
            If you no longer wish to monitor the application perspective <strong>{application.label}</strong>, please
            use the button below to remove it. Removing an application perspective may take up to a few minutes.
          </DescriptionText>
          <CheckboxFancy
            wrapperClassName={locals.checkbox}
            label="I understand that this action cannot be undone"
            checked={this.state.checkboxChecked}
            onChange={this.onTickChange}
            disabled={loading}
          />
          {removeError && <SaveError>{removeError}</SaveError>}
          <div className={locals.footer}>
            <Button
              kind="danger"
              disabled={loading || !this.state.checkboxChecked}
              onClick={this.remove}
              className={locals.removeButton}
            >
              Remove Application Perspective
            </Button>
          </div>
        </Card>
      </MaxWidthFullscreenContainer>
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

    this.subscription = combineDataAndError(deleteApplicationConfig(this.props.application.id)).once(({ error }) => {
      if (error) {
        this.setState({
          loading: false,
          saveError: get(error, ['response', 'body', 'errors', 0]) || String(error)
        });
      } else {
        goToPath(applicationsList);
      }
    });
  };
}
