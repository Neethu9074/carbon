/* eslint-env mocha */

import { expect } from 'chai';

import {
  toRenderModel,
  addSpacingsAndIncides,
  buildExpressionTrees,
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

describe('in-new-components/QueryBuilder/transformation/renderModel', () => {
  describe('#addSpacingsAndIncides', () => {
    beforeEach(resetIndices);

    it('should add no spacings is one or no elements', () => {
      expect(addSpacingsAndIncides([])).to.deep.equal([]);
      expect(addSpacingsAndIncides([fm_tag()])).to.deep.equal([rm_tag()]);
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

  describe('#toRenderModel', () => {
    it('should map null or undefined form model to an empty array', () => {
      expect(toRenderModel(null)).to.deep.equal([]);
      expect(toRenderModel(undefined)).to.deep.equal([]);
    });

    it('should map an empty form model to an empty array', () => {
      expect(toRenderModel([])).to.deep.equal([]);
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

function fm_conjunction() {
  return { type: FM_CONJUNCTION };
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

function rm_conjunction() {
  return { type: RM_CONJUNCTION, formModelIndex: formModelIndex++ };
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
