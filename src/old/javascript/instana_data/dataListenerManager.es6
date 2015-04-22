'use strict';

import InventoryConveyer from 'instana-ui-services/conveyer/InventoryConveyer';
import {create} from 'instana-ui-services/conveyer';
import logging from 'instalog';
import _ from 'lodash';

const logger = logging.createLogger('dataListenerManager.js');


class DataListenerManager {

  constructor(app) {
    //bind methods
    this.onUpdateHosts = this.onUpdateHosts.bind(this);
    this.onUpdateInventory = this.onUpdateInventory.bind(this);
    this.onInventoryDestroyed = this.onInventoryDestroyed.bind(this);
    this.onHostDestroyed = this.onHostDestroyed.bind(this);

    //save the reference for later use
    this.app = app;

    //set deletion methods so that the manager gets informed on delete
    app.onHostDestroyed = this.onHostDestroyed;
    app.onInventoryDestroyed = this.onInventoryDestroyed;

    //a collection to store all found hosts
    this.detectedHostIds = [];
    //a collection to store all found inventory
    this.detectedInventory = [];

    create(InventoryConveyer).subscribe(
      hosts => this.onUpdateHosts(hosts)
    );
  }

  onUpdateHosts(currentHosts) {
    for (let i = 0; i < currentHosts.size; i++) {
      const hostMetaData = currentHosts.get(i);
      const hostID = hostMetaData.get('hostId');

      //if there is NO valid host stored
      if (this.detectedHostIds.indexOf(hostID) < 0) {
        //new hostMetaData found!
        this.detectedHostIds.push(hostID);

        //create new hostMetaData cube
        this.app.addHost(hostMetaData);

      } else {
        //hostMetaData is still created
        const host = this.app.getHost(hostID);
        if (host !== undefined) {
          //change hosts metaData to the new one
          host.changeMetaData(hostMetaData);
        } else {
          logger.debug('no host found for', hostID);
        }
      }
    }
  }

  //this method is called by the app if a host was disposed
  onHostDestroyed(ID) {
    logger.info('host', ID, 'was destroyed');

    //remove the host from the list so that it can be recreated again!
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

  //this method is called by the app if an inventory cube was disposed
  onInventoryDestroyed(ID) {
    logger.info('inventory', ID, 'was destroyed');

    //remove the host from the list so that it can be recreated again!
    _.remove(this.detectedInventory, item => item === ID);
  }

  dispose() {
    logger.log('dispose:', this);

    //dispose InventoryConveyer
    //clear arrays
    //set all to null
  }
}

export default DataListenerManager;
