import _ from 'lodash';

import {emptyMap} from 'in-services/fixedImmutables';


export function getOneOfConnectedIps(sourceSnapshot, destinationSnapshot) {
  // get ips of the target
  const destinationIPs = getIp(destinationSnapshot);

  // get connected ips
  const sourceIPs = getConnectedIPs(sourceSnapshot);

  // intersections
  const matching = _.intersection(sourceIPs, destinationIPs);

  // one of them if available
  console.log(matching, sourceIPs, destinationSnapshot.toJS());
  return matching.length > 0 ? matching[0] : undefined;
}

function getConnectedIPs(snapshot) {
  const outgoing = snapshot.getIn(['data', 'connections', 'outgoing']) || [];
  const incoming = snapshot.getIn(['data', 'connections', 'incoming']) || [];

  return outgoing.concat(incoming).toArray();
}

function getIp(snapshot) {
  // _cachedIps never gets outdated since snapshot is immutable
  if (snapshot._cachedIps) {
    return snapshot._cachedIps;
  }

  const ips = [];

  // get all ethernet interfaces
  snapshot.getIn(['data', 'interfaces'], emptyMap).forEach(interf =>

    // get all ips of the interface
    interf.get('addresses', emptyMap).forEach(address => ips.push(address.get('ip')))
  );

  snapshot._cachedIps = ips;
  return ips;
}
