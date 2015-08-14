/*global IN:false*/
import React from 'react/addons';

import Lettering from 'in-components/Lettering';
import * as connection from 'in-services/connection';
import * as tracking from 'in-services/tracking';

import SignInWithXing from './SignInWithXing';
import SignInWithLinkedIn from './SignInWithLinkedIn';
// import Tour from '../Tour';

import './DemoDialog.less';

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
      // return <Tour />;
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
        <p className={block + '__terms'}>
          By signing in with LinkedIn or Xing you are agreeing to our&nbsp;
          <a href='http://www.instana.com/website_terms_of_use'
             target='__blank'>
            Terms of Use
          </a>
          &nbsp;and&nbsp;
          <a href='http://www.instana.com/privacy_policy'
             target='__blank'>
            Privacy Policy
          </a>.
        </p>
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

    window.instana.user = {
      id: null,
      email: props.email,
      fullName: props.firstname + ' ' + props.lastname,
      preferredName: props.firstname
    };
    tracking.identify();
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
