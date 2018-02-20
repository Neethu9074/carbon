/* eslint-env mocha,node */
import { expect } from 'chai';

import { rebuildUrlAndAppend, rebuildUrlAndReplace } from './rebuildUrl';

describe('rebuild url', () => {
  describe('and replace', () => {
    const location = {
      pathname: '/service/performance/database/statements/bf516474-0250-48d8-87cf-1f8b30eb5d26',
      query: {
        'timeline.to': '',
        'timeline.ws': '600000'
      },
      matrix: {
        '/service': {
          serviceId: 'productdb'
        },
        '/performance': {},
        '/database': {},
        '/statements': {},
        '/bf516474-0250-48d8-87cf-1f8b30eb5d26': {}
      }
    };

    it('should remove segments from path', () => {
      expect(rebuildUrlAndReplace(location, path => path.replace(/\/database\/statements\/.*/, ''))).to.equal(
        '#/service;serviceId=productdb/performance?timeline.to=&timeline.ws=600000'
      );
    });
  });

  describe('and append', () => {
    const location = {
      pathname: '/service/performance',
      query: {
        'timeline.to': '',
        'timeline.ws': '600000'
      },
      matrix: {
        '/service': {
          serviceId: 'productdb'
        },
        '/performance': {}
      }
    };

    const item = { id: 'bf516474-0250-48d8-87cf-1f8b30eb5d26' };

    it('should append segment to path', () => {
      expect(rebuildUrlAndAppend(location, `database/statements/${item.id}`)).to.equal(
        '#/service;serviceId=productdb/performance/database/statements/bf516474-0250-48d8-87cf-1f8b30eb5d26?timeline.to=&timeline.ws=600000'
      );
    });
  });
});
