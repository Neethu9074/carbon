/* eslint-env mocha, node */
/* eslint-disable no-unused-expressions */
import {expect} from 'chai';
import sinon from 'sinon';

import {health} from 'in-services/health';

import {PROPERTY_VALUES} from '../../StateMachine/StateMachine';
import HealthComponent from './HealthComponent';


describe('3D map', () => {
  let component;
  let sceneObject;

  beforeEach(() => {
    global.window = {
      location: {
        href: 'http://codecentric.instana.io'
      },
      instana: {
        config: {
          environment: 'production'
        }
      }
    };
    sceneObject = {
      healthChanged: sinon.stub(),
      scene: {renderScene: sinon.stub()}
    };
    component = new HealthComponent({sceneObject});
  });

  describe('HealthComponent', () => {

    it('can be created', () => {
      expect(component.isActive()).to.equal(true);
      expect(component.healthToSet).to.equal('ok');
    });

    it('dont call external method until time event was handled', () => {
      component.setHealth(health.warning);
      expect(sceneObject.healthChanged.callCount).to.equal(0);
      component.handleComponentTimeEvent();
      expect(sceneObject.healthChanged.callCount).to.equal(1);
    });

    it('dont set health on inactive but on resume', () => {
      expect(sceneObject.healthChanged.callCount).to.equal(0);
      component.stateMachine.changeStateProperty('active', PROPERTY_VALUES.OFF);
      expect(component.isActive()).to.equal(false);
      expect(sceneObject.healthChanged.callCount).to.equal(1);

      component.setHealth(health.warning);
      component.handleComponentTimeEvent();

      expect(sceneObject.healthChanged.callCount).to.equal(1);
      expect(component.healthToSet).to.equal(health.warning);

      component.stateMachine.changeStateProperty('active', PROPERTY_VALUES.ON);

      expect(sceneObject.healthChanged.callCount).to.equal(2);
      component.handleComponentTimeEvent();
      expect(sceneObject.healthChanged.callCount).to.equal(3);
    });

  });
});
