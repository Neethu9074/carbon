/* eslint-env mocha, node */
/* eslint-disable no-unused-expressions */
import {expect} from 'chai';

import XYZ from './XYZ';


describe('XYZ', () => {
  let instance;

  beforeEach(() => {
    instance = new XYZ();
  });

  it('should use default values', () => {
    expect(instance.x).to.equal(0);
    expect(instance.y).to.equal(0);
    expect(instance.z).to.equal(0);
  });

  it('should replace non given params with this values', () => {
    instance.set(10, 11, 12);
    expect(instance.x).to.equal(10);
    expect(instance.y).to.equal(11);
    expect(instance.z).to.equal(12);

    instance.set(100);
    expect(instance.x).to.equal(100);
    expect(instance.y).to.equal(11);
    expect(instance.z).to.equal(12);

    instance.set(200, 300);
    expect(instance.x).to.equal(200);
    expect(instance.y).to.equal(300);
    expect(instance.z).to.equal(12);
  });

});
