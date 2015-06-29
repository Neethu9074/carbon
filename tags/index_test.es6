/*eslint-env mocha, node*/

'use strict';

import {expect} from 'chai';
import {getColor} from './index';

describe('tags', () => {

  it('should return random color', () => {
    expect(getColor({})).to.match(/#[a-z0-9]{6}/i);
    expect(getColor({})).to.match(/#[a-z0-9]{6}/i);
    expect(getColor({})).to.match(/#[a-z0-9]{6}/i);
    expect(getColor({})).to.match(/#[a-z0-9]{6}/i);
  });
});
