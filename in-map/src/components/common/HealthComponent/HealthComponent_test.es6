/* eslint-env mocha, node */
/* eslint-disable no-unused-expressions */
import {create} from 'reactive-observables';
import proxyquire from 'proxyquire';
import RoEmitter from 'roemitter';
import {expect} from 'chai';
import sinon from 'sinon';

import {PROPERTIES, PROPERTY_VALUES} from 'in-map/src/StateMachine/StateMachine';
import {health} from 'in-services/health';


describe('3D map', () => {
  let component;
  let sceneObject;
  let healthChanged;

  const HealthComponent = proxyquire('./HealthComponent', {
    'in-services/issueTracker': { getHealth: () => create().startWith(health.ok) }
  });

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
      scene: {renderScene: sinon.stub()},
      eventEmitter: new RoEmitter()
    };
    component = new HealthComponent({sceneObject});
    healthChanged = sinon.stub();
    sceneObject.eventEmitter.on('healthChanged').subscribe(healthChanged);
  });

  describe('HealthComponent', () => {

    it('can be created', () => {
      expect(component.isActive()).to.equal(true);
      expect(component.healthToSet).to.equal('ok');
    });

    it('dont call external method until time event was handled', () => {
      component.setHealth(health.warning);
      expect(healthChanged.callCount).to.equal(0);
      component.handleComponentTimeEvent();
      expect(healthChanged.callCount).to.equal(1);
    });

    it('dont set health on inactive but on resume', () => {
      expect(healthChanged.callCount).to.equal(0);
      component.stateMachine.changeStateProperty(PROPERTIES.ACTIVE, PROPERTY_VALUES.OFF);
      expect(component.isActive()).to.equal(false);
      expect(healthChanged.callCount).to.equal(1);

      component.setHealth(health.warning);
      component.handleComponentTimeEvent();

      expect(healthChanged.callCount).to.equal(1);
      expect(component.healthToSet).to.equal(health.warning);

      component.stateMachine.changeStateProperty(PROPERTIES.ACTIVE, PROPERTY_VALUES.ON);

      expect(healthChanged.callCount).to.equal(2);
      component.handleComponentTimeEvent();
      expect(healthChanged.callCount).to.equal(3);
    });

  });
});
