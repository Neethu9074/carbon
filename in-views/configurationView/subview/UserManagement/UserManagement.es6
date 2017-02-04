import React from 'react';

import SubViewWrapper from 'in-views/configurationView/components/SubViewWrapper';
import SubViewHeader from 'in-views/configurationView/components/SubViewHeader';
import Section from 'in-views/configurationView/components/Section';
import Notification from 'in-components/form/Notification';
import {emptySet} from 'in-services/fixedImmutables';

export default React.createClass({
  displayName: 'UserManagement',

  getInitialState() {
    return {
      loading: true,
      error: false,
      message: null,
      roles: emptySet,
    };
  },

  componentWillMount() {
    this.refreshUsers();
  },

  refreshUsers() {
    this.disposeAsyncAction();
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
    return (
      <SubViewWrapper>
        <SubViewHeader>
          User Management
        </SubViewHeader>

        <Section>
          {this.state.message ?
            <Notification failure={this.state.error}
                          loading={this.state.loading}>
              {this.state.message}
            </Notification>
          : null}
        </Section>

      </SubViewWrapper>
    );
  }
});
