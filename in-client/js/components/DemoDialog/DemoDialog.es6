/*global IN:false*/

'use strict';

import React from 'react/addons';

import * as connection from 'in-services/connection';
import SignInWithXing from './SignInWithXing';
import SignInWithLinkedIn from './SignInWithLinkedIn';

import Dialog from '../Dialog';

const DemoDialog = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  getInitialState() {
    return {
      userData: null,
      error: null
    };
  },

  render() {
    if (this.state.userData) {
      return null;
    }

    return (
      <Dialog>
        Sign in with linked in
        <SignInWithLinkedIn onSignIn={this.onSignIn}
                            onError={this.onError} />
        <SignInWithXing onSignIn={this.onSignIn}
                        onError={this.onError} />
      </Dialog>
    );
  },

  onSignIn(props) {
    const context = {};
    context.hutk = this.getHubspotTrackingCookie();
    context.pageUrl = window.location.href;
    context.pageName = window.title;

    connection.send({
      event: 'createLead',
      props,
      context
    });

    this.setState({
      userData: props
    });
  },

  getHubspotTrackingCookie() {
    const matchingCookies = document.cookie.split(';')
      .map(s => s.trim())
      .filter(s => s.indexOf('hubspotutk') === 0);

    if (matchingCookies.length !== 1) {
      return undefined;
    }

    // remove the cookie name
    return matchingCookies[0].replace(/^[^=]+=/, '');
  },

  onError(error) {
    this.setState({error});
  },

  authorize() {
    IN.User.authorize();
  }
});

export default DemoDialog;
