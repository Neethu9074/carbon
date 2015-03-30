'use strict';

import DataListener from './dataListener';

//logging
import {
	createLogger
}
from '../log';
import _ from 'lodash';

const logger = createLogger('dataListenerManager.js');


class DataListenerManager {

	constructor(app, interval) {
		//bind methods
		this.onUpdateHosts = this.onUpdateHosts.bind(this);
		this.onUpdateInventory = this.onUpdateInventory.bind(this);
		this.onInventoryDestroyed = this.onInventoryDestroyed.bind(this);
		this.onHostDestroyed = this.onHostDestroyed.bind(this);

		this.app = app;
		app.onHostDestroyed = this.onHostDestroyed;
		app.onInventoryDestroyed = this.onInventoryDestroyed;

		//a collection to store all found hosts
		this.detectedHostIds = [];
		//a collection to store all found inventory
		this.detectedInventory = [];

		//create the listener with a refresh interval of x
		const dataListener = new DataListener(interval);

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
				if(host !== undefined) {
					host.changeMetaData(hostMetaData);
				}
			}
		}
	}

	onHostDestroyed(ID) {
  	logger.info('host', ID, 'was destroyed');
		_.remove(this.detectedHostIds, item => item === ID);
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
				//get cube with name = hostID and add a cube
				const hostCube = this.app.getHost(hostID);

				if (hostCube !== undefined) {
					//add the inventory if the host exists
					this.detectedInventory.push(invID);

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

	onInventoryDestroyed(ID) {
  	logger.info('inventory', ID, 'was destroyed');
		_.remove(this.detectedInventory, item => item === ID);
	}
}

export default DataListenerManager;
