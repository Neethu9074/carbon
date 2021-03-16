/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import TouchControlsDecorator from 'in-map/misc/common/cameraController/decorator/TouchControlsDecorator';
import MouseControlsDecorator from 'in-map/misc/common/cameraController/decorator/MouseControlsDecorator';
import RayCasterDecorator from 'in-map/misc/common/cameraController/decorator/RayCasterDecorator';
import BasicCameraController from 'in-map/misc/common/cameraController/BasicCameraController';

export default function createCameraController(canvas, map) {
  return new TouchControlsDecorator(
    new RayCasterDecorator(new MouseControlsDecorator(new BasicCameraController('lines'), canvas), map),
    canvas
  );
}
