/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
/* eslint-env mocha, node */
import proxyquire from 'proxyquire';
import { expect } from 'chai';
import sinon from 'sinon';

import { createSceneObject } from 'in-map/tests/sceneObjectComponents/helper';

describe('in-map', () => {
  describe('sceneObjectComponents/TransformationComponent', () => {
    let component;
    let sceneObject;
    let transformChanged;

    beforeEach(() => {
      transformChanged = sinon.stub();
      sceneObject = createSceneObject();

      sceneObject.eventEmitter.on('transformationChanged').subscribe(transformChanged);

      const Component = proxyquire('in-map/sceneObjectComponents/TransformationComponent/TransformationComponent', {})
        .default;

      component = new Component(sceneObject);
      component.initEvents();
    });

    afterEach(() => {
      component.disposeEvents();
      component.dispose();
      sceneObject.dispose();
    });

    it('should set transform at constructor time', () => {
      expect(transformChanged).to.have.callCount(1);
    });

    it('should callback position if it changes in any way', () => {
      expect(transformChanged).to.have.callCount(1);

      component.setPosition({ x: 1, y: 2, z: 0 });
      expect(transformChanged).to.have.callCount(2);
      expect(transformChanged.getCall(0).args[0].position.x).to.equal(1);
      expect(transformChanged.getCall(0).args[0].position.y).to.equal(2);
      expect(transformChanged.getCall(0).args[0].position.z).to.equal(0);

      component.setPositionXYZ(2, 4, 1);
      expect(transformChanged).to.have.callCount(3);
      expect(transformChanged.getCall(1).args[0].position.x).to.equal(2);
      expect(transformChanged.getCall(1).args[0].position.y).to.equal(4);
      expect(transformChanged.getCall(1).args[0].position.z).to.equal(1);
    });

    it('should not callback position if the same position was set', () => {
      expect(transformChanged).to.have.callCount(1);

      component.setPosition({ x: 1, y: 2, z: 0 });
      expect(transformChanged).to.have.callCount(2);
      expect(transformChanged.getCall(0).args[0].position.x).to.equal(1);
      expect(transformChanged.getCall(0).args[0].position.y).to.equal(2);
      expect(transformChanged.getCall(0).args[0].position.z).to.equal(0);

      component.setPosition({ x: 1, y: 2, z: 0 });
      expect(transformChanged).to.have.callCount(2);
    });

    it('should callback scale if it changes in any way', () => {
      expect(transformChanged).to.have.callCount(1);

      component.setScale({ x: 1, y: 2, z: 0 });
      expect(transformChanged).to.have.callCount(2);
      expect(transformChanged.getCall(1).args[0].scale.x).to.equal(1);
      expect(transformChanged.getCall(1).args[0].scale.y).to.equal(2);
      expect(transformChanged.getCall(1).args[0].scale.z).to.equal(0);

      component.setScaleXYZ(2, 4, 1);
      expect(transformChanged).to.have.callCount(3);
      expect(transformChanged.getCall(2).args[0].scale.x).to.equal(2);
      expect(transformChanged.getCall(2).args[0].scale.y).to.equal(4);
      expect(transformChanged.getCall(2).args[0].scale.z).to.equal(1);
    });

    it('should not callback scale if the same position was set', () => {
      expect(transformChanged).to.have.callCount(1);

      component.setScale({ x: 1, y: 2, z: 0 });
      expect(transformChanged).to.have.callCount(2);
      expect(transformChanged.getCall(1).args[0].scale.x).to.equal(1);
      expect(transformChanged.getCall(1).args[0].scale.y).to.equal(2);
      expect(transformChanged.getCall(1).args[0].scale.z).to.equal(0);

      component.setScale({ x: 1, y: 2, z: 0 });
      expect(transformChanged).to.have.callCount(2);
    });

    it('should set scale when power changes', () => {
      expect(transformChanged).to.have.callCount(1);

      sceneObject.eventEmitter.emit('powerChanged', 10);

      expect(transformChanged).to.have.callCount(2);
      expect(transformChanged.getCall(1).args[0].scale.x).to.equal(1);
      expect(transformChanged.getCall(1).args[0].scale.y).to.equal(10);
      expect(transformChanged.getCall(1).args[0].scale.z).to.equal(1);
    });

    it('should callback transform if the it has changed', () => {
      expect(transformChanged).to.have.callCount(1);

      component.setTransform({ x: 1, y: 2, z: 0 }, { x: 2, y: 2, z: 2 });
      expect(transformChanged).to.have.callCount(2);
      expect(transformChanged.getCall(0).args[0].position.x).to.equal(1);
      expect(transformChanged.getCall(0).args[0].position.y).to.equal(2);
      expect(transformChanged.getCall(0).args[0].position.z).to.equal(0);
      expect(transformChanged.getCall(0).args[0].scale.x).to.equal(2);
      expect(transformChanged.getCall(0).args[0].scale.y).to.equal(2);
      expect(transformChanged.getCall(0).args[0].scale.z).to.equal(2);

      component.setTransform({ x: 1, y: 2, z: 0 }, { x: 2, y: 2, z: 2 });
      expect(transformChanged).to.have.callCount(2);
    });
  });
});
