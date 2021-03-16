/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

/* eslint-env mocha */

import { expect } from 'chai';

import tagCatalog from 'in-new-components/GroupingConfigurator/exampleTagCatalog';
import { isValid } from 'in-new-components/GroupingConfigurator/validation';

describe('in-new-components/GroupingConfigurator/validation#isValid', () => {
  it('empty group must be valid', () => {
    checkValidationResult({}, true);
  });

  describe('when canApplyToSource and canApplyToDestination are true', () => {
    it('groupbyTagEntity can be DESTINATION', () => {
      checkValidationResult(
        {
          groupbyTag: 'entity.kubernetes.namespace',
          groupbyTagEntity: 'DESTINATION'
        },
        true
      );
    });

    it('groupbyTagEntity can be SOURCE', () => {
      checkValidationResult(
        {
          groupbyTag: 'entity.kubernetes.namespace',
          groupbyTagEntity: 'SOURCE'
        },
        true
      );
    });

    it('groupbyTagEntity cannot be missing', () => {
      checkValidationResult(
        {
          groupbyTag: 'entity.kubernetes.namespace'
        },
        false
      );
    });

    it('groupbyTagEntity cannot be empty', () => {
      checkValidationResult(
        {
          groupbyTag: 'entity.kubernetes.namespace',
          groupbyTagEntity: ''
        },
        false
      );
    });

    it('groupbyTagEntity cannot be null', () => {
      checkValidationResult(
        {
          groupbyTag: 'entity.kubernetes.namespace',
          groupbyTagEntity: null
        },
        false
      );
    });

    it('groupbyTagEntity cannot anything else than SOURCE or DESTINATION', () => {
      checkValidationResult(
        {
          groupbyTag: 'entity.kubernetes.namespace',
          groupbyTagEntity: 'RANDOM'
        },
        false
      );
    });
  });

  describe('when canApplyToSource and canApplyToDestination are false', () => {
    it('must not contain groupbyTagEntity', () => {
      checkValidationResult(
        {
          groupbyTag: 'entity.selfType'
        },
        true
      );
    });

    it('groupbyTagEntity cannot be set', () => {
      checkValidationResult(
        {
          groupbyTag: 'entity.selfType',
          groupbyTagEntity: 'DESTINATION'
        },
        false
      );
    });
  });

  describe('when tag has type KEY_VALUE_PAIR', () => {
    it('must contain a key', () => {
      checkValidationResult(
        {
          groupbyTag: 'entity.kubernetes.cluster.label',
          groupbyTagEntity: 'DESTINATION',
          groupbyTagSecondLevelKey: 'test'
        },
        true
      );
    });

    it('key cannot be missing', () => {
      checkValidationResult(
        {
          groupbyTag: 'entity.kubernetes.cluster.label'
        },
        false
      );
    });

    it('key cannot be empty', () => {
      checkValidationResult(
        {
          groupbyTag: 'entity.kubernetes.cluster.label',
          groupbyTagSecondLevelKey: ''
        },
        false
      );
    });

    it('key cannot be null', () => {
      checkValidationResult(
        {
          groupbyTag: 'entity.kubernetes.cluster.label',
          groupbyTagSecondLevelKey: null
        },
        false
      );
    });
  });

  function checkValidationResult(group, validExpected) {
    expect(isValid(group, tagCatalog)).to.equal(validExpected);
  }
});
