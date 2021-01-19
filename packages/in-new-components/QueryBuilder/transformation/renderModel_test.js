/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
/* eslint-env mocha */

import { expect } from 'chai';

import {
  toRenderModel,
  addSpacingsAndIncides,
  buildExpressionTrees,
  validate,
  LETTER,
  WORD,
  TAG as RM_TAG,
  CONJUNCTION as RM_CONJUNCTION,
  OPEN_BRACKET as RM_OPEN_BRACKET,
  CLOSE_BRACKET as RM_CLOSE_BRACKET,
  EXPRESSION
} from 'in-new-components/QueryBuilder/transformation/renderModel';
import {
  TAG as FM_TAG,
  CONJUNCTION as FM_CONJUNCTION,
  OPEN_BRACKET as FM_OPEN_BRACKET,
  CLOSE_BRACKET as FM_CLOSE_BRACKET
} from 'in-new-components/QueryBuilder/transformation/formModel';
import { ADD_CLOSING_BRACKET, REMOVE_BRACKET } from 'in-new-components/QueryBuilder/validation/bracket';
import { MISSING_CLOSING_BRACKET } from 'in-new-components/QueryBuilder/validation/expression';
import { REMOVE_CONJUNCTION } from 'in-new-components/QueryBuilder/validation/conjunction';
import { ADD_CONJUNCTION } from 'in-new-components/QueryBuilder/validation/spacing';

