/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

/* eslint-env node */

import { expect } from 'chai';

describe('viewStructureStore', () => {
  describe('getPermittedIds', () => {
    const match = ['snapshotId1', 'snapshotId2', 'snapshotId3'];
    const scope = ['snapshotId1', 'snapshotId2', 'snapshotId4'];
    const empty = [];
    const query = 'entity.host.name:*';

    describe('with no infrastructure at all', () => {
      jest.resetModules();
      jest.doMock('in-stores/permission', () => ({
        __esModule: true,
        hasInfrastructureAccess: false
      }));
      const store = require('in-infrastructure/perspectives/viewStructureStore');

      it('should return an empty array whilst having no access', () => {
        expect(store.getPermittedIds(match, null, query)).to.be.deep.equal(empty);
        expect(store.getPermittedIds(match, null, '')).to.be.deep.equal(empty);
        expect(store.getPermittedIds(match, empty, query)).to.be.deep.equal(empty);
        expect(store.getPermittedIds(match, empty, '')).to.be.deep.equal(empty);
        expect(store.getPermittedIds(match, scope, query)).to.be.deep.equal(empty);
        expect(store.getPermittedIds(match, scope, '')).to.be.deep.equal(empty);
      });
    });

    describe('with some infrastructure access', () => {
      jest.resetModules();
      jest.doMock('in-stores/permission', () => ({
        __esModule: true,
        hasInfrastructureAccess: true
      }));
      const store = require('in-infrastructure/perspectives/viewStructureStore');

      it('should return given search matches', () => {
        expect(store.getPermittedIds(match, null, query)).to.equal(match);
        expect(store.getPermittedIds(match, empty, query)).to.equal(match);
      });

      it('should permit everything on empty query - whilst having no limitations', () => {
        expect(store.getPermittedIds(null, null, '')).to.equal(null);
        expect(store.getPermittedIds(empty, null, '')).to.equal(null);
      });

      it('should permit everything on empty query - whilst having limitations', () => {
        expect(store.getPermittedIds(null, scope, '')).to.equal(scope);
        expect(store.getPermittedIds(empty, scope, '')).to.equal(scope);
        expect(store.getPermittedIds(null, scope, '')).to.equal(scope);
        expect(store.getPermittedIds(empty, scope, '')).to.equal(scope);
      });
    });
  });
});
