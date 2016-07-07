/* eslint-env mocha, node */
/* eslint-disable no-unused-expressions */
import {create} from 'reactive-observables';
import proxyquire from 'proxyquire';
import Immutable from 'immutable';
import RoEmitter from 'roemitter';
import {expect} from 'chai';
import sinon from 'sinon';

import {PROPERTIES, PROPERTY_VALUES} from 'in-map/src/StateMachine/StateMachine';


describe('3D map', () => {
  let component;
  let sceneObject;
  let healthChanged;

  const HealthComponent = proxyquire('./HealthComponent', {
    'in-stores/events': {
      getHealthInfoAtFocusedMoment: () => create().emit(Immutable.fromJS({
        maxSeverity: 0
      }))
    }
  }).default;

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
      eventEmitter: new RoEmitter()
    };
    component = new HealthComponent({sceneObject});
    healthChanged = sinon.stub();
    sceneObject.eventEmitter.on('healthChanged').subscribe(healthChanged);
  });

  describe('HealthComponent', () => {

    it('can be created', () => {
      expect(component.isActive()).to.equal(true);
      expect(component.healthToSet).to.equal(0);
    });

    it('dont call external method until time event was handled', () => {
      component.setHealth(Immutable.fromJS({
        maxSeverity: 0.5
      }));
      expect(healthChanged.callCount).to.equal(0);
      component.handleComponentTimeEvent();
      expect(healthChanged.callCount).to.equal(1);
    });

    it('dont set health on inactive but on resume', () => {
      expect(healthChanged.callCount).to.equal(0);
      component.stateMachine.changeStateProperty(PROPERTIES.ACTIVE, PROPERTY_VALUES.OFF);
      expect(component.isActive()).to.equal(false);
      expect(healthChanged.callCount).to.equal(1);

      component.setHealth(Immutable.fromJS({
        maxSeverity: 0.5
      }));
      component.handleComponentTimeEvent();

      expect(healthChanged.callCount).to.equal(1);
      expect(component.healthToSet).to.equal(0.5);

      component.stateMachine.changeStateProperty(PROPERTIES.ACTIVE, PROPERTY_VALUES.ON);

      expect(healthChanged.callCount).to.equal(2);
      component.handleComponentTimeEvent();
      expect(healthChanged.callCount).to.equal(3);
    });

  });
});
