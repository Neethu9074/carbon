/* global IN:false */
import _ from 'lodash';
import React from 'react';
import {createLogger} from 'instalog';

import helpify from 'in-components/hoc/helpify';
import {getClassName} from 'in-services/react';

import './SignInWithLinkedIn.less';

const rpt = React.PropTypes;
const block = 'in-sign-with-linked-in';
const logger = createLogger('in-client.SignInWithLinkedIn');

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
    onError: rpt.func.isRequired,
    className: rpt.string,
    showHelp: rpt.func
  },

  getInitialState() {
    return {
      linkedInApiLoaded: false
    };
  },

  componentDidMount() {
    // yak! What a fricking API is that!? ;-(((
    // https://dev.xing.com/plugins/login_with/docs#get-started
    window.onLinkedInAuthLoaded = this.onLinkedInAuthLoaded;

    const apiKey = window.instana.config.keys.linkedin;
    const linkedInScriptElement = document.createElement('script');
    linkedInScriptElement.src = '//platform.linkedin.com/in.js';
    linkedInScriptElement.innerHTML = 'api_key: ' + apiKey + '\n' +
      'authorize: true\n' +
      'onLoad: onLinkedInAuthLoaded';
    document.head.appendChild(linkedInScriptElement);
  },

  onLinkedInAuthLoaded() {
    this.setState({
      linkedInApiLoaded: true
    });
    IN.Event.on(IN, 'auth', this.requestUserData);
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
        if (error.message.indexOf('access token') !== -1 && IN.User.isAuthorized()) {
          logger.info('LinkedIn access token seems to be invalid', error);
          IN.User.logout();
        } else {
          this.props.showHelp(205143862);
          const msg = 'Failed to authenticate using LinkedIn';
          logger.error(msg, error);
          this.props.onError(msg);
        }
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
    if (!this.state.linkedInApiLoaded) {
      return null;
    }

    return (
      <button className={getClassName(this, block)}
              onClick={() => IN.User.authorize()}>
        Sign in with LinkedIn
      </button>
    );
  }
});

export default helpify(SignInWithLinkedIn);
