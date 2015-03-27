'use strict';

import DataListener from './dataListener';

//logging
import {
	createLogger
}
from '../log';
const logger = createLogger('app.js');


class DataListenerManager {
	constructor(app, interval) {
		this.onUpdateHosts = this.onUpdateHosts.bind(this);
		this.onUpdateInventory = this.onUpdateInventory.bind(this);
		this.app = app;

		//a collection to store all found hosts
		this.detectedHostIds = [];
		//a collection to store all found inventory
		this.detectedInventory = [];

		//create the listener with a refresh interval of x
		const dataListener = new DataListener(interval); // in ms
		dataListener.onUpdateHosts = this.onUpdateHosts;
		dataListener.onUpdateInventory = this.onUpdateInventory;
	}

	onUpdateHosts(
		currentHosts) {
		if (currentHosts.error !== undefined) {
			logger.error(currentHosts.error);
			return; //if error occured
		}

		for (let i = 0; i < currentHosts.length; i++) {
			const hostMetaData = currentHosts[i];
			const hostID = hostMetaData.id;
			if (this.detectedHostIds.indexOf(hostID) < 0) {
				//new hostMetaData found!
				this.detectedHostIds.push(hostID);

				//create new hostMetaData cube
				this.app.addHost(hostMetaData);

			} else {
				//hostMetaData is still created
				const host = this.app.getHost(hostID);
				host.changeMetaData(hostMetaData);

				//TODO: calculate diff ?
			}
		}
	}

	onUpdateInventory(currentInventory) {
		if (currentInventory.error !== undefined) {
			logger.error(currentInventory.error);
			return; //if error occured
		}

		const hostID = currentInventory[0];
		for (let i = 0; i < currentInventory[1].length; i++) {
			const inv = currentInventory[1][i];
			const invID = hostID + '/' + inv.type + '/' + inv.properties.pid;
			if (this.detectedInventory.indexOf(invID) < 0) {
				//new inventory found!
				this.detectedInventory.push(invID);

				//get cube with name = hostID and add a cube
				const hostCube = this.app.getHost(hostID);
				if (hostCube !== undefined) {
					hostCube.addContainer({
						id: invID,
						discription: inv.type,
						pid: inv.properties.pid,
						tag: inv.properties.name,
						entityId: inv.properties.entityId,
						host: inv.properties.host
					});
				}
			}
		}
	}
}

export default DataListenerManager;
