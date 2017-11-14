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

  describe('extract matrix', () => {
    it('must return an empty object if there are no pathes defined', () => {
      let matrix = mod.extractMatrix();
      expect(matrix).to.deep.equal({});

      matrix = mod.extractMatrix('');
      expect(matrix).to.deep.equal({});

      matrix = mod.extractMatrix(';');
      expect(matrix).to.deep.equal({});
    });

    it('must ingore path before ;', () => {
      let matrix = mod.extractMatrix('/');
      expect(matrix).to.deep.equal({});

      matrix = mod.extractMatrix('foobar');
      expect(matrix).to.deep.equal({});

      matrix = mod.extractMatrix('/events');
      expect(matrix).to.deep.equal({});

      matrix = mod.extractMatrix('/events/abc');
      expect(matrix).to.deep.equal({});

      matrix = mod.extractMatrix('/events/abc;');
      expect(matrix).to.deep.equal({});
    });

    it('must split the sub kvs', () => {
      let matrix = mod.extractMatrix('/events;a=b');
      expect(matrix).to.deep.equal({ a: 'b' });

      matrix = mod.extractMatrix('/events;a=b;c=d;foo=bar');
      expect(matrix).to.deep.equal({ a: 'b', c: 'd', foo: 'bar' });
    });

    it('must ingore incomplete kvs', () => {
      let matrix = mod.extractMatrix('/events;a=b;cd;=;;c=d;;');
      expect(matrix).to.deep.equal({ a: 'b', c: 'd' });
    });
  });
});
