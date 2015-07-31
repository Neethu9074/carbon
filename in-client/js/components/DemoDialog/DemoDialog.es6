/*global IN:false*/

'use strict';

import React from 'react/addons';

import Lettering from 'in-components/Lettering';
import * as connection from 'in-services/connection';
import prefetch from 'in-services/util/prefetch';

import SignInWithXing from './SignInWithXing';
import SignInWithLinkedIn from './SignInWithLinkedIn';

import hoverImageUrl from './img/Sign-in-Large---Active.png';
import activeImageUrl from './img/Sign-in-Large---Hover.png';

import './DemoDialog.less';

prefetch(
  hoverImageUrl,
  activeImageUrl
);

const block = 'in-demo-sign-in-overlay';

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
      <div className={block}>
        <Lettering />
        <p className={block + '__msg'}>
          Use your LinkedIn or Xing account to try our demo.
        </p>
        <div className={block + '__social'}>
          <SignInWithLinkedIn onSignIn={this.onSignIn}
                              onError={this.onError}
                              className={block + '__linkedin'}/>
          <SignInWithXing onSignIn={this.onSignIn}
                          onError={this.onError}
                          className={block + '__xing'}/>
        </div>
      </div>
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
