/*global IN:false*/

'use strict';

import _ from 'lodash';
import React from 'react/addons';
import {createLogger} from 'instalog';

const rpt = React.PropTypes;

const logger = createLogger('ui-client.SignInWithLinkedIn');

// From Linkedin to HubSpot
const propMapping = [
  {from: ['id'], to: 'linkedinid'},
  {from: ['emailAddress'], to: 'email'},
  {from: ['firstName'], to: 'firstname'},
  {from: ['lastName'], to: 'lastname'},
  {from: ['positions', 'values', '0', 'title'], to: 'jobtitle'},
  {from: ['positions', 'values', '0', 'company', 'name'], to: 'company'},
  {from: ['location', 'name'], to: 'city'},
  {from: ['location', 'country', 'code'], to: 'country'},
  {from: ['industry'], to: 'industry'},
  {from: ['publicProfileUrl'], to: 'linkedinurl'}
];

const SignInWithLinkedIn = React.createClass({
  propTypes: {
    onSignIn: rpt.func.isRequired,
    onError: rpt.func.isRequired
  },

  shouldComponentUpdate() {
    // we do not permit updates as we do not want to trip up linkedin
    return false;
  },

  componentDidMount() {
    // yak! What a fricking API is that!? ;-(((
    // https://dev.xing.com/plugins/login_with/docs#get-started
    window.onLinkedInAuthLoaded = this.onLinkedInAuthLoaded;

    const domNode = React.findDOMNode(this);

    const linkedInButtonElement = document.createElement('script');
    linkedInButtonElement.type = 'in/Login';
    domNode.appendChild(linkedInButtonElement);

    const apiKey = window.instana.config.keys.linkedin;
    const linkedInScriptElement = document.createElement('script');
    linkedInScriptElement.src = '//platform.linkedin.com/in.js';
    linkedInScriptElement.innerHTML = 'api_key: ' + apiKey + '\n' +
      'authorize: true\n' +
      'onLoad: onLinkedInAuthLoaded';
    domNode.appendChild(linkedInScriptElement);
  },

  onLinkedInAuthLoaded() {
    IN.Event.on(IN, 'auth', this.requestUserData);
    if (IN.User.isAuthorized()) {
      this.requestUserData();
    }
  },

  requestUserData() {
    const url = '/people/~:(id,first-name,last-name,formatted-name,headline' +
      ',location,industry,summary,specialties,positions,public-profile-url,' +
      'email-address,picture-url)';
    IN.API.Raw(url)
      .result(user => {
        this.onSignIn(user);
      })
      .error(error => {
        const msg = 'Failed to authenticate using LinkedIn';
        logger.error(msg, error);
        this.props.onError(msg);
      });
  },

  onSignIn(user) {
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

export default SignInWithLinkedIn;
