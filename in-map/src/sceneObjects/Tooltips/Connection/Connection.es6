import React from 'react/addons';
import _ from 'lodash';

import ConnectionTooltip from 'in-components/Tooltips/Connection';
import {getIps} from 'in-sdk/snapshot';

import Tooltip from '../Tooltip';


const ConnectionsTooltipRC = React.createClass({

  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    connections: React.PropTypes.array.isRequired
  },

  getIpBySnapshot(snapshot) {
    const ipArray = [];
    const outgoing = snapshot.getIn(['data', 'connections', 'outgoing']) || [];
    const incoming = snapshot.getIn(['data', 'connections', 'incoming']) || [];

    outgoing.concat(incoming).forEach(ip => ipArray.push(ip));

    return ipArray;
  },

  getOneOfConnectedIps(from, to) {
    if(!from || !to) {
      return null;
    }

    if(to.isUnknown) {
      return to.snapshot.get('steadyId');
    }

    if(from.isUnknown) {
      return to.snapshot.getIn(['data', 'hostname']);
    }

    //get ips of the target
    const toIps = getIps(to.snapshot);

    //get connected ips
    const fromIps = this.getIpBySnapshot(from.snapshot);

    //intersections
    const matching = _.intersection(fromIps, toIps);

    //one of them
    return matching[0];
  },

  render() {
    const listItems = this.props.connections
      .filter(connection => connection.from.snapshot && connection.to.snapshot)
      .map(connection => {
        return {
          id: connection.id,
          direction: connection.direction,
          to: {
            ip: this.getOneOfConnectedIps(connection.from, connection.to),
            zone: connection.to.parent.id
          }
        };
      });

    return (<ConnectionTooltip connections={listItems}/>);
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
    if(arr1.length !== arr2.length) {
      return false;
    }
    for (let i = 0; i < arr1.length; i++) {
      if(arr1[i] !== arr2[i]) {
        return false;
      }
    }

    return true;
  }

  setHovered(hovered) {
    if(this.arraysEqual(hovered, this.hovered)) {
      return;
    }

    this.hovered = hovered;
    this.render();
  }

  dispose() {
    super.dispose();
  }
}
