/*eslint-env mocha, node */
/*eslint-disable no-unused-expressions */
import {expect} from 'chai';
import sinon from 'sinon';

import HighlightingComponent from './HighlightingComponent';


describe('3D map', () => {
  let component;
  let sceneObject;

  beforeEach(() => {
    sceneObject = {
      positionChanged: sinon.stub(),
      scene: {
        lineFactory: {
          addFragment: sinon.stub(),
          removeFragment: sinon.stub()
        },
        renderScene: sinon.stub()
      }
    };
    component = new HighlightingComponent({sceneObject});
  });

  describe('HighlightingComponent', () => {

    it('can be created', () => {
      expect(component.isActive()).to.equal(true);
      expect(sceneObject.scene.lineFactory.addFragment.callCount).to.equal(1);
    });

    it('should call external method', () => {
      expect(sceneObject.scene.lineFactory.addFragment.callCount).to.equal(1);
      component.positionChanged(1, 2, 3);
      expect(sceneObject.scene.lineFactory.addFragment.callCount).to.equal(1);
      component.sizeChanged(4, 5, 6);
      expect(sceneObject.scene.lineFactory.addFragment.callCount).to.equal(1);
      component.handleComponentTimeEvent();
      expect(sceneObject.scene.lineFactory.addFragment.callCount).to.equal(2);
    });

    it('should do force update even if there is no change', () => {
      component.positionChanged(1, 2, 3);
      expect(sceneObject.scene.lineFactory.addFragment.callCount).to.equal(1);
      component.handleComponentTimeEvent();
      expect(sceneObject.scene.lineFactory.addFragment.callCount).to.equal(2);

      component.positionChanged(1, 2, 3);
      expect(sceneObject.scene.lineFactory.addFragment.callCount).to.equal(2);
      component.handleComponentTimeEvent();
      expect(sceneObject.scene.lineFactory.addFragment.callCount).to.equal(3);
    });

  });
});
