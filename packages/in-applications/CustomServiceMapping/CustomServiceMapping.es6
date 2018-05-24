import { get } from 'lodash';
import React from 'react';

import { newServiceConfig, updateServiceConfig, getServiceConfigs } from 'in-api/serviceConfiguration';
import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import DefaultLoadingDashboard from 'in-applications/Dashboards/DefaultLoadingDashboard';
import ErroneousResultPresenter from 'in-new-components/ErroneousResultPresenter';
import TemporaryPresenter from 'in-components/TemporaryPresenter';
import Form from 'in-applications/CustomServiceMapping/Form';
import HelpText from 'in-components/form/HelpText';
import SvgIcon from 'in-components/SvgIcon';
import connectTo from 'in-hoc/connectTo';
import Title from 'in-components/Title';

import locals from './CustomServiceMapping.mless';

export default connectTo(
  {
    serviceConfigs: getServiceConfigs()
  },
  class CustomServiceMapping extends React.Component {
    state = {
      loading: false,
      error: null,
      success: false
    };

    onSubmit = serviceConfig => {
      const result$ = updateServiceConfig(serviceConfig);
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
      const { serviceConfigs } = this.props;
      const isLoading = serviceConfigs.progress.loading;
      const hasErrors = serviceConfigs.errors.length > 0;

      if (isLoading) {
        return <DefaultLoadingDashboard />;
      }

      if (hasErrors) {
        return <ErroneousResultPresenter errors={serviceConfigs.errors} />;
      }

      const serviceConfig = get(serviceConfigs, ['data', 0], newServiceConfig());

      return (
        <MaxWidthFullscreenContainer className={locals.maxWidthFullscreenContainer}>
          <Title title="Custom Service Rule" />
          <h1 className={locals.heading}>Custom Service Rule</h1>

          <HelpText>
            Keys will be concatenated into <strong>{`"{key1}-{key2}"`}</strong> for service names.
          </HelpText>
          <br />

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
            serviceConfig={serviceConfig}
            loading={this.state.loading}
            loadingStateName={this.state.message}
            error={this.state.error}
          />
        </MaxWidthFullscreenContainer>
      );
    }
  }
);
