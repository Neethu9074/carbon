import React from 'react';

import { getServiceLocators } from 'in-components/FlowMap/serviceLocator/serviceLocator';
import Button from 'in-components/FlowMap/components/Controls/Button';

import locals from './Controls.mless';

export default function Controls({ serviceLocatorUid }) {
  return (
    <div className={locals.controls}>
      <Button onClick={() => toggleParticles(serviceLocatorUid)} iconType="particles" />
      <Button onClick={() => zoomIn(serviceLocatorUid)} iconType="plus_without_frame" />
      <Button onClick={() => zoomOut(serviceLocatorUid)} iconType="minus" />
    </div>
  );
}

function toggleParticles(serviceLocatorUid) {
  getServiceLocators(serviceLocatorUid).eventBusServiceLocator.emit('toggle_particles', true);
}

function zoomIn(serviceLocatorUid) {
  getServiceLocators(serviceLocatorUid)
    .sceneServiceLocator.getScene()
    .cameraController.zoomIn(5);
}

function zoomOut(serviceLocatorUid) {
  getServiceLocators(serviceLocatorUid)
    .sceneServiceLocator.getScene()
    .cameraController.zoomOut(5);
}
