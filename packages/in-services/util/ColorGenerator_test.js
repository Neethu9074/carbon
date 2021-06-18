/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

/* eslint-env mocha */
import { expect } from 'chai';

import ColorGenerator from 'in-services/util/ColorGenerator';

describe('util.ColorGenerator', () => {
  it('should return only 2 colors', () => {
    const c = new ColorGenerator(2);

    const color1 = c.getNextColor();
    const color2 = c.getNextColor();
    const color3 = c.getNextColor();

    expect(color1.h).to.equal(color3.h);
    expect(color1.s).to.equal(color3.s);
    expect(color1.l).to.equal(color3.l);

    expect(color1.h).not.to.equal(color2.h);
    expect(color1.s).not.to.equal(color2.s);
    expect(color1.l).not.to.equal(color2.l);
  });

  it('should return 4 colors', () => {
    const c = new ColorGenerator(4);

    const color1 = c.getNextColor();
    const color2 = c.getNextColor();
    const color3 = c.getNextColor();
    const color4 = c.getNextColor();

    expect(color1.h).not.to.equal(color3.h);
    expect(color1.s).not.to.equal(color3.s);
    expect(color1.l).not.to.equal(color3.l);

    expect(color1.h).not.to.equal(color2.h);
    expect(color1.s).not.to.equal(color2.s);
    expect(color1.l).not.to.equal(color2.l);

    expect(color1.h).not.to.equal(color4.h);
    expect(color1.s).not.to.equal(color4.s);
    expect(color1.l).not.to.equal(color4.l);
  });
});
