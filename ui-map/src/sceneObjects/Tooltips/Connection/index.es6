'use strict';

import React from 'react/addons';
import _ from 'lodash';

import Tooltip from '../Tooltip';
import ConnectionTooltip from 'instana-ui-components/Tooltips/Connection';
import {getIps} from 'instana-ui-sdk/snapshot';


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
    const listItems = this.props.connections.map(connection => {
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
/*eslint-enable no-unused-vars*/

export default class TooltipConnection extends Tooltip {
  constructor(parent, hovered) {
    super(parent);

    this.hovered = hovered;
    this.render(hovered);
  }

  render(connections) {
    React.render(
      <ConnectionsTooltipRC connections={connections}/>,
      this.stickyNoteContainer
    );
  }

  arraysEqual(arr1, arr2) {
    if(arr1.length !== arr2.length) {
      return false;
    }
    for(let i = arr1.length; i > 0; i--) {
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
    this.render(hovered);
  }

  dispose() {
    super.dispose();
  }
}
