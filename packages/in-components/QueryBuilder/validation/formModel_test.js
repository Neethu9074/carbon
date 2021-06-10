/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

/* eslint-env mocha */

import { expect } from 'chai';

import {
  TAG as TAG_TYPE,
  OPEN_BRACKET as OPEN_BRACKET_TYPE,
  CLOSE_BRACKET as CLOSE_BRACKET_TYPE,
  CONJUNCTION as CONJUNCTION_TYPE
} from 'in-components/QueryBuilder/transformation/formModel';
import { OPERATOR_OR, OPERATOR_AND, OPERATOR_NOT } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import { validateFormModel } from 'in-components/QueryBuilder/validation/formModel';

const openBracket = {
  type: OPEN_BRACKET_TYPE
};

const closeBracket = {
  type: CLOSE_BRACKET_TYPE
};

const or = {
  type: CONJUNCTION_TYPE,
  logicalOperator: OPERATOR_OR
};

const and = {
  type: CONJUNCTION_TYPE,
  logicalOperator: OPERATOR_AND
};

const not = {
  type: CONJUNCTION_TYPE,
  logicalOperator: OPERATOR_NOT
};

const validStringTag = {
  type: TAG_TYPE,
  name: 'service.name',
  value: 'shop',
  operator: 'EQUALS',
  entity: 'DESTINATION'
};

const validNumberTag = {
  type: TAG_TYPE,
  name: 'call.latency',
  value: 42,
  operator: 'GREATER_OR_EQUAL_THAN'
};

const validBooleanTag = {
  type: TAG_TYPE,
  name: 'call.erroneous',
  value: true,
  operator: 'EQUALS'
};

describe('in-components/QueryBuilder/validation/formModel#validateFormModel', () => {
  let tagCatalog;

  beforeEach(() => {
    tagCatalog = {
      tags: [
        {
          name: 'service.name',
          type: 'STRING',
          category: 'APPLICATION',
          canApplyToSource: true,
          canApplyToDestination: true
        },
        {
          name: 'call.latency',
          type: 'NUMBER',
          category: 'APPLICATION',
          canApplyToSource: false,
          canApplyToDestination: false
        },
        {
          name: 'call.erroneous',
          type: 'BOOLEAN',
          category: 'APPLICATION'
        }
      ]
    };
  });

  it('must classify an empty form model as valid', () => {
    checkValidationResult([], true);
  });

  describe('tags', () => {
    it('must classify a form model with a single tag as valid', () => {
      checkValidationResult([validStringTag], true);
    });

    it('must classify a form model with a single tag as invalid when the tag is unknown', () => {
      checkValidationResult(
        [
          {
            ...validStringTag,
            name: 'this.is.unknown'
          }
        ],
        false
      );
    });
  });

  describe('brackets', () => {
    it('must classify a form model with a single tag in brackets as valid', () => {
      checkValidationResult([openBracket, validStringTag, closeBracket], true);
    });

    it('must classify a form model with two immedately nested brackets as valid', () => {
      checkValidationResult([openBracket, openBracket, validStringTag, closeBracket, closeBracket], true);
    });

    it('must classify a form model with a missing open bracket as invalid', () => {
      checkValidationResult([validStringTag, closeBracket], false);
    });

    it('must classify a form model with two many closing brackets as invalid', () => {
      checkValidationResult([openBracket, validStringTag, closeBracket, closeBracket], false);
    });

    it('must classify a form model with a missing closing bracket as invalid', () => {
      checkValidationResult([openBracket, validStringTag], false);
    });
  });

  describe('conjunctions', () => {
    it('must allow conjunctions', () => {
      checkValidationResult([validStringTag, and, validNumberTag, or, validBooleanTag], true);
    });

    it('must fail on unknown conjunctions', () => {
      checkValidationResult(
        [
          validStringTag,
          {
            ...and,
            logicalOperator: 'unknown'
          },
          validNumberTag,
          or,
          validBooleanTag
        ],
        false
      );
    });

    it('wrong at start of query', () => {
      checkValidationResult([and, validNumberTag, or, validBooleanTag], false);
    });

    it('wrong at end of query', () => {
      checkValidationResult([validBooleanTag, and, validNumberTag, or], false);
    });

    it('wrong before open bracket', () => {
      checkValidationResult([validBooleanTag, openBracket, validNumberTag, closeBracket], false);
    });

    it('wrong after open bracket', () => {
      checkValidationResult([validBooleanTag, and, openBracket, or, validNumberTag, closeBracket], false);
    });

    it('wrong before close bracket', () => {
      checkValidationResult([validBooleanTag, or, openBracket, validNumberTag, and, closeBracket], false);
    });

    it('wrong after close bracket', () => {
      checkValidationResult([validBooleanTag, or, openBracket, validNumberTag, closeBracket, validStringTag], false);
    });

    describe('not', () => {
      it('must allow "not" before tags', () => {
        checkValidationResult([not, validNumberTag], true);
      });

      it('must not allow two successive "not" before tags', () => {
        checkValidationResult([not, not, validNumberTag], false);
      });

      it('must not allow alternating not and not or', () => {
        checkValidationResult([not, and, not, validNumberTag], false);
      });

      it('must allow "not" after "or"', () => {
        checkValidationResult([not, validNumberTag, or, not, validNumberTag], true);
      });

      it('must allow "not" before brackets', () => {
        checkValidationResult([not, validNumberTag, or, not, openBracket, validNumberTag, closeBracket], true);
      });

      it('must allow "not" immediately inside brackets', () => {
        checkValidationResult([not, validNumberTag, or, openBracket, not, validNumberTag, closeBracket], true);
      });

      it('must not allow "not" at end of query', () => {
        checkValidationResult([validNumberTag, not], false);
      });

      it('must not allow "not" at before closing bracket', () => {
        checkValidationResult([openBracket, validNumberTag, not, closeBracket], false);
      });
    });
  });

  function checkValidationResult(formModel, validExpected) {
    expect(
      validateFormModel({
        tagCatalog,
        formModel
      }).isValid
    ).to.equal(validExpected);
  }
});
