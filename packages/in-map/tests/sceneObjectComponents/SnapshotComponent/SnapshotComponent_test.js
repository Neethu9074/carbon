/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

/* eslint-env jest, node */
import { create } from '@instana/observables';
import { fromJS } from 'immutable';
import { expect } from 'chai';
import sinon from 'sinon';
import { getSnapshot } from 'in-stores/snapshot';

import { createSceneObject } from 'in-map/tests/sceneObjectComponents/helper';
import SnapshotComponent from 'in-map/sceneObjectComponents/SnapshotComponent';

jest.mock('in-stores/snapshot');

describe('in-map', () => {
  describe('sceneObjectComponents/SnapshotComponent', () => {
    let snapshotChanged;
    let getSnapshot$;
    let sceneObject;
    let component;

    beforeEach(() => {
      snapshotChanged = sinon.stub();
      sceneObject = createSceneObject('id1');
      sceneObject.eventEmitter.on('snapshotChanged').subscribe(snapshotChanged);

      getSnapshot$ = create();
      getSnapshot.mockReturnValue(getSnapshot$);

      component = new SnapshotComponent(sceneObject);
      component.initEvents();
    });

    afterEach(() => {
      component.disposeEvents();
      component.dispose();
      sceneObject.dispose();
    });

    it('should not call snapshotChanged on constructor time', () => {
      expect(snapshotChanged).to.have.callCount(0);
    });

    it('should redirect snapshots to client', () => {
      getSnapshot$.emit(fromJS({ id: 'id1', payload: 'custom stuff' }));
      expect(snapshotChanged).to.have.callCount(1);
      expect(snapshotChanged.getCall(0).args[0].get('id')).to.equal('id1');
      expect(snapshotChanged.getCall(0).args[0].get('payload')).to.equal('custom stuff');

      getSnapshot$.emit(fromJS({ id: 'id1', payload: 'custom stuff' }));
      expect(snapshotChanged).to.have.callCount(2);
    });
  });
});
