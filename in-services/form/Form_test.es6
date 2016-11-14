/* eslint-env mocha */

import {expect} from 'chai';

import Form from 'in-services/form/Form';

describe('in-services/form/Form', () => {
  let form;

  beforeEach(() => {
    form = new Form();
  });

  it('must have no fields initially', () => {
    expect(form.toJs()).to.deep.equal({});
  });

  it('must be valid initially', () => {
    expect(form.isValid()).to.equal(true);
  });

  it('must be pristine initially', () => {
    expect(form.isPristine()).to.equal(true);
  });
});
