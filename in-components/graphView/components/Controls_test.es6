/* eslint-env mocha, node */
import {create} from 'reactive-observables';
import proxyquire from 'proxyquire';
import {expect} from 'chai';
import THREE from 'three';
import sinon from 'sinon';


describe('controls', () => {
  let createControls;
  let controls;

  let onMouseLeave;
  let onMouseWheel;
  let onMouseDown;
  let onMouseMove;
  let onMouseUp;

  let camera;

  const cameraTestConfig = {
    cameraMoveSpeed: 1,
    startingWorldDistance: 300,
    startingZoomDistance: 30
  };

  beforeEach(() => {
    onMouseLeave = sinon.stub();
    onMouseWheel = sinon.stub();
    onMouseDown = sinon.stub();
    onMouseMove = sinon.stub();
    onMouseUp = sinon.stub();

    createControls = proxyquire('in-components/graphView/components/Controls', {
      'in-map/src/timeCalculations': {
        getDeltaTime: () => 0.5
      },
      'in-services/reactiveMouseEvents': {
        onWheel: (canvas, callback) => {
          onMouseWheel = create();
          return onMouseWheel.subscribe(callback);
        },
        onLeave: (canvas, callback) => {
          onMouseLeave = create();
          return onMouseLeave.subscribe(callback);
        },
        onMove: (canvas, callback) => {
          onMouseMove = create();
          return onMouseMove.subscribe(callback);
        },
        onDown: (canvas, callback) => {
          onMouseDown = create();
          return onMouseDown.subscribe(callback);
        },
        onUp: (canvas, callback) => {
          onMouseUp = create();
          return onMouseUp.subscribe(callback);
        }
      }
    }).default;

    camera = new THREE.PerspectiveCamera(75, 1, 1, 1000);
  });

  afterEach(() => {
    controls.dispose();
  });

  it('should setup events', () => {
    controls = createControls(null, camera, {});

    expect(onMouseLeave === undefined).to.equal(false);
    expect(onMouseWheel === undefined).to.equal(false);
    expect(onMouseDown === undefined).to.equal(false);
    expect(onMouseMove === undefined).to.equal(false);
    expect(onMouseUp === undefined).to.equal(false);
  });

  it('should start with parameters if given', () => {
    controls = createControls(null, camera, cameraTestConfig);

    expect(camera.position.z).to.equal(30);
    expect(controls.poi.position.z).to.equal(300);
  });

  it('should fly to position when update is called', () => {
    controls = createControls(null, camera, cameraTestConfig);

    expect(camera.position.z).to.equal(30);
    expect(controls.poi.position.z).to.equal(300);

    controls.update();

    // dt is 0.5 and speed = 1, so the new pos should be 299
    expect(controls.poi.position.z).to.equal(150);
  });

  it('should zoom out when zoom is called', () => {
    controls = createControls(null, camera, cameraTestConfig);
    expect(camera.position.z).to.equal(30);

    onMouseWheel.emit({
      scrollSpeed: 1,
      scrollDirection: 1
    });
    controls.update();

    expect(camera.position.z).to.equal(30.5);
  });

  it('should zoom out when zoom is called', () => {
    controls = createControls(null, camera, cameraTestConfig);
    expect(camera.position.z).to.equal(30);

    onMouseDown.emit(true);
    onMouseMove.emit({movementX: 10, movementY: 20});
    onMouseUp.emit(true);
    controls.update();

    const deltaY = controls.poi.rotation.toVector3().y - (5 * Math.PI / 180);
    expect(deltaY < 0.000001).to.equal(true);
  });
});
