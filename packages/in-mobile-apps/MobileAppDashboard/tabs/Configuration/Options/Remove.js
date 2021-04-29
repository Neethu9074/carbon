/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Card } from '@instana/components';
import { get } from 'lodash';
import React from 'react';

import HelpParagraph from 'in-mobile-apps/MobileAppDashboard/tabs/Configuration/Options/HelpParagraph';
import { removeMobileApp as removeMobileAppTracker } from 'in-mobile-apps/tracker';
import { mobileAppsPathFullyQualified } from 'in-mobile-apps/navigation/paths';
import { removeMobileApp } from 'in-mobile-apps/api/mobileApps';
import { goToPath } from 'in-stores/navigation/navigation';
import { combineDataAndError } from 'in-services/util/ro';
import SaveError from 'in-components/form/SaveError';
import Button from 'in-new-components/Button';
import { t, Trans } from 'in-i18n';

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
      <Card title={t('in-mobile-apps:dashboard.tabs.removeAppTitle')}>
        <HelpParagraph>
          <Trans i18nKey="in-mobile-apps:dashboard.tabs.removeAppHelp1" values={{ label: label }} />
        </HelpParagraph>
        <HelpParagraph>
          <strong>{t('in-mobile-apps:dashboard.tabs.removeAppHelp2')}</strong>
        </HelpParagraph>

        <div className={locals.confirmWrapper}>
          <input
            type="checkbox"
            checked={this.state.checkboxChecked}
            onChange={this.onTickChange}
            disabled={loading}
            className={locals.confirm}
          />{' '}
          {t('in-mobile-apps:dashboard.tabs.confirmUndone')}
        </div>

        {removeError && <SaveError>{removeError}</SaveError>}
        <Button
          kind="danger"
          disabled={loading || !this.state.checkboxChecked}
          onClick={this.remove}
          className={locals.button}
        >
          {t('in-mobile-apps:dashboard.tabs.removeAppBtn')}
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

    removeMobileAppTracker({
      mobileAppName: this.props.mobileAppLabel
    });

    this.subscription = combineDataAndError(removeMobileApp(this.props.mobileAppId)).once(({ error }) => {
      if (error) {
        this.setState({
          loading: false,
          saveError: get(error, ['response', 'body', 'errors', 0]) || String(error)
        });
      } else {
        goToPath(mobileAppsPathFullyQualified);
      }
    });
  };
}
