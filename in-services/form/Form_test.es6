/* eslint-env mocha */

import {expect} from 'chai';

import MapForm from 'in-services/form/MapForm';

describe('in-services/form/MapForm', () => {
  let form;

  beforeEach(() => {
    form = new MapForm();
  });


  it('must have no fields initially', () => {
    expect(form.toJS()).to.deep.equal({});
  });


  it('must be valid initially', () => {
    expect(form.valid).to.equal(true);
  });


  it('must be pristine initially', () => {
    expect(form.pristine).to.equal(true);
  });


  it('must add new fields by keeping the existing form unchanged', () => {
    const newForm = form.addField('vocation', 'Blacksmith');

    expect(newForm).not.to.equal(form);
    expect(() => form.getItem('vocation')).to.throw(/Cannot find item at path "vocation"/);

    const field = newForm.getItem('vocation');
    expect(field.value).to.equal('Blacksmith');
    expect(field.valid).to.equal(true);
    expect(newForm.valid).to.equal(true);
    expect(field.pristine).to.equal(true);
    expect(newForm.pristine).to.equal(true);
  });


  it('must validate fields', () => {
    const newForm = form.addField('vocation', 'Blacksmith', dirtyValidator);

    const field = newForm.getItem('vocation');
    expect(field.valid).to.equal(false);
    expect(newForm.valid).to.equal(false);
  });


  it('must support field changes and rerun validations', () => {
    const form2 = form.addField('vocation', 'Blacksmith', value => value.indexOf('Black') === 0 ? 'Too dirty' : null);
    const form3 = form2.setValue('vocation', 'Window Cleaner');

    expect(form3).not.to.equal(form2);
    expect(form3).not.to.equal(form);

    const field2 = form2.getItem('vocation');
    expect(field2.valid).to.equal(false);
    expect(form2.valid).to.equal(false);

    const field3 = form3.getItem('vocation');
    expect(field3.valid).to.equal(true);
    expect(form3.valid).to.equal(true);
  });


  it('must support field removals', () => {
    const form2 = form.addField('vocation', 'Blacksmith', value => value.indexOf('Black') === 0 ? 'Too dirty' : null);
    const form3 = form2.removeItem('vocation');

    expect(() => form3.getItem('vocation')).to.throw(/Cannot find item at path "vocation"/);
    expect(form2.getItem('vocation').value).to.equal('Blacksmith');
  });


  it('must not complain about missing paths when removing', () => {
    form.removeItem('vocation');
  });


  describe('nested maps', () => {
    it('must add nested form', () => {
      form = form.addItem('data', new MapForm())
        .addField(['data', 'vocation'], 'Blacksmith');
      expect(form.toJS()).to.deep.equal({
        data: {
          vocation: 'Blacksmith'
        }
      });
    });

    it('must remove whole sub structures', () => {
      form = form
        .addItem('a', new MapForm())
        .addItem('b', new MapForm())
        .addField(['a', 'c'], 'ac')
        .addField(['b', 'd'], 'bd');

      expect(form.toJS()).to.deep.equal({
        a: {
          c: 'ac'
        },
        b: {
          d: 'bd'
        }
      });

      form = form.removeItem(['b', 'd']);

      expect(form.toJS()).to.deep.equal({
        a: {
          c: 'ac'
        },
        b: {}
      });

      form = form.removeItem(['a']);

      expect(form.toJS()).to.deep.equal({
        b: {}
      });
    });
  });


  function dirtyValidator() {
    return value => value.indexOf('Black') === 0 ? 'Too dirty' : null;
  }
});
