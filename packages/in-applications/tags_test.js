/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

/* eslint-env mocha, node */
import { expect } from 'chai';

import { findSubTreeByFullyQualifiedName, getMultipleTagFromList, getTagFromList } from 'in-applications/tags';

describe('in-applications/tags', () => {
  describe('tag tree', () => {
    beforeEach(() => {
      window.instana = {
        tags: [
          { name: 'a.b.c' },
          { name: 'a.b.c.d' },
          { name: 'a.b' },
          { name: 'a.b.d' },
          { name: 'b' },
          { name: 'b.c.d' },
          { name: 'x.c.d' },
          { name: 'x.y.z' },
          { name: 'z.a.c' },
          { name: 'z.a.b' },
          { name: 'this.is.a.unique.path' }
        ]
      };
    });

    it('should find tree node by given fully qualified name', () => {
      expect(findSubTreeByFullyQualifiedName('a')).to.equal(undefined);

      let match = findSubTreeByFullyQualifiedName('a.b');
      expect(match).to.not.equal(null);
      expect(match.fullyQualifiedName).to.equal('a.b');

      match = findSubTreeByFullyQualifiedName('a.b.c.d');
      expect(match).to.not.equal(null);
      expect(match.fullyQualifiedName).to.equal('a.b.c.d');
    });

    it('should find tree node by given fully qualified name (findSubTreeByFullyQualifiedName)', () => {
      expect(findSubTreeByFullyQualifiedName('foo.bar')).to.equal(undefined);
      expect(findSubTreeByFullyQualifiedName('a.b.c').name).to.equal('a.b.c');
      expect(findSubTreeByFullyQualifiedName('a.b').name).to.equal('a.b');
      expect(findSubTreeByFullyQualifiedName('a.b.d').name).to.equal('a.b.d');
      expect(findSubTreeByFullyQualifiedName('b').name).to.equal('b');
      expect(findSubTreeByFullyQualifiedName('b.c.d').name).to.equal('b.c.d');
    });
  });

  describe('getTagFromList', () => {
    const list = [
      { name: 'name1', value: 'value1', operator: 'operator1' },
      { name: 'name2', value: 'value2', operator: 'operator2' },
      { name: 'name3', value: 'value3', operator: 'operator3' },
      { name: 'name4', value: 'value4', operator: 'operator4' }
    ];

    it('should find tag based on name', () => {
      expect(getTagFromList(list, { name: 'a' })).to.equal(null);
      expect(getTagFromList(list, { name: 'name1' })).to.not.equal(null);
      expect(getTagFromList(list, { name: 'name2' })).to.not.equal(null);
      expect(getTagFromList(list, { name: 'name3' })).to.not.equal(null);
      expect(getTagFromList(list, { name: 'name4' })).to.not.equal(null);
    });

    it('should find tag based on value', () => {
      expect(getTagFromList(list, { value: 'a' })).to.equal(null);
      expect(getTagFromList(list, { value: 'value1' })).to.not.equal(null);
      expect(getTagFromList(list, { value: 'value2' })).to.not.equal(null);
      expect(getTagFromList(list, { value: 'value3' })).to.not.equal(null);
      expect(getTagFromList(list, { value: 'value4' })).to.not.equal(null);
    });

    it('should find tag based on operator', () => {
      expect(getTagFromList(list, { operator: 'a' })).to.equal(null);
      expect(getTagFromList(list, { operator: 'operator1' })).to.not.equal(null);
      expect(getTagFromList(list, { operator: 'operator2' })).to.not.equal(null);
      expect(getTagFromList(list, { operator: 'operator3' })).to.not.equal(null);
      expect(getTagFromList(list, { operator: 'operator4' })).to.not.equal(null);
    });

    it('should find tag based on name, value annd operator', () => {
      expect(getTagFromList(list, { name: 'name1', value: 'value1', operator: 'unknown' })).to.equal(null);
      expect(getTagFromList(list, { name: 'name1', value: 'unknown', operator: 'operator1' })).to.equal(null);
      expect(getTagFromList(list, { name: 'unknown', value: 'value1', operator: 'operator1' })).to.equal(null);
      expect(getTagFromList(list, { name: 'name1', value: 'value1', operator: 'operator1' })).to.not.equal(null);
    });
  });

  describe('getMultipleTagFromList', () => {
    const list = [
      { name: 'name1', value: 'value1', operator: 'operator1' },
      { name: 'name1', value: 'value1', operator: 'operator2' },
      { name: 'name2', value: 'value3', operator: 'operator3' },
      { name: 'name1', value: 'value4', operator: 'operator2' }
    ];

    it('should find tag based on name', () => {
      expect(getMultipleTagFromList(list, { name: 'a' })).to.have.length(0);
      expect(getMultipleTagFromList(list, { name: 'name1' })).to.have.length(3);
      expect(getMultipleTagFromList(list, { name: 'name2' })).to.have.length(1);
      expect(getMultipleTagFromList(list, { name: 'name3' })).to.have.length(0);

      expect(getMultipleTagFromList(list, { name: 'name1', value: 'value1' })).to.have.length(2);
      expect(getMultipleTagFromList(list, { name: 'name1', operator: 'operator1' })).to.have.length(1);
      expect(getMultipleTagFromList(list, { name: 'name1', operator: 'operator2' })).to.have.length(2);

      expect(getMultipleTagFromList(list, { operator: 'operator2' })).to.have.length(2);

      expect(getMultipleTagFromList(list, { value: 'value1' })).to.have.length(2);
      expect(getMultipleTagFromList(list, { value: 'value3' })).to.have.length(1);
      expect(getMultipleTagFromList(list, { value: 'value2' })).to.have.length(0);
    });
  });
});
