/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

/* eslint-env mocha, node */
import { create } from '@instana/observables';
import proxyquire from 'proxyquire';
import { fromJS } from 'immutable';
import { expect } from 'chai';
import sinon from 'sinon';

import { createSceneObject } from 'in-map/tests/sceneObjectComponents/helper';

describe('in-map', () => {
  describe('sceneObjectComponents/HealthComponent', () => {
    let component;
    let sceneObject;
    let healthChanged;

    beforeEach(() => {
      healthChanged = sinon.stub();
      sceneObject = createSceneObject();
      sceneObject.eventEmitter.on('healthChanged').subscribe(healthChanged);

      const Component = proxyquire('in-map/sceneObjectComponents/HealthComponent/HealthComponent', {
        'in-stores/events': {
          getHealthInfoAtFocusedMoment: () =>
            create().startWith(
              fromJS({
                problem: {
                  severity: 5
                }
              })
            )
        }
      }).default;

      component = new Component(sceneObject);
      component.initEvents();
    });

    afterEach(() => {
      component.disposeEvents();
      component.dispose();
      sceneObject.dispose();
    });

    it('should redirect health to client', () => {
      expect(healthChanged).to.have.callCount(2);
      expect(healthChanged.getCall(1).args[0].getIn(['problem', 'severity'])).to.equal(5);
    });
  });
});
