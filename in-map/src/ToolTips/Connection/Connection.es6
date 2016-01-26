import Immutable from 'immutable';
import React from 'react/addons';
import _ from 'lodash';

import * as constants from 'in-forge/constants';

import Tooltip from '../Tooltip.es6';
// import ConnectionTooltip from 'in-components/Tooltips/Connection';


const ConnectionsTooltipRC = React.createClass({

  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    connections: React.PropTypes.array.isRequired
  },

  render() {
    const connections = this.props.connections;
    return (
      <ul>
        {connections.map(connection =>
          <li key={connection.id}>
            {connection.sourceNode.id + ' ->' + connection.destinationNode.id}
          </li>
        )}
      </ul>
    );

    // const listItems = connections
    // .filter(connection => connection.sourceNode.snapshot && connection.destinationNode.snapshot)
    // .map(connection => {
    //   return {
    //     id: connection.id,
    //     destination: {
    //       ip: this.getOneOfConnectedIps(connection.sourceNode, connection.destinationNode),
    //       zoneId: connection.destinationNode.parent
    //     }
    //   };
    // });

    // return <ConnectionTooltip connections={listItems}/>;
  },

  getOneOfConnectedIps(sourceNode, destinationNode) {
    // get ips of the target
    const destinationIPs = this.getIpFromSnapshot(destinationNode.snapshot);

    // get connected ips
    const sourceIPs = this.getConnectedIPsFromSnapshot(sourceNode.snapshot);

    // intersections
    const matching = _.intersection(sourceIPs, destinationIPs);

    // one of them
    return matching[0];
  },

  getConnectedIPsFromSnapshot(snapshot) {
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
