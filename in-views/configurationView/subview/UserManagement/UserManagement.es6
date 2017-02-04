import {createLogger} from 'instalog';
import React from 'react';

import SectionHeading from 'in-views/configurationView/components/SectionHeading';
import SubViewWrapper from 'in-views/configurationView/components/SubViewWrapper';
import SubViewHeader from 'in-views/configurationView/components/SubViewHeader';
import Section from 'in-views/configurationView/components/Section';
import {emptyList, emptyMap} from 'in-services/fixedImmutables';
import Notification from 'in-components/form/Notification';
import {getUsers} from 'in-services/groundskeeper/users';
import Button from 'in-components/Button';

const logger = createLogger('UserManagement');

export default React.createClass({
  displayName: 'UserManagement',

  getInitialState() {
    return {
      loading: true,
      error: false,
      message: null,
      userOverview: emptyMap,
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
    const users = userOverview.get('users', emptyList);
    const invitations = userOverview.get('invitations', emptyList);

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

            <ul>
              {users.toArray()
                .sort((a, b) => a.get('fullName').localeCompare(b.get('fullName')))
                .map(user =>
                  <li key={user.get('id')}>
                    {user.get('fullName')}
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
  }
});
