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
  describe('sceneObjectComponents/ColorComponent', () => {
    let component;
    let sceneObject;
    let colorChanged;

    beforeEach(() => {
      colorChanged = sinon.stub();
      sceneObject = createSceneObject();
      sceneObject.eventEmitter.on('colorChanged').subscribe(colorChanged);

      const Component = proxyquire('in-map/sceneObjectComponents/ColorComponent/ColorComponent', {}).default;

      component = new Component(sceneObject);
    });

    afterEach(() => {
      component.disposeEvents();
      component.dispose();
      sceneObject.dispose();
    });

    it('should set white as default color', () => {
      expect(component.color).to.equal('#ffffff');

      expect(colorChanged).to.have.callCount(0);
    });

    it('should fire event if color changes in any way', () => {
      component.setHex('#ff00ff');
      expect(colorChanged).to.have.callCount(1);
      expect(colorChanged.getCall(0).args[0]).to.deep.equal('#ff00ff');
    });

    it('should not fire when setting the same color again', () => {
      component.setHex('#abcdef');
      expect(colorChanged).to.have.callCount(1);
      expect(colorChanged.getCall(0).args[0]).to.equal('#abcdef');

      component.setHex('#abcdef');
      expect(colorChanged).to.have.callCount(1);
    });
  });
});
