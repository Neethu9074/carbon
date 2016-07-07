/* eslint-disable no-unused-expressions no-unused-vars*/
/* eslint-env mocha, node */
import RoEmitter from 'roemitter';
import {expect} from 'chai';
import sinon from 'sinon';

import {PROPERTIES, PROPERTY_VALUES} from 'in-map/src/StateMachine/StateMachine';

import HighlightingComponent from './HighlightingComponent';


describe('3D map', () => {
  let component;
  let sceneObject;

  beforeEach(() => {
    sceneObject = {
      stateMachine: {
        changeStateProperty: sinon.stub()
      },
      eventEmitter: new RoEmitter(),
      positionChanged: sinon.stub(),
      lineSMF: {
        addFragment: sinon.stub(),
        removeFragment: sinon.stub()
      }
    };
    sceneObject.getFactory = () => sceneObject.lineSMF;
    component = new HighlightingComponent({sceneObject});
  });

  describe('HighlightingComponent', () => {

    it('can be created', () => {
      expect(component.isActive()).to.equal(false);
      expect(sceneObject.lineSMF.addFragment.callCount).to.equal(0);
    });

    it('should call external method', () => {
      component.stateMachine.changeStateProperty(PROPERTIES.ACTIVE, PROPERTY_VALUES.ON);

      expect(sceneObject.lineSMF.addFragment.callCount).to.equal(1);
      component.positionChanged({x: 1, y: 2, z: 3});
      expect(sceneObject.lineSMF.addFragment.callCount).to.equal(1);
      component.sizeChanged(4, 5, 6);
      expect(sceneObject.lineSMF.addFragment.callCount).to.equal(1);
      component.handleComponentTimeEvent();
      expect(sceneObject.lineSMF.addFragment.callCount).to.equal(2);
    });

    it('should do force update even if there is no change', () => {
      component.stateMachine.changeStateProperty(PROPERTIES.ACTIVE, PROPERTY_VALUES.ON);

      component.positionChanged({x: 1, y: 2, z: 3});
      expect(sceneObject.lineSMF.addFragment.callCount).to.equal(1);
      component.handleComponentTimeEvent();
      expect(sceneObject.lineSMF.addFragment.callCount).to.equal(2);

      component.positionChanged({x: 1, y: 2, z: 3});
      expect(sceneObject.lineSMF.addFragment.callCount).to.equal(2);
      component.handleComponentTimeEvent();
      expect(sceneObject.lineSMF.addFragment.callCount).to.equal(3);
    });

  });
});
