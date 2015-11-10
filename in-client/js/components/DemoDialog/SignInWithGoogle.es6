/* global gapi:false */

import _ from 'lodash';
import React from 'react/addons';

import config from 'in-services/config';

const rpt = React.PropTypes;

const propMapping = [
  {from: ['id'], to: 'googleid'},
  {from: ['emails', '0', 'value'], to: 'email'},
  {from: ['name', 'givenName'], to: 'firstname'},
  {from: ['name', 'familyName'], to: 'lastname'},
  {from: ['organizations', '0', 'title'], to: 'jobtitle'},
  {from: ['organizations', '0', 'name'], to: 'company'},
  {from: ['url'], to: 'googleurl'}
];

const SignInWithGoogle = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    onSignIn: rpt.func.isRequired,
    onError: rpt.func.isRequired,
    className: rpt.string
  },

  componentDidMount() {
    // yet again globals are necessary in order to handle sign ins :(((
    // https://developers.google.com/+/web/signin/#using_the_client-side_flow
    window.onGoogleSignIn = this.onGoogleSignIn;

    const googleScriptElement = document.createElement('script');
    googleScriptElement.asnyc = true;
    googleScriptElement.src = 'https://apis.google.com/js/client:plusone.js';
    document.head.appendChild(googleScriptElement);
  },

  onGoogleSignIn(authResult) {
    if (authResult.access_token) {
      gapi.client.request({
        method: 'GET',
        path: '/plus/v1/people/me',
        callback: (result) => {
          if (!result) {
            this.props.onError('Failed to authorize via Google');
            return;
          }
          const props = {};
          propMapping.forEach(mapping => {
            const value = _.get(result, mapping.from, '');
            props[mapping.to] = value;
          });
          this.props.onSignIn(props);
        }
      });
    }
  },
  // GET https://www.googleapis.com/plus/v1/people/userId

  render() {
    return (
      <div className={this.props.className}>
        <span id='signinButton'>
          <span className='g-signin'
                data-width='wide'
                data-height='standard'
                data-theme='dark'
                data-callback='onGoogleSignIn'
                data-clientid={config.keys.google}
                data-cookiepolicy='single_host_origin'
                data-requestvisibleactions='http://schemas.google.com/AddActivity'
                data-scope='https://www.googleapis.com/auth/plus.me https://www.googleapis.com/auth/userinfo.email'>
          </span>
        </span>
      </div>
    );
  }
});

export default SignInWithGoogle;
