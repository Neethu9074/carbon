/* eslint-env mocha */
import { expect } from 'chai';

import { parseUrl } from 'in-stores/navigation/routing/parser';

describe('in-stores/navigation/routing/parser', () => {
  describe('parseUrl', () => {
    it('must extract root URL', () => {
      expect(parseUrl('/')).to.deep.equal({
        pathname: '/',
        query: {},
        matrix: { '/': {} }
      });
    });

    it('must extract URL without params', () => {
      expect(parseUrl('/foo')).to.deep.equal({
        pathname: '/foo',
        query: {},
        matrix: { '/foo': {} }
      });
    });

    it('must extract query parameters', () => {
      expect(parseUrl('/foo?a=b')).to.deep.equal({
        pathname: '/foo',
        query: {
          a: 'b'
        },
        matrix: { '/foo': {} }
      });
    });

    it('must extract query parameters without values', () => {
      expect(parseUrl('/foo?a')).to.deep.equal({
        pathname: '/foo',
        query: {
          a: ''
        },
        matrix: { '/foo': {} }
      });
    });

    it('must extract multiple query parameters', () => {
      expect(parseUrl('/foo?a&b=c')).to.deep.equal({
        pathname: '/foo',
        query: {
          a: '',
          b: 'c'
        },
        matrix: { '/foo': {} }
      });
    });

    it('must decode query parameters', () => {
      expect(parseUrl('/foo?b=c%2Fd')).to.deep.equal({
        pathname: '/foo',
        query: {
          b: 'c/d'
        },
        matrix: { '/foo': {} }
      });
    });

    it('must remove trailing ?', () => {
      expect(parseUrl('/foo?')).to.deep.equal({
        pathname: '/foo',
        query: {},
        matrix: { '/foo': {} }
      });
    });

    it('must support matrix parameters', () => {
      expect(parseUrl('/foo;k=v')).to.deep.equal({
        pathname: '/foo',
        query: {},
        matrix: {
          '/foo': {
            k: 'v'
          }
        }
      });
    });

    it('must support matrix parameters for sub paths', () => {
      expect(parseUrl('/first/second;k=v/third')).to.deep.equal({
        pathname: '/first/second/third',
        query: {},
        matrix: {
          '/first': {},
          '/second': {
            k: 'v'
          },
          '/third': {}
        }
      });
    });

    it('must support matrix parameters with query parameters', () => {
      expect(parseUrl('/first;a=b/second;k=v/third?foo=bar')).to.deep.equal({
        pathname: '/first/second/third',
        query: {
          foo: 'bar'
        },
        matrix: {
          '/first': {
            a: 'b'
          },
          '/second': {
            k: 'v'
          },
          '/third': {}
        }
      });
    });

    it('must support table use case', () => {
      expect(parseUrl('/table;view=physical;plugin=host?timeline.to&timeline.ws=600000')).to.deep.equal({
        pathname: '/table',
        query: {
          'timeline.to': '',
          'timeline.ws': '600000'
        },
        matrix: {
          '/table': {
            view: 'physical',
            plugin: 'host'
          }
        }
      });
    });
  });
});
