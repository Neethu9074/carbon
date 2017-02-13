import {createLogger} from 'instalog';
import {Map} from 'immutable';
import React from 'react';

import Table from 'in-views/configurationView/subview/AlertsConfig/components/Table';
import SectionHeading from 'in-views/configurationView/components/SectionHeading';
import SubViewWrapper from 'in-views/configurationView/components/SubViewWrapper';
import SubViewHeader from 'in-views/configurationView/components/SubViewHeader';
import {getAlerts, saveAlert} from 'in-services/groundskeeper/alertings';
import Section from 'in-views/configurationView/components/Section';
import {openAlertConfig} from 'in-stores/navigation/configuration';
import Notification from 'in-components/form/Notification';
import {generateUniqueShortId} from 'in-services/util/id';
import {emptyList} from 'in-services/fixedImmutables';
import Button from 'in-components/Button';


const logger = createLogger('AlertsConfig');

export default React.createClass({
  displayName: 'AlertsConfig',

  getInitialState() {
    return {
      loading: true,
      error: false,
      message: null,
      alerts: emptyList,
    };
  },

  componentWillMount() {
    this.refresAlerts();
  },

  refresAlerts() {
    this.disposeAsyncAction();

    this.setState({
      error: false,
      loading: true,
      message: 'Loading Alerts…'
    });

    const result$ = getAlerts();
    this.responseSubscription = result$.once(alerts => {
      this.setState({
        error: false,
        loading: false,
        message: null,
        alerts
      });
    });

    this.errorSubscription = result$.errors().once(error => {
      const message = `Failed to retrieve alerts: ${error.message}`;
      logger.error(message, error);
      this.setState({
        error: true,
        loading: false,
        message
      });
    });
  },

  componentWillUnmount() {
    this.disposeAsyncAction();
  },

  disposeAsyncAction() {
    if (this.responseSubscription) {
      this.responseSubscription.dispose();
    }

    if (this.errorSubscription) {
      this.errorSubscription.dispose();
    }
  },

  addNewAlert() {
    const newAlert = Map({
      id: generateUniqueShortId(),
      name: 'New Alert',
      enabled: false,
      entityType: '',
      metricName: '',
      isTriggering: false,
      rollup: 1000,
      aggregation: '',
      window: 1000,
      thresholdOperator: '',
      thresholdValue: 0.0,
      severity: 0,
      eventText: 'This text will be shown in events of this alerting rule',
      description: '',
      query: '',
    });

    this.setState({
      error: false,
      loading: true,
      message: 'Adding new alert…'
    });

    const result$ = saveAlert(newAlert);
    this.responseSubscription = result$.once(() => {
      openAlertConfig(newAlert.get('id'));
    });

    this.errorSubscription = result$.errors().once(error => {
      const message = `Failed to save new alert: ${error.message}`;
      logger.error(message, error);
      this.setState({
        error: true,
        loading: false,
        message
      });
    });
  },

  render() {
    const {alerts} = this.state;
    const alertsAvailable = alerts && alerts.size > 0;

    return (
      <SubViewWrapper>
        <SubViewHeader>
          Custom Alert Management
        </SubViewHeader>

        <Section>
          <Button kind='info'
                  onClick={this.addNewAlert}>
            Add New Alert
          </Button>

          {this.state.message ?
            <Notification failure={this.state.error}
                          loading={this.state.loading}>
              {this.state.message}
            </Notification>
          : null}
        </Section>

        {alertsAvailable ?
          <Section>
            <SectionHeading>
              Custom Alerts
            </SectionHeading>

            <Table items={alerts} />
          </Section>
        : null}
      </SubViewWrapper>
    );
  }
});
