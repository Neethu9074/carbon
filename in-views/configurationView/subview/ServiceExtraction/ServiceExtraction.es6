import { create } from 'reactive-observables';
import { createLogger } from 'instalog';
import rpt from 'prop-types';
import React from 'react';

import { updateServiceRules, getServiceRules, deleteServiceRule, setEnabled } from 'in-services/api/serviceExtraction';
import Table from 'in-views/configurationView/subview/ServiceExtraction/components/Table';
import SectionHeading from 'in-views/configurationView/components/SectionHeading';
import SubViewWrapper from 'in-views/configurationView/components/SubViewWrapper';
import { openServiceExtractionConfig } from 'in-stores/navigation/configuration';
import SubViewHeader from 'in-views/configurationView/components/SubViewHeader';
import Section from 'in-views/configurationView/components/Section';
import { close } from 'in-components/DialogPresenter/store';
import Notification from 'in-components/form/Notification';
import { emptyArray } from 'in-services/fixedObjects';
import Button from 'in-components/Button';

const logger = createLogger('ServiceExtraction');

export default class extends React.Component {
  static displayName = 'ServiceExtraction';

  static propTypes = {
    helpTexts: rpt.object.isRequired,
    ruleType: rpt.string.isRequired,
    title: rpt.string.isRequired
  };

  state = {
    loading: true,
    error: false,
    message: null,
    serviceRules: emptyArray,
    orderHasChanged: false,
    status: {}
  };

  updateServiceConfigStream = create();

  componentWillMount() {
    this.refresServices();
    this.updateServiceConfigStreamSubscription = this.updateServiceConfigStream
      .debounce(2000)
      .subscribe(updatedList => {
        const result$ = updateServiceRules(updatedList);
        this.responseSubscription = result$.once(this.refresServices);
      });
  }

  refresServices = () => {
    this.disposeAsyncAction();

    this.setState({
      error: false,
      loading: true,
      message: 'Loading service rules…'
    });

    const result$ = getServiceRules(this.props.ruleType);
    this.responseSubscription = result$.once(serviceRules => {
      this.setState({
        error: false,
        loading: false,
        message: null,
        serviceRules
      });
    });

    this.errorSubscription = result$.errors().once(error => {
      const message = `Failed to retrieve service rules: ${error.message}`;
      logger.error(message, error);
      this.setState({
        error: true,
        loading: false,
        message
      });
    });
  };

  componentWillUnmount() {
    this.disposeAsyncAction();

    if (this.updateServiceConfigStreamSubscription) {
      this.updateServiceConfigStreamSubscription.dispose();
      this.updateServiceConfigStreamSubscription = null;
    }
  }

  disposeAsyncAction = () => {
    if (this.responseSubscription) {
      this.responseSubscription.dispose();
    }

    if (this.errorSubscription) {
      this.errorSubscription.dispose();
    }
  };

  addNewService = () => {
    this.disposeAsyncAction();

    // just open the rule dialog without an id will create a new one in the dialog
    openServiceExtractionConfig(null, this.props.ruleType);
  };

  onDeleteService = serviceId => {
    this.setState({
      error: false,
      loading: true,
      message: `Removing service ${serviceId}`
    });

    const result$ = deleteServiceRule(serviceId);
    this.responseSubscription = result$.once(() => {
      this.setState({
        error: false,
        loading: false,
        message: null,
        serviceRules: this.state.serviceRules.filter(eachService => eachService.get('id') !== serviceId)
      });
    });

    this.errorSubscription = result$.errors().once(error => {
      const message = `Failed to remove service ${serviceId}: ${error.message}`;
      logger.error(message, error);
      this.setState({
        error: true,
        loading: false,
        message
      });
    });
    close();
  };

  setEnabled = (service, enabled) => {
    const previousEnabled = service.get('enabled');
    const serviceId = service.get('id');

    this.setState(state => {
      state.status[serviceId] = {
        state: 'loading',
        time: Date.now(),
        message: 'Saving service…'
      };

      const index = state.serviceRules.findIndex(eachService => serviceId === eachService.get('id'));
      const newSerbices = state.serviceRules.update(index, modifiableServices =>
        modifiableServices.set('enabled', enabled)
      );
      return {
        status: state.status,
        serviceRules: newSerbices
      };
    });

    const result$ = setEnabled(service, enabled);
    result$.once(() => {
      this.setState(state => {
        state.status[serviceId] = {
          state: 'success',
          time: Date.now(),
          message: 'Service change successfully saved!'
        };

        return {
          status: state.status
        };
      });
    });

    result$.errors().once(error => {
      const message = `Failed to set service rules enable flag: ${error.message}`;
      logger.warn(message, error);

      this.setState(state => {
        state.status[serviceId] = {
          state: 'failure',
          time: Date.now(),
          message
        };

        // roll back the role change
        const index = state.serviceRules.findIndex(eachService => serviceId === eachService.get('id'));
        const newSerbices = state.serviceRules.update(index, modifiableServices =>
          modifiableServices.set('enabled', previousEnabled)
        );
        return {
          status: state.status,
          serviceRules: newSerbices
        };
      });
    });
  };

  orderHasChanged = updatedList => {
    this.updateServiceConfigStream.emit(updatedList);
  };

  render() {
    const { serviceRules } = this.state;
    const servicesAvailable = serviceRules && serviceRules.size > 0;

    return (
      <SubViewWrapper>
        <SubViewHeader>
          {this.props.title}
        </SubViewHeader>

        <Section>
          <Button kind="info" onClick={this.addNewService}>
            Add Rule
          </Button>

          {this.state.message
            ? <Notification failure={this.state.error} loading={this.state.loading}>
                {this.state.message}
              </Notification>
            : null}

          <p>
            {this.props.helpTexts.viewHelp}
          </p>
        </Section>

        {servicesAvailable
          ? <Section>
              <SectionHeading>
                Service Rules
              </SectionHeading>

              <Table
                items={serviceRules}
                ruleType={this.props.ruleType}
                onDeleteService={this.onDeleteService}
                orderHasChanged={this.orderHasChanged}
                setEnabled={this.setEnabled}
                status={this.state.status}
              />

            </Section>
          : null}
      </SubViewWrapper>
    );
  }
}
