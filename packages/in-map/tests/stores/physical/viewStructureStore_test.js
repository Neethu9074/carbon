/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

/* eslint-env jest ,node */
import { expect } from 'chai';

describe('viewStructureStore', () => {
  describe('getPermittedIds', () => {
    let match = ['snapshotId1', 'snapshotId2', 'snapshotId3'];
    let scope = ['snapshotId1', 'snapshotId2', 'snapshotId4'];
    let empty = [];
    let query = 'entity.host.name:*';

    describe('with RBAC enabled and limited access', () => {
      jest.resetModules();
      jest.doMock('in-stores/permission', () => ({
        __esModule: true,
        hasRestrictedAccess: true
      }));
      const store = require('in-map/stores/physical/viewStructureStore');

      it('should return given search matches on query', () => {
        expect(store.getPermittedIds(match, null, query)).to.equal(match);
        expect(store.getPermittedIds(match, null, '')).to.equal(match);
        expect(store.getPermittedIds(match, empty, query)).to.equal(match);
        expect(store.getPermittedIds(match, scope, query)).to.equal(match);
      });

      it('should return limited scope if not queried', () => {
        expect(store.getPermittedIds(null, scope, '')).to.equal(scope);
        expect(store.getPermittedIds(empty, scope, '')).to.equal(scope);
      });

      it('should permit nothing on empty query result', () => {
        expect(store.getPermittedIds(null, empty, '')).to.deep.equal(empty);
        expect(store.getPermittedIds(empty, empty, '')).to.deep.equal(empty);
        expect(store.getPermittedIds(null, null, '')).to.deep.equal(empty);
        expect(store.getPermittedIds(empty, null, '')).to.deep.equal(empty);
        expect(store.getPermittedIds(null, empty, query)).to.deep.equal(empty);
        expect(store.getPermittedIds(empty, empty, query)).to.deep.equal(empty);
        expect(store.getPermittedIds(null, null, query)).to.deep.equal(empty);
        expect(store.getPermittedIds(empty, null, query)).to.deep.equal(empty);
        expect(store.getPermittedIds(null, scope, query)).to.deep.equal(empty);
        expect(store.getPermittedIds(empty, scope, query)).to.deep.equal(empty);
      });
    });

    describe('with RBAC disabled or full access', () => {
      jest.resetModules();
      jest.doMock('in-stores/permission', () => ({
        __esModule: true,
        hasRestrictedAccess: false
      }));
      const store = require('in-map/stores/physical/viewStructureStore');

      it('should return given search matches', () => {
        expect(store.getPermittedIds(match, null, '')).to.equal(match);
        expect(store.getPermittedIds(match, empty, '')).to.equal(match);
        expect(store.getPermittedIds(match, null, query)).to.equal(match);
        expect(store.getPermittedIds(match, empty, query)).to.equal(match);
      });

      it('should permit everything on empty query', () => {
        expect(store.getPermittedIds(null, empty, '')).to.equal(null);
        expect(store.getPermittedIds(empty, empty, '')).to.equal(null);
        expect(store.getPermittedIds(null, null, '')).to.equal(null);
        expect(store.getPermittedIds(empty, null, '')).to.equal(null);
      });

      it('should permit nothing on query with no results', () => {
        expect(store.getPermittedIds(null, empty, query)).to.deep.equal(empty);
        expect(store.getPermittedIds(empty, empty, query)).to.deep.equal(empty);
        expect(store.getPermittedIds(null, null, query)).to.deep.equal(empty);
        expect(store.getPermittedIds(empty, null, query)).to.deep.equal(empty);
      });
    });
  });
});