describe('in-new-components/QueryBuilder/transformation/renderModel', () => {
  describe('#addSpacingsAndIncides', () => {
    beforeEach(() => {
      resetIndices();
    });

    it('should add no spacings is one or no elements', () => {
      expect(addSpacingsAndIncides([fm_tag()])).to.deep.equal([rm_letter(), rm_tag(), rm_word()]);
    });

    it('should add spacings between each element', () => {
      expect(
        addSpacingsAndIncides([
          fm_tag(),
          fm_openBracket(),
          fm_tag(),
          fm_conjunction(),
          fm_openBracket(),
          fm_closeBracket(),
          fm_conjunction(),
          fm_tag(),
          fm_conjunction(),
          fm_tag(),
          fm_conjunction(),
          fm_tag(),
          fm_closeBracket()
        ])
      ).to.deep.equal([
        rm_letter(),
        rm_tag(),
        rm_word(),
        rm_openBracket(),
        rm_letter(),
        rm_tag(),
        rm_word(),
        rm_conjunction(),
        rm_word(),
        rm_openBracket(),
        rm_letter(),
        rm_closeBracket(),
        rm_word(),
        rm_conjunction(),
        rm_word(),
        rm_tag(),
        rm_word(),
        rm_conjunction(),
        rm_word(),
        rm_tag(),
        rm_word(),
        rm_conjunction(),
        rm_word(),
        rm_tag(),
        rm_letter(),
        rm_closeBracket(),
        rm_word()
      ]);
    });

    it('should add spacings to a broken form model', () => {
      expect(
        addSpacingsAndIncides([
          fm_openBracket(),
          fm_openBracket(),
          fm_openBracket(),
          fm_conjunction(),
          fm_closeBracket(),
          fm_tag(),
          fm_closeBracket()
        ])
      ).to.deep.equal([
        rm_letter(),
        rm_openBracket(),
        rm_letter(),
        rm_openBracket(),
        rm_letter(),
        rm_openBracket(),
        rm_letter(),
        rm_conjunction(),
        rm_letter(),
        rm_closeBracket(),
        rm_word(),
        rm_tag(),
        rm_letter(),
        rm_closeBracket(),
        rm_word()
      ]);
    });
  });

  describe('#buildExpressionTrees', () => {
    it('should cluster brackets into expressions', () => {
      resetIndices();
      const given = [
        rm_tag(),
        rm_word(),
        rm_openBracket(),
        rm_letter(),
        rm_tag(),
        rm_word(),
        rm_conjunction(),
        rm_word(),
        rm_openBracket(),
        rm_letter(),
        rm_closeBracket(),
        rm_word(),
        rm_conjunction(),
        rm_word(),
        rm_tag(),
        rm_word(),
        rm_conjunction(),
        rm_word(),
        rm_tag(),
        rm_word(),
        rm_conjunction(),
        rm_word(),
        rm_tag(),
        rm_letter(),
        rm_closeBracket()
      ];
      resetIndices();
      const expected = [
        rm_tag(),
        rm_word(),
        rm_expression([
          rm_openBracket(),
          rm_letter(),
          rm_tag(),
          rm_word(),
          rm_conjunction(),
          rm_word(),
          rm_expression([rm_openBracket(), rm_letter(), rm_closeBracket()]),
          rm_word(),
          rm_conjunction(),
          rm_word(),
          rm_tag(),
          rm_word(),
          rm_conjunction(),
          rm_word(),
          rm_tag(),
          rm_word(),
          rm_conjunction(),
          rm_word(),
          rm_tag(),
          rm_letter(),
          rm_closeBracket()
        ])
      ];
      expect(buildExpressionTrees(given)).to.deep.equal(expected);
    });

    it('should cluster brackets into expressions, even for broken bracket form models', () => {
      resetIndices();
      const given = [
        rm_openBracket(),
        rm_letter(),
        rm_openBracket(),
        rm_letter(),
        rm_openBracket(),
        rm_letter(),
        rm_conjunction(),
        rm_letter(),
        rm_closeBracket(),
        rm_word(),
        rm_tag(),
        rm_letter(),
        rm_closeBracket()
      ];
      resetIndices();
      const expected = [
        rm_expression([
          rm_openBracket(),
          rm_letter(),
          rm_expression([
            rm_openBracket(),
            rm_letter(),
            rm_expression([rm_openBracket(), rm_letter(), rm_conjunction(), rm_letter(), rm_closeBracket()]),
            rm_word(),
            rm_tag(),
            rm_letter(),
            rm_closeBracket()
          ])
        ])
      ];
      expect(buildExpressionTrees(given)).to.deep.equal(expected);
    });

    it('should cluster brackets into expressions, even for broken closing bracket form models', () => {
      resetIndices();
      const given = [
        rm_closeBracket(),
        rm_openBracket(),
        rm_letter(),
        rm_closeBracket(),
        rm_closeBracket(),
        rm_closeBracket(),
        rm_openBracket(),
        rm_letter(),
        rm_openBracket(),
        rm_letter(),
        rm_conjunction(),
        rm_letter(),
        rm_closeBracket(),
        rm_word(),
        rm_tag(),
        rm_letter(),
        rm_closeBracket()
      ];
      resetIndices();
      const expected = [
        rm_closeBracket(),
        rm_expression([rm_openBracket(), rm_letter(), rm_closeBracket()]),
        rm_closeBracket(),
        rm_closeBracket(),
        rm_expression([
          rm_openBracket(),
          rm_letter(),
          rm_expression([rm_openBracket(), rm_letter(), rm_conjunction(), rm_letter(), rm_closeBracket()]),
          rm_word(),
          rm_tag(),
          rm_letter(),
          rm_closeBracket()
        ])
      ];
      expect(buildExpressionTrees(given)).to.deep.equal(expected);
    });
  });

  describe('#validate', () => {
    it('should add validation information to elements', () => {
      resetIndices();
      const given = [
        rm_conjunction(),
        rm_letter(),
        rm_closeBracket(),
        rm_word(),
        rm_expression([
          rm_openBracket(),
          rm_letter(),
          rm_expression([rm_openBracket(), rm_letter(), rm_tag(), rm_word(), rm_tag(), rm_letter(), rm_closeBracket()]),
          rm_word(),
          rm_conjunction(),
          rm_word(),
          rm_tag(),
          rm_word(),
          rm_conjunction(),
          rm_word()
        ])
      ];
      resetIndices();
      const expected = [
        addValidation(rm_conjunction(), REMOVE_CONJUNCTION),
        rm_letter(),
        addValidation(rm_closeBracket(), REMOVE_BRACKET),
        {
          ...rm_word(),
          valid: false,
          suggestions: [
            {
              type: 'ADD_CONJUNCTION'
            }
          ]
        },
        addValidation(
          rm_expression([
            {
              ...rm_openBracket(),
              valid: true
            },
            rm_letter(),
            rm_expression([
              {
                ...rm_openBracket(),
                valid: true
              },
              rm_letter(),
              rm_tag(),
              addValidation(rm_word(), ADD_CONJUNCTION),
              rm_tag(),
              rm_letter(),
              {
                ...rm_closeBracket(),
                valid: true
              }
            ]),
            rm_word(),
            {
              ...rm_conjunction(),
              valid: true
            },
            rm_word(),
            rm_tag(),
            rm_word(),
            addValidation(rm_conjunction(), REMOVE_CONJUNCTION),
            addValidation(rm_word(), ADD_CLOSING_BRACKET)
          ]),
          MISSING_CLOSING_BRACKET
        )
      ];
      expect(validate(given)).to.deep.equal(expected);
    });

    it('should validate leading NOT conjunctions', () => {
      resetIndices();
      const given = [rm_conjunction('NOT')];
      resetIndices();
      const expected = [
        {
          ...rm_conjunction('NOT'),
          valid: false
        }
      ];
      expect(validate(given)).to.deep.equal(expected);
    });

    it('should validate missing conjunction after closing bracket', () => {
      resetIndices();
      const given = [
        rm_expression([rm_openBracket(), rm_letter(), rm_tag(), rm_word(), rm_tag(), rm_letter(), rm_closeBracket()]),
        rm_word(),
        rm_tag()
      ];
      resetIndices();
      expect(validate(given)).to.deep.equal([
        {
          type: 'EXPRESSION',
          elements: [
            {
              type: 'OPEN_BRACKET',
              formModelIndex: 0,
              valid: true
            },
            {
              type: 'SPACING',
              size: 'LETTER',
              leftFormModelIndex: 0,
              rightFormModelIndex: 1
            },
            {
              type: 'TAG_FILTER',
              formModelIndex: 1
            },
            {
              type: 'SPACING',
              size: 'WORD',
              leftFormModelIndex: 1,
              rightFormModelIndex: 2,
              valid: false,
              suggestions: [
                {
                  type: 'ADD_CONJUNCTION'
                }
              ]
            },
            {
              type: 'TAG_FILTER',
              formModelIndex: 2
            },
            {
              type: 'SPACING',
              size: 'LETTER',
              leftFormModelIndex: 2,
              rightFormModelIndex: 3
            },
            {
              type: 'CLOSE_BRACKET',
              formModelIndex: 3,
              valid: true
            }
          ]
        },
        {
          type: 'SPACING',
          size: 'WORD',
          leftFormModelIndex: 3,
          rightFormModelIndex: 4,
          valid: false,
          suggestions: [
            {
              type: 'ADD_CONJUNCTION'
            }
          ]
        },
        {
          type: 'TAG_FILTER',
          formModelIndex: 4
        }
      ]);
    });
  });

  describe('#toRenderModel', () => {
    beforeEach(resetIndices);

    it('should map null or undefined form model to an empty array', () => {
      formModelIndex++;
      expect(toRenderModel(null)).to.deep.equal([{ ...rm_letter(), renderModelIndex: 0 }]);
      expect(toRenderModel(undefined)).to.deep.equal([{ ...rm_letter(), renderModelIndex: 0 }]);
    });

    it('should map an empty form model to an empty array', () => {
      formModelIndex++;
      expect(toRenderModel([])).to.deep.equal([{ ...rm_letter(), renderModelIndex: 0 }]);
    });
  });
});

