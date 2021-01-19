/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
/* eslint-env mocha, node */
import { create } from '@instana/observables';
import proxyquire from 'proxyquire';
import { expect } from 'chai';
import sinon from 'sinon';

import { createSceneObject } from 'in-map/tests/sceneObjectComponents/helper';

describe('in-map', () => {
  describe('sceneObjectComponents/HighlightingComponent', () => {
    let component;
    let component2;
    let sceneObject;
    let sceneObject2;
    let isHighlighted;
    let isHighlighted2;
    let highlightedEntityId;
    let highlightedEntityIds;

    beforeEach(() => {
      highlightedEntityId = create();
      highlightedEntityIds = create();

      sceneObject = createSceneObject('id1');
      sceneObject2 = createSceneObject('id2');

      isHighlighted = sinon.stub();
      isHighlighted2 = sinon.stub();
      sceneObject.eventEmitter.on('isHighlighted').subscribe(isHighlighted);
      sceneObject2.eventEmitter.on('isHighlighted').subscribe(isHighlighted2);

      const Component = proxyquire('in-map/sceneObjectComponents/HighlightingComponent/HighlightingComponent', {
        'in-services/stores/highlightedEntityId': {
          highlightedEntityId$: highlightedEntityId
        },
        'in-map/stores/selectedMapSceneObjectStore': {
          selectedSnapshotIdForHighlightingInMap$: create().startWith(null)
        },
        'in-stores/highlightedEntityIds': {
          highlightedEntityIds$: highlightedEntityIds
        }
      }).default;

      component = new Component(sceneObject);
      component.initEvents();

      component2 = new Component(sceneObject2);
      component2.initEvents();
    });

    afterEach(() => {
      component.disposeEvents();
      component.dispose();
      sceneObject.dispose();

      component2.disposeEvents();
      component2.dispose();
      sceneObject2.dispose();
    });

    it('should only call highlighted entities highlighting event', () => {
      highlightedEntityId.emit('id2');
      highlightedEntityIds.emit([]);

      expect(isHighlighted).to.have.callCount(1);
      expect(isHighlighted2).to.have.callCount(1);

      expect(isHighlighted.getCall(0).args[0]).to.equal(false);
      expect(isHighlighted2.getCall(0).args[0]).to.equal(true);
    });

    it('should also highlight if the entity is inside highlightedEntityIds', () => {
      highlightedEntityId.emit('id3');
      highlightedEntityIds.emit(['id4', 'id2']);

      expect(isHighlighted).to.have.callCount(1);
      expect(isHighlighted2).to.have.callCount(1);

      expect(isHighlighted.getCall(0).args[0]).to.equal(false);
      expect(isHighlighted2.getCall(0).args[0]).to.equal(true);
    });
  });
});
