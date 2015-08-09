

import Immutable from 'immutable';
import * as ro from 'reactive-observables';

import {
  addWiredSnapshotFinder,
  addIpFinder
} from 'in-sdk/snapshot';
import {create} from 'in-services/conveyer';
import SnapshotConveyer from 'in-services/conveyer/SnapshotConveyer';

import * as constants from '../constants';

addWiredSnapshotFinder(
  constants.plugins.os,
  (snapshot) => {
    let snapshotsSubscribtion;
    return ro.create({
      emitLatestOnSubscribe: true,

      start(observerable) {
        snapshotsSubscribtion =
          create(SnapshotConveyer, {pluginId: snapshot.get('pluginId')})
          .subscribe(snapshots =>
            observerable.emit(extractConnections(snapshot, snapshots))
           );
      },

      stop() {
        snapshotsSubscribtion.dispose();
        snapshotsSubscribtion = null;
      }
    });
  }
);


/* eslint-disable new-cap */
/**
 * Extract an array of all found connections as string IPs.
 *
 * @param {Immutable.Map} snapshot An immutable snapshot from which the
 * connection part should be extracted.
 * @returns {Immutable.Map<
      Immutable, {Immutable.List<string>, Immutable.List<string>}
    >} a map with all snapshots and a list of all connected ones, seperated into
 * outgoing and incoming connections.
 */
export function extractConnections(snapshot, snapshots) {
  const ipSnapshotMap = calculateIpMap(snapshots);
  const map = Immutable.Map().asMutable();

  const connections = {};

  connections.outgoing = extractConnectionsFromMap(
    snapshot.getIn(['data', 'connections', 'outgoing']),
    ipSnapshotMap);

  connections.incoming = extractConnectionsFromMap(
    snapshot.getIn(['data', 'connections', 'incoming']),
    ipSnapshotMap);

  map.set('outgoing', connections.outgoing);
  map.set('incoming', connections.incoming);

  return map.asImmutable();
}

function extractConnectionsFromMap(connections, ipSnapshotMap) {
  if (connections && connections.size > 0) {
    return connections.map(ip => {
      return getSnapshotByIp(ip, ipSnapshotMap);
    });
  }
  return Immutable.List();
}
/* eslint-enable new-cap */

/**
 * Extract a map of all hosts.
 *
 * @param {Immutable.Map} snapshot An immutable snapshot from which the
 * connection part should be extracted.
 *
 * @returns {Immutable.Map<string, Immutable.Map>}
 */
export function calculateIpMap(snapshots) {
  const map = new Immutable.Map().asMutable();
  //get ips for each host
  snapshots.forEach(host => {
    getIpBySnapshot(host).forEach(ip => {
      map.set(ip, host);
    });
  });

  return map.asImmutable();
}

function getSnapshotByIp(ip, ipSnapshotMap) {
  let snapshot = ipSnapshotMap.get(ip);
  if(!snapshot) {
    snapshot = Immutable.fromJS({
      state: 'unmonitored',
      hostId: 'unknown',
      pluginId: 'com.instana.forge.infrastructure.os.OS',
      steadyId: ip
    });
  }
  return snapshot;
}


function getIpBySnapshot(snapshot) {
  const ipArray = [];

  //get all ethernet interfaces
  const ethInterfaces = snapshot.getIn(['data', 'interfaces']);
  if(ethInterfaces) {
    ethInterfaces.forEach(interf => {

      //get all ips of the interface
      const ips = interf.get('ips');
      ips.forEach(ip => {
        ipArray.push(ip);
      });
    });
  }
  const ec2 = snapshot.getIn(['data',
                           constants.rels.describes,
                           constants.plugins.ec2],
                           Immutable.Map()).valueSeq().first();
  if (ec2) {
    ipArray.push(ec2.get('public-ipv4'));
  }

  return ipArray;
}

addIpFinder(
  constants.plugins.os,
  (snapshot) => {return getIpBySnapshot(snapshot); }
);
