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
      const hasInfrastructureAccess = false;
      const store = require('in-infrastructure/perspectives/viewStructureStore');

      it('should return an empty array whilst having no access', () => {
        expect(store.getPermittedIds(match, null, query, hasInfrastructureAccess)).to.be.deep.equal(empty);
        expect(store.getPermittedIds(match, null, '', hasInfrastructureAccess)).to.be.deep.equal(empty);
        expect(store.getPermittedIds(match, empty, query, hasInfrastructureAccess)).to.be.deep.equal(empty);
        expect(store.getPermittedIds(match, empty, '', hasInfrastructureAccess)).to.be.deep.equal(empty);
        expect(store.getPermittedIds(match, scope, query, hasInfrastructureAccess)).to.be.deep.equal(empty);
        expect(store.getPermittedIds(match, scope, '', hasInfrastructureAccess)).to.be.deep.equal(empty);
        expect(store.getPermittedIds(null, scope, '', hasInfrastructureAccess)).to.be.deep.equal(empty);
      });
    });

    describe('with some infrastructure access', () => {
      jest.resetModules();
      const hasInfrastructureAccess = true;
      const store = require('in-infrastructure/perspectives/viewStructureStore');

      it('should return given search matches', () => {
        expect(store.getPermittedIds(match, null, query, hasInfrastructureAccess)).to.equal(match);
        expect(store.getPermittedIds(match, empty, query, hasInfrastructureAccess)).to.equal(match);
      });

      it('should permit everything on empty query - whilst having no limitations', () => {
        expect(store.getPermittedIds(null, null, '', hasInfrastructureAccess)).to.equal(null);
        expect(store.getPermittedIds(empty, null, '', hasInfrastructureAccess)).to.equal(null);
      });

      it('should handle loading situations - where searchMatches are null', () => {
        expect(store.getPermittedIds(null, scope, '', hasInfrastructureAccess)).to.be.deep.equal(scope);
        expect(store.getPermittedIds(null, empty, '', hasInfrastructureAccess)).to.be.deep.equal(empty);
        expect(store.getPermittedIds(null, null, '', hasInfrastructureAccess)).to.be.deep.equal(null);
      });

      it('should permit everything on empty query - whilst having limitations', () => {
        expect(store.getPermittedIds(null, scope, '', hasInfrastructureAccess)).to.equal(scope);
        expect(store.getPermittedIds(empty, scope, '', hasInfrastructureAccess)).to.equal(scope);
        expect(store.getPermittedIds(null, scope, '', hasInfrastructureAccess)).to.equal(scope);
        expect(store.getPermittedIds(empty, scope, '', hasInfrastructureAccess)).to.equal(scope);
      });
    });
  });
});
