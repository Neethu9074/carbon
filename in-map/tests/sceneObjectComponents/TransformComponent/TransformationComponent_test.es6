/* eslint-env mocha, node */
import proxyquire from 'proxyquire';
import { expect } from 'chai';
import sinon from 'sinon';

import { createSceneObject } from 'in-map/tests/sceneObjectComponents/helper';

describe('in-map', () => {
  describe('sceneObjectComponents/TransformationComponent', () => {
    let component;
    let sceneObject;
    let positionChanged;
    let scaleChanged;

    beforeEach(() => {
      positionChanged = sinon.stub();
      scaleChanged = sinon.stub();
      sceneObject = createSceneObject();
      sceneObject.eventEmitter.on('positionChanged').subscribe(positionChanged);
      sceneObject.eventEmitter.on('scaleChanged').subscribe(scaleChanged);

      const Component = proxyquire('in-map/sceneObjectComponents/TransformationComponent/TransformationComponent', {
      }).default;

      component = new Component(sceneObject);
      component.initEvents();
    });

    afterEach(() => {
      component.disposeEvents();
      component.dispose();
      sceneObject.dispose();
    });

    it('should not set position at constructor time', () => {
      expect(positionChanged).to.have.callCount(0);
    });

    it('should set scale at constructor time', () => {
      expect(scaleChanged).to.have.callCount(1);
    });

    it('should callback position if it changes in any way', () => {
      expect(positionChanged).to.have.callCount(0);

      component.setPosition({ x: 1, y: 2, z: 0 });
      expect(positionChanged).to.have.callCount(1);
      expect(positionChanged.getCall(0).args[0].x).to.equal(1);
      expect(positionChanged.getCall(0).args[0].y).to.equal(2);
      expect(positionChanged.getCall(0).args[0].z).to.equal(0);

      component.setPositionXYZ(2, 4, 1);
      expect(positionChanged).to.have.callCount(2);
      expect(positionChanged.getCall(1).args[0].x).to.equal(2);
      expect(positionChanged.getCall(1).args[0].y).to.equal(4);
      expect(positionChanged.getCall(1).args[0].z).to.equal(1);
    });

    it('should not callback position if the same position was set', () => {
      expect(positionChanged).to.have.callCount(0);

      component.setPosition({ x: 1, y: 2, z: 0 });
      expect(positionChanged).to.have.callCount(1);
      expect(positionChanged.getCall(0).args[0].x).to.equal(1);
      expect(positionChanged.getCall(0).args[0].y).to.equal(2);
      expect(positionChanged.getCall(0).args[0].z).to.equal(0);

      component.setPosition({ x: 1, y: 2, z: 0 });
      expect(positionChanged).to.have.callCount(1);
    });

    it('should callback scale if it changes in any way', () => {
      expect(scaleChanged).to.have.callCount(1);

      component.setScale({ x: 1, y: 2, z: 0 });
      expect(scaleChanged).to.have.callCount(2);
      expect(scaleChanged.getCall(1).args[0].x).to.equal(1);
      expect(scaleChanged.getCall(1).args[0].y).to.equal(2);
      expect(scaleChanged.getCall(1).args[0].z).to.equal(0);

      component.setScaleXYZ(2, 4, 1);
      expect(scaleChanged).to.have.callCount(3);
      expect(scaleChanged.getCall(2).args[0].x).to.equal(2);
      expect(scaleChanged.getCall(2).args[0].y).to.equal(4);
      expect(scaleChanged.getCall(2).args[0].z).to.equal(1);
    });

    it('should not callback scale if the same position was set', () => {
      expect(scaleChanged).to.have.callCount(1);

      component.setScale({ x: 1, y: 2, z: 0 });
      expect(scaleChanged).to.have.callCount(2);
      expect(scaleChanged.getCall(1).args[0].x).to.equal(1);
      expect(scaleChanged.getCall(1).args[0].y).to.equal(2);
      expect(scaleChanged.getCall(1).args[0].z).to.equal(0);

      component.setScale({ x: 1, y: 2, z: 0 });
      expect(scaleChanged).to.have.callCount(2);
    });

    it('should set scale when power changes', () => {
      expect(scaleChanged).to.have.callCount(1);

      sceneObject.eventEmitter.emit('powerChanged', 10);

      expect(scaleChanged).to.have.callCount(2);
      expect(scaleChanged.getCall(1).args[0].x).to.equal(1);
      expect(scaleChanged.getCall(1).args[0].y).to.equal(10);
      expect(scaleChanged.getCall(1).args[0].z).to.equal(1);
    });
  });
});
