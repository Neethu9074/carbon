/* eslint-env mocha,node */
import proxyquire from 'proxyquire';
import { expect } from 'chai';

describe('viewStructureStore', () => {
  describe('getPermittedIds', () => {
    let match = ['snapshotId1', 'snapshotId2', 'snapshotId3'];
    let scope = ['snapshotId1', 'snapshotId2', 'snapshotId4'];
    let empty = [];
    let query = 'entity.host.name:*';

    describe('with RBAC enabled and limited access', () => {
      const store = proxyquire('in-map/stores/physical/viewStructureStore', {
        'in-stores/user': {
          role: { restrictedAccess: true }
        },
        'in-services/featureFlags': {
          isRbacEnabled: true
        }
      });

      it('should return given search matches on query', () => {
        expect(store.getPermittedIds(match, null, query)).to.equal(match); // null scope can not occur in rbac enabled
        expect(store.getPermittedIds(match, null, '')).to.equal(match); // search must be null without query
        expect(store.getPermittedIds(match, empty, query)).to.equal(match);
        expect(store.getPermittedIds(match, scope, query)).to.equal(match);
      });

      it('should return limited scope if not queried', () => {
        expect(store.getPermittedIds(null, scope, '')).to.equal(scope);
        expect(store.getPermittedIds(empty, scope, '')).to.equal(scope); // empty search can not occur without query
      });

      it('should permit nothing on empty query result', () => {
        expect(store.getPermittedIds(null, empty, '')).to.deep.equal(empty);
        expect(store.getPermittedIds(empty, empty, '')).to.deep.equal(empty); // empty search can not occur without query
        expect(store.getPermittedIds(null, null, '')).to.deep.equal(empty); // null scope can occur in rbac enabled
        expect(store.getPermittedIds(empty, null, '')).to.deep.equal(empty); // empty search can not occur without query and null scope can occur in rbac enabled
        expect(store.getPermittedIds(null, empty, query)).to.deep.equal(empty);
        expect(store.getPermittedIds(empty, empty, query)).to.deep.equal(empty);
        expect(store.getPermittedIds(null, null, query)).to.deep.equal(empty); // search can not be null with a query
        expect(store.getPermittedIds(empty, null, query)).to.deep.equal(empty);
      });
    });

    describe('with RBAC disabled or full access', () => {
      const store = proxyquire('in-map/stores/physical/viewStructureStore', {
        'in-stores/user': {
          role: { restrictedAccess: false }
        },
        'in-services/featureFlags': {
          isRbacEnabled: false
        }
      });

      it('should return given search matches', () => {
        expect(store.getPermittedIds(match, null, '')).to.equal(match); // search can only be null without query
        expect(store.getPermittedIds(match, null, query)).to.equal(match);
      });

      it('should permit everything on empty query', () => {
        expect(store.getPermittedIds(null, empty, '')).to.equal(null); // empty scope can not occur without rbac limitation
        expect(store.getPermittedIds(empty, empty, '')).to.equal(null); // search can only be null without query and empty scope can not occur without rbac limitation
        expect(store.getPermittedIds(null, null, '')).to.equal(null);
        expect(store.getPermittedIds(empty, null, '')).to.equal(null); // search can only be null without query
      });

      it('should permit nothing on query with no results', () => {
        expect(store.getPermittedIds(null, empty, query)).to.deep.equal(empty); // empty scope can not occur without rbac limitation
        expect(store.getPermittedIds(empty, empty, query)).to.deep.equal(empty); // empty scope can not occur without rbac limitation
        expect(store.getPermittedIds(null, null, query)).to.deep.equal(empty); // search can not be null with a query
        expect(store.getPermittedIds(empty, null, query)).to.deep.equal(empty);
      });
    });
  });
});
