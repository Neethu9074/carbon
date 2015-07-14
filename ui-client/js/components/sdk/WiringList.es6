'use strict';

import React from 'react/addons';
import irpt from 'react-immutable-proptypes';
import {Navigation} from 'react-router';

import {getLabel} from 'instana-ui-sdk/snapshot';
import {getIdString} from 'instana-ui-services/util/snapshots';
import {getWiringWithFullSnapshots} from 'instana-ui-services/wiring';
import Collapsible from 'instana-ui-components/Collapsible';

import enhance from '../enhance';


const rpt = React.PropTypes;
const block = 'in-wiring-list';

const WiringList = React.createClass({
  mixins: [
    React.addons.PureRenderMixin,
    Navigation
  ],

  propTypes: {
    snapshot: irpt.map.isRequired,
    targetPluginId: rpt.string.isRequired,
    wiring: irpt.set
  },

  statics: {
    createObservables(props) {
      return {
        wiring: getWiringWithFullSnapshots(props.snapshot)
      };
    }
  },

  render() {
    if (this.props.wiring == null || this.props.wiring.size === 0) {
      return null;
    }

    return (
      <Collapsible initiallyOpen={true}>
        <Collapsible.Header>
          Related components
        </Collapsible.Header>
        <Collapsible.Content>
          <ul className={block}>
            {this.props.wiring.map(snapshot =>
              <li key={getIdString(snapshot)}
                  onClick={() => this.navigateToDashboard(snapshot)}>
                {getLabel(snapshot)}
              </li>
            )}
          </ul>
        </Collapsible.Content>
      </Collapsible>
    );
  },

  navigateToDashboard(snapshot) {
    this.transitionTo(
      'dashboard',
      {
        pluginId: snapshot.get('pluginId'),
        steadyId: snapshot.get('steadyId'),
        hostId: snapshot.get('hostId')
      }
    );
  }
});

export default enhance(WiringList);
