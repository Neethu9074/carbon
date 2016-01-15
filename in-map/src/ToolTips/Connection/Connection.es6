import Immutable from 'immutable';
import React from 'react/addons';
import _ from 'lodash';

import ConnectionTooltip from 'in-components/Tooltips/Connection';
import * as constants from 'in-forge/constants';

import Tooltip from '../Tooltip.es6';


const ConnectionsTooltipRC = React.createClass({

  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    connections: React.PropTypes.array.isRequired
  },

  render() {
    const connections = this.props.connections;
    const listItems = connections
    .filter(connection => connection.from.snapshot && connection.to.snapshot)
    .map(connection => {
      const parent = connection.to.parent;
      const zone = parent.snapshot ? parent.snapshot.getIn(['data', 'groupId']) : parent.id;

      return {
        id: connection.id,
        direction: connection.direction,
        to: {
          ip: this.getOneOfConnectedIps(connection.from, connection.to),
          zone,
          zoneId: parent.id
        }
      };
    });

    return (<ConnectionTooltip connections={listItems}/>);
  },

  getOneOfConnectedIps(from, to) {
    // get ips of the target
    const toIps = this.getIpFromSnapshot(to.snapshot);

    // get connected ips
    const fromIps = this.getConnectedIpsFromSnapshot(from.snapshot);

    // intersections
    const matching = _.intersection(fromIps, toIps);

    // one of them
    return matching[0];
  },

  getConnectedIpsFromSnapshot(snapshot) {
    const ipArray = [];
    const outgoing = snapshot.getIn(['data', 'connections', 'outgoing']) || [];
    const incoming = snapshot.getIn(['data', 'connections', 'incoming']) || [];

    outgoing.concat(incoming).forEach(ip => ipArray.push(ip));

    return ipArray;
  },

  getIpFromSnapshot(snapshot) {
    const cachedIps = snapshot._cachedIps;
    if (cachedIps) {
      return cachedIps;
    }

    const ipArray = [];

    // get all ethernet interfaces
    const ethInterfaces = snapshot.getIn(['data', 'interfaces']);
    if (ethInterfaces) {
      ethInterfaces.forEach(interf => {

        // get all ips of the interface
        const addresses = interf.get('addresses');
        if (addresses) {
          addresses.forEach(address => {
            ipArray.push(address.get('ip'));
          });
        }
      });
    }
    const ec2 = snapshot.getIn(['data',
                                constants.rels.describes,
                                constants.plugins.ec2],
                                Immutable.Map()).valueSeq().first();
    if (ec2) {
      ipArray.push(ec2.get('public-ipv4'));
    }

    snapshot._cachedIps = ipArray;

    return ipArray;
  }
});


export default class TooltipConnection extends Tooltip {
  constructor(parent, hovered) {
    super(parent);

    this.hovered = hovered;
  }

  render() {
    React.render(
      <ConnectionsTooltipRC connections={this.hovered}/>,
      this.stickyNoteContainer
    );
  }

  arraysEqual(arr1, arr2) {
    if (arr1.length !== arr2.length) {
      return false;
    }
    for (let i = 0; i < arr1.length; i++) {
      if (arr1[i] !== arr2[i]) {
        return false;
      }
    }

    return true;
  }

  setHovered(hovered) {
    if (this.arraysEqual(hovered, this.hovered)) {
      return;
    }

    this.hovered = hovered;
    this.render();
  }

  dispose() {
    this.unMount();
  }
}