function fm_openBracket() {
  return { type: FM_OPEN_BRACKET };
}

function fm_closeBracket() {
  return { type: FM_CLOSE_BRACKET };
}

function fm_tag() {
  return { type: FM_TAG };
}

function fm_conjunction(logicalOperator = 'AND') {
  return { type: FM_CONJUNCTION, logicalOperator };
}

let formModelIndex = 0;
function resetIndices() {
  formModelIndex = 0;
}

function rm_openBracket() {
  return { type: RM_OPEN_BRACKET, formModelIndex: formModelIndex++ };
}

function rm_closeBracket() {
  return { type: RM_CLOSE_BRACKET, formModelIndex: formModelIndex++ };
}

function rm_tag() {
  return { type: RM_TAG, formModelIndex: formModelIndex++ };
}

function rm_conjunction(logicalOperator = 'AND') {
  return { type: RM_CONJUNCTION, logicalOperator, formModelIndex: formModelIndex++ };
}

function rm_letter() {
  return {
    ...LETTER,
    leftFormModelIndex: formModelIndex - 1,
    rightFormModelIndex: formModelIndex
  };
}

function rm_word() {
  return {
    ...WORD,
    leftFormModelIndex: formModelIndex - 1,
    rightFormModelIndex: formModelIndex
  };
}

function rm_expression(elements) {
  return {
    type: EXPRESSION,
    elements
  };
}

function addValidation(element, suggestion) {
  return {
    ...element,
    valid: false,
    suggestions: [{ type: suggestion }]
  };
}
