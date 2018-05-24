/* eslint-env mocha, node */
import { expect } from 'chai';

import { enrichWithLabel } from 'in-api/serviceConfiguration';

describe('in-api/serviceConfiguration', () => {
  describe('enrichWithLabel', () => {
    it('should concatinate all matching rule keys to a label with {}-', () => {
      let config = {
        id: 1,
        label: '',
        matchSpecification: []
      };
      let mappedResult = enrichWithLabel(config);
      expect(config.id).to.equal(mappedResult.id);
      expect(config.label).to.equal('');
      expect(config.matchSpecification).to.equal(mappedResult.matchSpecification);

      config = {
        id: 1,
        label: '',
        matchSpecification: [
          {
            key: 'foo',
            value: 'bar'
          }
        ]
      };
      mappedResult = enrichWithLabel(config);
      expect(config.id).to.equal(mappedResult.id);
      expect(config.label).to.equal('{foo}');
      expect(config.matchSpecification).to.equal(mappedResult.matchSpecification);

      config = {
        id: 1,
        label: '',
        matchSpecification: [
          {
            key: 'host.zone',
            value: 'foobar'
          },
          {
            key: 'foo',
            value: 'bar'
          }
        ]
      };
      mappedResult = enrichWithLabel(config);
      expect(config.id).to.equal(mappedResult.id);
      expect(config.label).to.equal('{host.zone}-{foo}');
      expect(config.matchSpecification).to.equal(mappedResult.matchSpecification);
    });
  });
});
