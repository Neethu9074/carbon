/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

/* eslint-env jest, node */
import { create } from '@instana/observables';
import { expect } from 'chai';
import { getDeltaTime } from 'in-map/misc/time';
import { onWheel, onLeave, onMove, onDown, onUp } from 'in-services/util/reactiveMouseEvents';
import createControls from 'in-components/graphView/components/Controls';

import { PerspectiveCamera } from 'in-map/3DLibProvider';

jest.mock('in-map/misc/time');
jest.mock('in-services/util/reactiveMouseEvents');

describe('controls', () => {
  let controls;

  let onMouseLeave;
  let onMouseWheel;
  let onMouseDown;
  let onMouseMove;
  let onMouseUp;

  let camera;

  const cameraTestConfig = {
    startingWorldDistance: 300,
    startingZoomDistance: 30,
    cameraMoveSpeed: 1,
    zoomSpeed: 2
  };

  beforeEach(() => {
    getDeltaTime.mockReturnValue(0.5);
    onWheel.mockImplementation((canvas, callback) => {
      onMouseWheel = create();
      return onMouseWheel.subscribe(callback);
    });
    onLeave.mockImplementation((canvas, callback) => {
      onMouseLeave = create();
      return onMouseLeave.subscribe(callback);
    });
    onMove.mockImplementation((canvas, callback) => {
      onMouseMove = create();
      return onMouseMove.subscribe(callback);
    });
    onDown.mockImplementation((canvas, callback) => {
      onMouseDown = create();
      return onMouseDown.subscribe(callback);
    });
    onUp.mockImplementation((canvas, callback) => {
      onMouseUp = create();
      return onMouseUp.subscribe(callback);
    });

    camera = new PerspectiveCamera(75, 1, 1, 1000);
  });

  it('should setup events', () => {
    controls = createControls(null, camera, {});

    expect(onMouseLeave === undefined).to.equal(false);
    expect(onMouseWheel === undefined).to.equal(false);
    expect(onMouseDown === undefined).to.equal(false);
    expect(onMouseMove === undefined).to.equal(false);
    expect(onMouseUp === undefined).to.equal(false);

    controls.dispose();
  });

  it('should start with parameters if given', () => {
    controls = createControls(null, camera, cameraTestConfig);

    expect(camera.position.z).to.equal(30);
    expect(controls.poi.position.z).to.equal(300);

    controls.dispose();
  });

  it('should fly to position when update is called', () => {
    controls = createControls(null, camera, cameraTestConfig);

    expect(camera.position.z).to.equal(30);
    expect(controls.poi.position.z).to.equal(300);

    controls.update();

    // dt is 0.5 and speed = 1, so the new pos should be 299
    expect(controls.poi.position.z).to.equal(150);

    controls.dispose();
  });

  it('should zoom out when zoom is called', () => {
    controls = createControls(null, camera, cameraTestConfig);
    expect(camera.position.z).to.equal(30);

    onMouseWheel.emit({
      scrollSpeed: 10,
      scrollDirection: 1
    });
    controls.update();

    // the speed is 2 and dt is 0.5, so it should be at the goal in one update
    expect(camera.position.z).to.equal(40);

    controls.dispose();
  });

  it('should rotate when panning', () => {
    controls = createControls(null, camera, cameraTestConfig);
    expect(camera.position.z).to.equal(30);

    onMouseDown.emit(true);
    onMouseMove.emit({ movementX: 10, movementY: 20 });
    onMouseUp.emit(true);
    controls.update();

    const deltaY = controls.poi.rotation.toVector3().y - (5 * Math.PI) / 180;
    expect(deltaY < 0.000001).to.equal(true);

    controls.dispose();
  });
});
