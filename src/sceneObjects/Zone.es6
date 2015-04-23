'use strict';

import SceneObject from './SceneObject';
import Host from './Host';

import _ from 'lodash';


export default class Zone extends SceneObject {

  constructor({parent, id}) {
    super({parent});
    this.id = id;
    this.hosts = [];
  }

  addHost(snapshot) {
    const hostId = snapshot.get('hostId');
		let host = _.find(this.hosts, host => host.id === hostId);
		if (!host) {
			host = new Host({
				parent: this,
				id: hostId
			});
			this.hosts.push(host);
		}
  }
}
