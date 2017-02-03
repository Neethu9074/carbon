import {createLogger} from 'instalog';
import {Map} from 'immutable';
import React from 'react';

import SubViewWrapper from 'in-views/configurationView/components/SubViewWrapper';
import SectionHeading from 'in-views/configurationView/components/SectionHeading';
import SubViewHeader from 'in-views/configurationView/components/SubViewHeader';
import {getRoles, saveRole, deleteRole} from 'in-services/groundskeeper/roles';
import Role from 'in-views/configurationView/subview/RolesConfig/Role';
import Section from 'in-views/configurationView/components/Section';
import {openRoleConfig} from 'in-stores/navigation/configuration';
import Notification from 'in-components/form/Notification';
import {generateUniqueShortId} from 'in-services/util/id';
import {emptySet} from 'in-services/fixedImmutables';
import Button from 'in-components/Button';

const logger = createLogger('RolesConfig');

export default React.createClass({
  displayName: 'RolesConfig',

  getInitialState() {
    return {
      loading: true,
      error: false,
      message: null,
      roles: emptySet,
    };
  },

  componentWillMount() {
    this.refreshRoles();
  },

  refreshRoles() {
    this.disposeAsyncAction();

    this.setState({
      error: false,
      loading: true,
      message: 'Loading roles…'
    });

    const result$ = getRoles();
    this.responseSubscription = result$.once(roles => {
      this.setState({
        error: false,
        loading: false,
        message: null,
        roles
      });
    });

    this.errorSubscription = result$.errors().once(error => {
      const message = `Failed to retrieve roles: ${error.message}`;
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

  render() {
    const {roles} = this.state;

    return (
      <SubViewWrapper>
        <SubViewHeader>
          Role Configuration
        </SubViewHeader>

        <Section>
          <Button kind='info'
                  onClick={this.addNewRole}>
            Add New Role
          </Button>

          {this.state.message ?
            <Notification failure={this.state.error}
                          loading={this.state.loading}>
              {this.state.message}
            </Notification>
          : null}
        </Section>

        <Section>
          <SectionHeading>
            Existing Roles
          </SectionHeading>

          {roles && roles.toArray()
            // do not show the fallback role
            .filter(role => role.get('id') !== '-2')
            .sort((a, b) => a.get('name').localeCompare(b.get('name')))
            .map(role =>
              <Role role={role}
                    key={role.get('id')}
                    onDelete={this.onDelete} />
          )}
        </Section>
      </SubViewWrapper>
    );
  },

  addNewRole() {
    const newRole = Map({
      id: generateUniqueShortId(),
      name: 'New Role',
      implicitViewFilter: '',
      canConfigureServiceMapping: false,
      canConfigureEumApplications: false,
      canConfigureUsers: false,
      canConfigureRoles: false,
      canInstallNewAgents: false,
      canSeeUsageInformation: false,
      canSeeOnPremLicenseInformation: false,
      canConfigureIntegrations: false
    });

    this.setState({
      error: false,
      loading: true,
      message: 'Adding new role…'
    });

    const result$ = saveRole(newRole);
    this.responseSubscription = result$.once(() => {
      openRoleConfig(newRole.get('id'));
    });

    this.errorSubscription = result$.errors().once(error => {
      const message = `Failed to save new role: ${error.message}`;
      logger.error(message, error);
      this.setState({
        error: true,
        loading: false,
        message
      });
    });
  },

  onDelete(role) {
    this.setState({
      error: false,
      loading: true,
      message: `Removing role ${role.get('name')}`
    });

    const result$ = deleteRole(role.get('id'));
    this.responseSubscription = result$.once(() => {
      this.setState({
        error: false,
        loading: false,
        message: null,
        roles: this.state.roles.filter(eachRole => eachRole.get('id') !== role.get('id'))
      });
    });

    this.errorSubscription = result$.errors().once(error => {
      const message = `Failed to remove role ${role.get('name')}: ${error.message}`;
      logger.error(message, error);
      this.setState({
        error: true,
        loading: false,
        message
      });
    });
  }
});
