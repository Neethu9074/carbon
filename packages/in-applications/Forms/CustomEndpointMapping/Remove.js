/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';
import { get } from 'lodash';

import { serviceDashboard } from 'in-applications/navigation/paths';
import { deleteEndpointConfig } from 'in-api/endpointConfiguration';
import DescriptionText from 'in-components/form/DescriptionText';
import Spacer from 'in-applications/Forms/components/Spacer';
import { combineDataAndError } from 'in-services/util/ro';
import SaveError from 'in-components/form/SaveError';
import { goToPath } from 'in-stores/navigation';
import Button from 'in-new-components/Button';
import { t } from 'in-i18n';

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
    const { config } = this.props;
    if (!config) {
      return null;
    }

    const { removeError, loading } = this.state;

    return (
      <Fragment>
        <Spacer type="light" />
        <DescriptionText>{t('in-applications:forms.descriptionResetToDefaultRule')}</DescriptionText>
        <input type="checkbox" checked={this.state.checkboxChecked} onChange={this.onTickChange} disabled={loading} />
        {t('in-applications:forms.understandCheckboxResetToDefaultRule')}
        {removeError && <SaveError>{removeError}</SaveError>}
        <Button
          kind="danger"
          disabled={loading || !this.state.checkboxChecked}
          onClick={this.remove}
          className={locals.removeButton}
        >
          {t('in-applications:buttonResetToDefault')}
        </Button>
      </Fragment>
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

    this.subscription = combineDataAndError(deleteEndpointConfig(this.props.config.serviceId)).once(({ error }) => {
      if (error) {
        this.setState({
          loading: false,
          saveError: get(error, ['response', 'body', 'errors', 0]) || String(error)
        });
      } else {
        goToPath(`${serviceDashboard}/endpoints`);
      }
    });
  };
}
