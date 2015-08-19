/*eslint-env mocha, node*/
import {expect} from 'chai';

import {getColor} from './zones';

describe('zones', () => {

  describe('getColor', () => {

    beforeEach(() => {
      const storage = {};
      const localStorage = {
        setItem: function(k, v) {
          storage[k] = v + '';
        },
        getItem: function(k) {
          return storage[k];
        }
      };
      global.window = {localStorage};
    });

    it('should return colors', () => {
      expect(getColor('eu-central')).to.match(/#[a-z0-9]{6}/i);
    });

    it('should return the same color when called with the same zone', () => {
      expect(getColor('eu-central')).to.equal(getColor('eu-central'));
    });

    it('should provide alternative colors for alternative zones', () => {
      expect(getColor('eu-central')).not.to.equal(getColor('us-west'));
    });

  });

});
