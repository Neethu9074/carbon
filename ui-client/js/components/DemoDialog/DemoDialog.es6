/*global IN:false*/

'use strict';

import _ from 'lodash';
import React from 'react/addons';
import {createLogger} from 'instalog';

import * as connection from 'instana-ui-services/connection';

import Dialog from '../Dialog';

const logger = createLogger('ui-client.DemoDialog');

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

const DemoDialog = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    // TODO Define props
    // foo: rpt.string.isRequired
  },

  getInitialState() {
    return {
      userData: null,
      error: null
    };
  },

  componentWillMount() {
    IN.Event.on(IN, 'load', () => {
      if (IN.User.isAuthorized()) {
        this.requestUserData();
      } else {
        IN.User.authorize();
      }
    });

    IN.Event.on(IN, 'auth', this.requestUserData);
  },

  requestUserData() {
    const url = '/people/~:(id,first-name,last-name,formatted-name,headline' +
      ',location,industry,summary,specialties,positions,public-profile-url,' +
      'email-address,picture-url)';
    IN.API.Raw(url)
      .result(data => {
        this.sendUserDataToServer(data);
        this.setState({
          userData: data,
          error: null
        });
      })
      .error(error => {
        logger.error('Failed to authenticate using LinkedIn', error);
        // something went wrong and we cannot authenticate using LinkedIn, we
        // should still let the User see instana!
        this.setState({
          error: error,
          userData: null
        });
      });
  },

  sendUserDataToServer(data) {
    const result = {};

    propMapping.forEach(mapping => {
      const value = _.get(data, mapping.from, '');
      result[mapping.to] = value;
    });

    connection.send({
      event: 'createLead',
      data: result
    });
  },

  render() {
    if (this.state.userData) {
      return null;
    }

    return (
      <Dialog>
        Sign in with linked in
        <button onClick={this.authorize}>Authorize</button>
      </Dialog>
    );
  },

  authorize() {
    IN.User.authorize();
  }
});

export default DemoDialog;
