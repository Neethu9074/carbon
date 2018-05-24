import React, { Fragment } from 'react';

import { getApplicationConfig, updateApplicationConfig } from 'in-api/applicationConfigs';
import DefaultLoadingDashboard from 'in-applications/Dashboards/DefaultLoadingDashboard';
import ErroneousResultPresenter from 'in-new-components/ErroneousResultPresenter';
import TemporaryPresenter from 'in-components/TemporaryPresenter';
import Form from 'in-applications/NewApplication/Form';
import SvgIcon from 'in-components/SvgIcon';
import connectTo from 'in-hoc/connectTo';

import locals from './Configuration.mless';

export default connectTo(
  props => ({
    appResult: getApplicationConfig(props.applicationId)
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
      const { appResult } = this.props;
      const isLoading = appResult.progress.loading;
      const hasErrors = appResult.errors.length > 0;

      if (isLoading) {
        return <DefaultLoadingDashboard />;
      }

      if (hasErrors) {
        return <ErroneousResultPresenter errors={appResult.errors} />;
      }

      return (
        <Fragment>
          {this.state.success && (
            <TemporaryPresenter duration={5000}>
              <div className={locals.notificationContainer}>
                <div>
                  <SvgIcon type="ok" width={16} className={locals.successIcon} />
                  <span className={locals.successLabel}>Successfully saved.</span>
                </div>
              </div>
            </TemporaryPresenter>
          )}

          {this.state.error && (
            <TemporaryPresenter duration={5000}>
              <div className={locals.notificationContainer}>
                <div>
                  <SvgIcon type="error" width={16} className={locals.errorIcon} />
                  <span className={locals.errorLabel}>An error occurred, please try again.</span>
                </div>
              </div>
            </TemporaryPresenter>
          )}

          <Form
            onSubmit={this.onSubmit}
            application={appResult.data}
            loading={this.state.loading}
            loadingStateName={this.state.message}
            error={this.state.error}
          />
        </Fragment>
      );
    }
  }
);
