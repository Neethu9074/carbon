/*eslint-disable react/no-multi-comp*/
import React from 'react';
import irpt from 'react-immutable-proptypes';
import {State, Navigation} from 'react-router';
import {createLogger} from 'instalog';

import ResponsiveTable from 'in-components/ResponsiveTable';

import http from 'in-services/http';

import './EnvironmentPane.less';

const logger = createLogger('in-client.EnvironmentPane');
const block = 'in-dashboard';

const EnvironmentPane = React.createClass({
  mixins: [React.addons.PureRenderMixin, Navigation, State],

  propTypes: {
    environments: irpt.list.isRequired
  },

  getInitialState() {
    return {
      environments: []
    };
  },

  componentWillMount() {
    this.loadEnvironments();
  },

  loadEnvironments() {
    http({method: 'GET', url: '/internal/api/environments'})
      .then(response => {
        this.setState({
          environments: response.body,
          error: null
        });
      }, err => {
        logger.error('Failed to load environments', err);
        this.setState({
          environments: null,
          error: err
        });
      });
  },

  render() {
    const environments = this.state.environments;
    return (
        <div className={block}>
          <div className={block + '__content-wrapper'}>
            <div className={block + '__content'} ref='content'>
              <ResponsiveTable isClickable={true}>
                <thead>
                <tr>
                  <th>Environment</th>
                  <th>Tenant</th>
                  <th>Tenant Unit</th>
                </tr>
                </thead>
                <tbody>
                {environments.map((environment) =>
                   <tr onClick={() => this.transitionTo('snapshot-pane', {env: environment[0],
                                                                          tenant: environment[1],
                                                                          unit: environment[2]})}>
                     <td>{environment[0]}</td>
                     <td>{environment[1]}</td>
                     <td>{environment[2]}</td>
                   </tr>)}
                </tbody>
              </ResponsiveTable>
            </div>
          </div>
        </div>
    );
  }

});

export default EnvironmentPane;
