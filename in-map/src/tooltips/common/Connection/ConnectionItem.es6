import irpt from 'react-immutable-proptypes';
import Immutable from 'immutable';
import React from 'react/addons';
import _ from 'lodash';

import {DIRECTIONS} from 'in-map/src/mapSceneObjects/common/Connection';
import {getColorPool} from 'in-services/util/ColorGenerator';
import * as constants from 'in-forge/constants';
import getSnapshot from 'in-hoc/getSnapshot';
import Icon from 'in-components/Icon';
import getZone from 'in-hoc/getZone';

import './ConnectionItem.less';


const rpt = React.PropTypes;
const block = 'in-connection-item';

const ConnectionItem = getZone(getSnapshot(React.createClass({

  displayName: 'ConnectionItem',

  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    sourceSnapshot: irpt.map.isRequired,
    snapshotId: rpt.string.isRequired,
    direction: rpt.string.isRequired,
    zoneSnapshot: irpt.map,
    snapshot: irpt.map
  },

  render() {
    const sourceSnapshot = this.props.sourceSnapshot;
    const zoneSnapshot = this.props.zoneSnapshot;
    const snapshot = this.props.snapshot;
    if (!snapshot || !sourceSnapshot) {
      return null;
    }

    const ip = this.getOneOfConnectedIps(sourceSnapshot, snapshot);
    const color = zoneSnapshot ? getColorPool('groups').getColorHex(zoneSnapshot.get('id')) : '';

    return (
      <div className={block}>
        {this.props.direction === DIRECTIONS.IN ?
          <Icon className={block + '__icon'} type={'arrow_left'}/> :
          <Icon className={block + '__icon'} type={'arrow_right'}/>
        }
        <span className={block + '__ip'}>
          {ip}
        </span>
        <span style={{color}}>
          {zoneSnapshot ? zoneSnapshot.getIn(['data', 'groupId']) : null}
        </span>
      </div>
    );
  },

  getOneOfConnectedIps(sourceSnapshot, destinationSnapshot) {
    // get ips of the target
    const destinationIPs = this.getIpFromSnapshot(destinationSnapshot);

    // get connected ips
    const sourceIPs = this.getConnectedIPsFromSnapshot(sourceSnapshot);

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
})));

export default ConnectionItem;
