import React, { Fragment } from 'react';
import { assign } from 'lodash';

import { getApplicationConfigs, updateApplicationConfig } from 'in-api/applicationConfigs';
import DefaultLoadingDashboard from 'in-applications/Dashboards/DefaultLoadingDashboard';
import ErroneousResultPresenter from 'in-new-components/ErroneousResultPresenter';

import TemporaryPresenter from 'in-components/TemporaryPresenter';
import Form from 'in-applications/NewApplication/Form';
import SvgIcon from 'in-components/SvgIcon';
import connectTo from 'in-hoc/connectTo';

import locals from './Configuration.mless';

export default connectTo(
  props => ({
    appResult: getApplicationConfigs().map(result => {
      if (result.data) {
        let data = null;
        let errors = [];
        if (result.errors) {
          for (let i = 0; i < result.errors.length; i++) {
            errors.push(result.errors[i]);
          }
        }

        const applications = result.data;
        for (let i = 0; i < applications.length; i++) {
          const application = applications[i];
          if (application.id === props.applicationId) {
            data = application;
            break;
          }
        }
        if (!data) {
          const notFoundError = {
            code: 'CLIENT',
            message: 'The applications configuration cannot be not found.'
          };
          errors.push(notFoundError);
        }
        return assign({ data, errors }, { progress: result.progress, time: result.time });
      }
      return result;
    })
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
