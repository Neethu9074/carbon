/*eslint-env mocha, node */
/*eslint-disable no-unused-expressions */
'use strict';

import {expect} from 'chai';
import {health} from 'in-services/health';
import sinon from 'sinon';

import HealthComponent from './HealthComponent';


describe('3D map', () => {
  let component;
  let sceneObject;

  beforeEach(() => {
    sceneObject = {
      healthChanged: sinon.stub(),
      scene: {renderScene: sinon.stub()}
    };
    component = new HealthComponent({sceneObject});
  });

  describe('HealthComponent', () => {

    it('can be created', () => {
      expect(component.isActive()).to.equal(true);
      expect(component.healthToSet).to.equal(health.ok);
    });

    it('dont call external method until time event was handled', () => {
      component.setHealth(health.warning);
      expect(sceneObject.healthChanged.callCount).to.equal(0);
      component.handleComponentTimeEvent();
      expect(sceneObject.healthChanged.callCount).to.equal(1);
    });

    it('dont set health on inactive but on resume', () => {
      expect(sceneObject.healthChanged.callCount).to.equal(0);
      component.stateMachine.changeStateProperty('active', false);
      expect(component.isActive()).to.equal(false);
      expect(sceneObject.healthChanged.callCount).to.equal(1);

      component.setHealth(health.warning);
      component.handleComponentTimeEvent();

      expect(sceneObject.healthChanged.callCount).to.equal(1);
      expect(component.healthToSet).to.equal(health.warning);

      component.stateMachine.changeStateProperty('active', true);

      expect(sceneObject.healthChanged.callCount).to.equal(1);
      component.handleComponentTimeEvent();
      expect(sceneObject.healthChanged.callCount).to.equal(2);
    });

  });
});
