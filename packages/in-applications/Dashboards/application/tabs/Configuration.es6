import React, { Fragment } from 'react';

import DefaultLoadingDashboard from 'in-applications/Dashboards/DefaultLoadingDashboard';
import { getApplicationConfig, updateApplicationConfig } from 'in-api/applicationConfigs';
import TemporaryPresenter from 'in-components/TemporaryPresenter';
import Form from 'in-applications/NewApplication/Form';
import SvgIcon from 'in-components/SvgIcon';
import connectTo from 'in-hoc/connectTo';

import locals from './Configuration.mless';

export default connectTo(
  props => ({
    app: getApplicationConfig(props.applicationId)
  }),
  class Configuration extends React.Component {
    state = {
      loading: false,
      error: null,
      success: false
    };

    onSubmit = appConfig => {
      const result$ = updateApplicationConfig(appConfig);
      this.setState({
        loading: true,
        error: false,
        success: false,
        message: 'Saving…'
      });

      result$.once(() => {
        this.setState({
          loading: false,
          error: false,
          success: true
        });
      });

      result$.errors().once(() => {
        this.setState({
          loading: false,
          error: true,
          success: false
        });
      });
    };

    render() {
      if (this.props.app == null) {
        return <DefaultLoadingDashboard />;
      }

      return (
        <Fragment>
          {this.state.success && (
            <div className={locals.notificationContainer}>
              <div>
                <TemporaryPresenter duration={5000}>
                  <SvgIcon type="ok" width={16} className={locals.successIcon} />{' '}
                  <span className={locals.successLabel}>Successfully saved.</span>
                </TemporaryPresenter>
              </div>
            </div>
          )}

          {this.state.error && (
            <div className={locals.notificationContainer}>
              <div>
                <TemporaryPresenter duration={5000}>
                  <SvgIcon type="error" width={16} className={locals.errorIcon} />{' '}
                  <span className={locals.errorLabel}>An error occurred, please try again.</span>
                </TemporaryPresenter>
              </div>
            </div>
          )}

          <Form
            onSubmit={this.onSubmit}
            application={this.props.app}
            loading={this.state.loading}
            loadingStateName="Saving…"
            error={this.state.error}
          />
        </Fragment>
      );
    }
  }
);
