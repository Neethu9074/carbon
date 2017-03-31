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
      expect(component.color.r).to.equal(1);
      expect(component.color.g).to.equal(1);
      expect(component.color.b).to.equal(1);

      expect(colorChanged).to.have.callCount(0);
    });

    it('should fire event if color changes in any way', () => {
      component.setRGB(1, 0, 0.5);
      expect(colorChanged).to.have.callCount(1);
      expect(colorChanged.getCall(0).args[0]).to.deep.equal({ r: 1, g: 0, b: 0.5 });

      component.setColor({ r: 0, g: 1, b: 0.1 });
      expect(colorChanged).to.have.callCount(2);
      expect(colorChanged.getCall(0).args[0]).to.deep.equal({ r: 0, g: 1, b: 0.1 });

      component.setHex('#ff00ff');
      expect(colorChanged).to.have.callCount(3);
      expect(colorChanged.getCall(0).args[0]).to.deep.equal({ r: 1, g: 0, b: 1 });
    });

    it('should not fire when setting the same color again', () => {
      component.setRGB(1, 0, 0.5);
      expect(colorChanged).to.have.callCount(1);
      expect(colorChanged.getCall(0).args[0]).to.deep.equal({ r: 1, g: 0, b: 0.5 });

      component.setRGB(1, 0, 0.5);
      expect(colorChanged).to.have.callCount(1);
    });
  });
});
