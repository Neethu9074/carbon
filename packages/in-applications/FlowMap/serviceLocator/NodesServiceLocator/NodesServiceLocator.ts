/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import {
  ServiceNullService,
  Node,
  NodesCollection
} from 'in-applications/FlowMap/serviceLocator/NodesServiceLocator/types';
import createNullService from 'in-applications/FlowMap/serviceLocator/NodesServiceLocator/NodesService';
import BaseServiceLocator from 'in-applications/FlowMap/serviceLocator/BaseServiceLocator';

export default class NodeServiceLocator extends BaseServiceLocator<ServiceNullService> {
  constructor() {
    super(createNullService);
  }

  addNode(id: string, node: Node): void {
    this.service.addNode(id, node);
  }

  getNodes(): NodesCollection<Node> {
    return this.service.getNodes();
  }

  getNode(id: string): Node | undefined {
    return this.service.getNode(id);
  }

  removeNode(id: string): void {
    this.service.removeNode(id);
  }
}
