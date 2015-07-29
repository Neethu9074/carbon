'use strict';

import _ from 'lodash';
import React from 'react/addons';
import {createLogger} from 'instalog';

const logger = createLogger('ui-client.SignInWithXing');

const rpt = React.PropTypes;

// TODO Make configurable
const apiKey = '5247fff043bff6b7e0d1';

// From Xing to HubSpot
const propMapping = [
  {from: ['id'], to: 'xingid'},
  {from: ['active_email'], to: 'email'},
  {from: ['first_name'], to: 'firstname'},
  {from: ['last_name'], to: 'lastname'},
  {from: ['professional_experience', 'primary_company', 'title'], to: 'jobtitle'},
  {from: ['professional_experience', 'primary_company', 'name'], to: 'company'},
  {from: ['business_address', 'city'], to: 'city'},
  {from: ['business_address', 'country'], to: 'country'},
  {from: ['professional_experience', 'primary_company', 'industry'], to: 'industry'},
  {from: ['permalink'], to: 'xingurl'}
];

const SignInWithXing = React.createClass({

  propTypes: {
    onSignIn: rpt.func.isRequired,
    onError: rpt.func.isRequired
  },

  shouldComponentUpdate() {
    // we do not permit updates as we do not want to trip up xing
    return false;
  },

  componentDidMount() {
    // yak! What a fricking API is that!? ;-(((
    // https://dev.xing.com/plugins/login_with/docs#get-started
    window.onXingAuthLogin = this.onSignIn;

    const domNode = React.findDOMNode(this);

    const xingButtonElement = document.createElement('script');
    xingButtonElement.type = 'xing/login';
    xingButtonElement.innerHTML = JSON.stringify({
      'consumer_key': apiKey
    });
    domNode.appendChild(xingButtonElement);

    const xingScriptElement = document.createElement('script');
    xingScriptElement.id = 'lwx';
    xingScriptElement.src = 'https://www.xing-share.com/plugins/login.js';
    domNode.appendChild(xingScriptElement);
  },

  onSignIn({error, user}) {
    if (error) {
      const msg = 'Failed to authenticate using Xing';
      logger.error(msg, error);
      this.props.onError(msg);
      return;
    }

    const props = {};
    propMapping.forEach(mapping => {
      const value = _.get(user, mapping.from, '');
      props[mapping.to] = value;
    });
    this.props.onSignIn(props);
  },

  render() {
    return (
      <div></div>
    );
  }
});

export default SignInWithXing;
