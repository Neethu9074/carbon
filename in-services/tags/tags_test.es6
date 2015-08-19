/*eslint-env mocha, node*/
import {expect} from 'chai';

import {getColor} from './tags';

describe('tags', () => {

  it('should return random color', () => {
    expect(getColor({})).to.match(/#[a-z0-9]{3}/i);
    expect(getColor({})).to.match(/#[a-z0-9]{3}/i);
    expect(getColor({})).to.match(/#[a-z0-9]{3}/i);
    expect(getColor({})).to.match(/#[a-z0-9]{3}/i);
  });
});
