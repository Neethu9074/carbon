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
      expect(component.isActive()).to.equal(false);
      expect(sceneObject.scene.lineFactory.addFragment.callCount).to.equal(0);
    });

    it('should call external method', () => {
      component.stateMachine.changeStateProperty('active', true);

      expect(sceneObject.scene.lineFactory.addFragment.callCount).to.equal(1);
      component.positionChanged(1, 2, 3);
      expect(sceneObject.scene.lineFactory.addFragment.callCount).to.equal(1);
      component.sizeChanged(4, 5, 6);
      expect(sceneObject.scene.lineFactory.addFragment.callCount).to.equal(1);
      component.handleComponentTimeEvent();
      expect(sceneObject.scene.lineFactory.addFragment.callCount).to.equal(2);
    });

    it('should do force update even if there is no change', () => {
      component.stateMachine.changeStateProperty('active', true);

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
