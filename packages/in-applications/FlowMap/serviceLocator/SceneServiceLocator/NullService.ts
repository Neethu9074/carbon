/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { noop } from 'in-services/fixedObjects';

export interface ServiceNullService {
  getScene: () => GetScene;
  dispose: () => void;
}

interface GetScene {
  addSceneObject: () => void;
  removeSceneObject: () => void;
  requestRendering: () => void;
}

const nullService: ServiceNullService = {
  getScene: () => ({ addSceneObject: noop, removeSceneObject: noop, requestRendering: noop }),
  dispose: noop
};
export default function createNullService() {
  return nullService;
}
