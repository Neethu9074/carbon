/* eslint-env mocha */
import { resetStoreRegistry } from 'in-stores/store';
import proxyquire from 'proxyquire';
import { expect } from 'chai';

describe('in-services/eum', () => {
  let mod;

  beforeEach(() => {
    mod = proxyquire('in-stores/navigation/navigation', {});
  });

  afterEach(() => {
    resetStoreRegistry();
  });

  describe('sub pathes', () => {
    it('must return an empty array if there are no pathes defined', () => {
      const result = mod.extractSubPathes({ pathname: '' });
      expect(result.path).to.equal('');
      expect(result.params).to.have.length(0);
    });

    it('must return the complete path till @', () => {
      let result = mod.extractSubPathes({ pathname: '' });
      expect(result.path).to.equal('');
      expect(result.params).to.have.length(0);

      result = mod.extractSubPathes({ pathname: '/events' });
      expect(result.path).to.equal('events');
      expect(result.params).to.have.length(0);

      result = mod.extractSubPathes({ pathname: '/events/' });
      expect(result.path).to.equal('events/');
      expect(result.params).to.have.length(0);

      result = mod.extractSubPathes({ pathname: '/this/is/a/longer/path' });
      expect(result.path).to.equal('this/is/a/longer/path');
      expect(result.params).to.have.length(0);

      result = mod.extractSubPathes({ pathname: '/table/@' });
      expect(result.path).to.equal('table/');
      expect(result.params).to.have.length(0);
    });

    it('must split the sub pathes after @', () => {
      let result = mod.extractSubPathes({ pathname: '/@a' });
      expect(result.path).to.equal('');
      expect(result.params).to.deep.equal(['a']);

      result = mod.extractSubPathes({ pathname: '/events/@a' });
      expect(result.path).to.equal('events/');
      expect(result.params).to.deep.equal(['a']);

      result = mod.extractSubPathes({ pathname: '/events/@a,b,c' });
      expect(result.path).to.equal('events/');
      expect(result.params).to.deep.equal(['a', 'b', 'c']);

      result = mod.extractSubPathes({ pathname: '/table/physical@a,b,c' });
      expect(result.path).to.equal('table/physical');
      expect(result.params).to.deep.equal(['a', 'b', 'c']);
    });
  });
});
