import {createLogger} from 'instalog';
import {Map} from 'immutable';
import React from 'react';

import {createAlert, getAlerts, saveAlert, deleteAlert, setEnabled} from 'in-services/groundskeeper/alertings';
import Table from 'in-views/configurationView/subview/AlertsConfig/components/Table';
import SectionHeading from 'in-views/configurationView/components/SectionHeading';
import SubViewWrapper from 'in-views/configurationView/components/SubViewWrapper';
import SubViewHeader from 'in-views/configurationView/components/SubViewHeader';
import Section from 'in-views/configurationView/components/Section';
import {openAlertConfig} from 'in-stores/navigation/configuration';
import Notification from 'in-components/form/Notification';
import {close} from 'in-components/DialogPresenter/store';
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
      status: {}
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
      message: 'Loading alerts…'
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
    this.disposeAsyncAction();

    const newAlert = Map(createAlert());

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

  onDeleteAlert(alertId) {
    this.setState({
      error: false,
      loading: true,
      message: `Removing alert ${alertId}`
    });

    const result$ = deleteAlert(alertId);
    this.responseSubscription = result$.once(() => {
      this.setState({
        error: false,
        loading: false,
        message: null,
        alerts: this.state.alerts.filter(eachAlert => eachAlert.get('id') !== alertId)
      });
    });

    this.errorSubscription = result$.errors().once(error => {
      const message = `Failed to remove alert ${alertId}: ${error.message}`;
      logger.error(message, error);
      this.setState({
        error: true,
        loading: false,
        message
      });
    });
    close();
  },

  setEnabled(alert, enabled) {
    const previousEnabled = alert.get('enabled');
    const alertId = alert.get('id');

    this.setState(state => {
      state.status[alertId] = {
        state: 'loading',
        time: Date.now(),
        message: 'Saving alert…'
      };

      const index = state.alerts.findIndex(eachAlert => alertId === eachAlert.get('id'));
      const newAlerts = state.alerts.update(index, modifiableAlert => modifiableAlert.set('enabled', enabled));
      return {
        status: state.status,
        alerts: newAlerts
      };
    });

    const result$ = setEnabled(alertId, enabled);
    result$.once(() => {
      this.setState(state => {
        state.status[alertId] = {
          state: 'success',
          time: Date.now(),
          message: 'Alert change successfully saved!'
        };

        return {
          status: state.status
        };
      });
    });

    result$.errors().once(error => {
      const message = `Failed to set alerts enable flag: ${error.message}`;
      logger.warn(message, error);

      this.setState(state => {
        state.status[alertId] = {
          state: 'failure',
          time: Date.now(),
          message
        };

        // roll back the role change
        const index = state.alerts.findIndex(eachAlert => alertId === eachAlert.get('id'));
        const newAlerts = state.userOverview.update(index, modifiableAlert => modifiableAlert.set('enabled', previousEnabled));
        return {
          status: state.status,
          alerts: newAlerts
        };
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

            <Table items={alerts}
                   onDeleteAlert={this.onDeleteAlert}
                   setEnabled={this.setEnabled}
                   status={this.state.status} />
          </Section>
        : null}
      </SubViewWrapper>
    );
  }
});
