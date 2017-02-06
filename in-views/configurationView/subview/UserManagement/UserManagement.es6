import {createLogger} from 'instalog';
import React from 'react';

import SectionHeading from 'in-views/configurationView/components/SectionHeading';
import SubViewWrapper from 'in-views/configurationView/components/SubViewWrapper';
import SubViewHeader from 'in-views/configurationView/components/SubViewHeader';
import ModificationSaveStatus from 'in-components/form/ModificationSaveStatus';
import Section from 'in-views/configurationView/components/Section';
import {getUsers, setRole} from 'in-services/groundskeeper/users';
import {emptyList, emptyMap} from 'in-services/fixedImmutables';
import Notification from 'in-components/form/Notification';
import {getRoles} from 'in-services/groundskeeper/roles';
import Gravatar from 'in-components/Gravatar';
import {fallbackRoleId} from 'in-stores/user';
import Button from 'in-components/Button';
import connectTo from 'in-hoc/connectTo';

import './UserManagement.less';

const logger = createLogger('UserManagement');
const block = 'in-config-users';

export default connectTo({
  roles: getRoles()
}, React.createClass({
  displayName: 'UserManagement',

  getInitialState() {
    return {
      loading: true,
      error: false,
      message: null,
      userOverview: emptyMap,
      status: {}
    };
  },

  componentWillMount() {
    this.refreshUsers();
  },

  refreshUsers() {
    this.disposeAsyncAction();

    this.setState({
      error: false,
      loading: true,
      message: 'Loading users…'
    });

    const result$ = getUsers();
    this.responseSubscription = result$.once(userOverview => {
      this.setState({
        error: false,
        loading: false,
        message: null,
        userOverview
      });
    });

    this.errorSubscription = result$.errors().once(error => {
      logger.error(`Failed to retrieve users: ${error.message}`, error);
      this.setState({
        error: true,
        loading: false,
        message: 'Failed to retrieve users.'
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
    const {userOverview} = this.state;
    const {roles} = this.props;
    const users = userOverview.get('users', emptyList);
    const invitations = userOverview.get('invitations', emptyList);

    let sortedRoles;
    if (roles) {
      sortedRoles = roles.toArray()
        .filter(role => role.get('id') !== fallbackRoleId)
        .sort((a, b) => a.get('name').localeCompare(b.get('name')));
    }

    return (
      <SubViewWrapper>
        <SubViewHeader>
          User Management
        </SubViewHeader>

        <Section>
          <Button kind='info'>
            Invite User
          </Button>

          {this.state.message ?
            <Notification failure={this.state.error}
                          loading={this.state.loading}>
              {this.state.message}
            </Notification>
          : null}
        </Section>

        {users.size > 0 ?
          <Section>
            <SectionHeading>
              Users
            </SectionHeading>

            <ul className={`${block}__users`}>
              {users.toArray()
                .sort((a, b) => a.get('fullName').localeCompare(b.get('fullName')))
                .map(user =>
                  <li key={user.get('id')}
                      className={`${block}__user`}>
                    <div className={`${block}__user-side`}>
                      <Gravatar email={user.get('email')}
                                className={`${block}__avatar`} />

                      <div>
                        <div className={`${block}__full-name`}>
                          {user.get('fullName')}
                        </div>
                        <div className={`${block}__email`}>
                          {user.get('email')}
                        </div>
                      </div>
                    </div>

                    <div className={`${block}__user-side`}>
                      {sortedRoles ?
                        <span className={`${block}__role-edit`}>
                          <select id='user-management-roles'
                                  className={`${block}__roles`}
                                  value={user.get('roleId')}
                                  onChange={e => this.setRole(user, e.target.value)}>
                            {sortedRoles.map(role =>
                              <option value={role.get('id')}
                                      key={role.get('id')}>
                                {role.get('name')}
                              </option>
                            )}
                          </select>

                          <ModificationSaveStatus status={this.state.status[user.get('id')]}
                                                  className={`${block}__save-status`}
                                                  reserveSpace />
                        </span>
                      : null}

                      <Button kind='danger'
                              size='sm'
                              className={`${block}__remove`}>
                        Remove
                      </Button>
                    </div>
                  </li>
              )}
            </ul>
          </Section>
        : null}

        {invitations.size > 0 ?
          <Section>
            <SectionHeading>
              Pending Invitations
            </SectionHeading>

            <ul>
              {invitations.toArray()
                .sort((a, b) => a.get('email').localeCompare(b.get('email')))
                .map((invitation, i) =>
                  <li key={i}>
                    {invitation.get('email')}
                  </li>
              )}
            </ul>
          </Section>
        : null}
      </SubViewWrapper>
    );
  },

  setRole(user, newRoleId) {
    const previousRoleId = user.get('roleId');

    // move component into "updating" state
    this.setState(state => {
      // TODO add loading notification
      state.status[user.get('id')] = {
        state: 'loading',
        time: Date.now(),
        message: 'Saving role…'
      };

      const index = state.userOverview.get('users').indexOf(user);
      const newUserOverview = state.userOverview
        .updateIn(['users', index], modifiableUser => modifiableUser.set('roleId', newRoleId));
      return {
        status: state.status,
        userOverview: newUserOverview
      };
    });

    const result$ = setRole(user.get('id'), newRoleId);
    result$.once(() => {
      this.setState(state => {
        state.status[user.get('id')] = {
          state: 'success',
          time: Date.now(),
          message: 'Role change successfully saved!'
        };

        return {
          status: state.status
        };
      });
    });

    result$.errors().once(error => {
      const message = `Failed to set user role: ${error.message}`;
      logger.warn(message, error);

      this.setState(state => {
        state.status[user.get('id')] = {
          state: 'failure',
          time: Date.now(),
          message
        };

        // roll back the role change
        const index = state.userOverview.get('users').findIndex(eachUser => user.get('id') === eachUser.get('id'));
        const newUserOverview = state.userOverview
          .updateIn(['users', index], modifiableUser => modifiableUser.set('roleId', previousRoleId));
        return {
          status: state.status,
          userOverview: newUserOverview
        };
      });
    });
  }
}));
