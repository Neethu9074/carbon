/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

/* eslint-env jest, node */
import { create } from '@instana/observables';
import { fromJS } from 'immutable';
import { expect } from 'chai';
import sinon from 'sinon';
import { getHealthInfoAtFocusedMoment } from 'in-stores/events';

import { createSceneObject } from 'in-map/tests/sceneObjectComponents/helper';
import HealthComponent from 'in-map/sceneObjectComponents/HealthComponent';

jest.mock('in-stores/events');

describe('in-map', () => {
  describe('sceneObjectComponents/HealthComponent', () => {
    let component;
    let sceneObject;
    let healthChanged;

    beforeEach(() => {
      healthChanged = sinon.stub();
      sceneObject = createSceneObject();
      sceneObject.eventEmitter.on('healthChanged').subscribe(healthChanged);

      getHealthInfoAtFocusedMoment.mockReturnValue(
        create().startWith(
          fromJS({
            problem: {
              severity: 5
            }
          })
        )
      );

      component = new HealthComponent(sceneObject);
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
