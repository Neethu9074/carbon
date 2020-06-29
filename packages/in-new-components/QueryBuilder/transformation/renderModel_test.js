/* eslint-env mocha */

import { expect } from 'chai';

import {
  toRenderModel,
  addSpacingsAndIncides,
  LETTER,
  WORD,
  TAG as RM_TAG,
  CONJUNCTION as RM_CONJUNCTION,
  OPEN_BRACKET as RM_OPEN_BRACKET,
  CLOSE_BRACKET as RM_CLOSE_BRACKET
} from 'in-new-components/QueryBuilder/transformation/renderModel';
import {
  TAG as FM_TAG,
  CONJUNCTION as FM_CONJUNCTION,
  OPEN_BRACKET as FM_OPEN_BRACKET,
  CLOSE_BRACKET as FM_CLOSE_BRACKET
} from 'in-new-components/QueryBuilder/transformation/formModel';

describe('in-new-components/QueryBuilder/transformation/renderModel', () => {
  describe('#addSpacingsAndIncides', () => {
    beforeEach(() => {
      resetRenderModelIndex();
    });

    it('should add no spacings is one or no elements', () => {
      expect(addSpacingsAndIncides([])).to.deep.equal([]);
      expect(addSpacingsAndIncides([fm_tag()])).to.deep.equal([rm_tag(0)]);
    });

    it('should add spacings between each element', () => {
      expect(
        addSpacingsAndIncides([
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
        rm_letter(1),
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

let renderModelIndex = 0;
function resetRenderModelIndex() {
  renderModelIndex = 0;
}

function rm_openBracket() {
  return { type: RM_OPEN_BRACKET, formModelIndex: renderModelIndex++ };
}

function rm_closeBracket() {
  return { type: RM_CLOSE_BRACKET, formModelIndex: renderModelIndex++ };
}

function rm_tag() {
  return { type: RM_TAG, formModelIndex: renderModelIndex++ };
}

function rm_conjunction() {
  return { type: RM_CONJUNCTION, formModelIndex: renderModelIndex++ };
}

function rm_letter() {
  return {
    ...LETTER,
    leftFormModelIndex: renderModelIndex - 1,
    rightFormModelIndex: renderModelIndex
  };
}

function rm_word() {
  return {
    ...WORD,
    leftFormModelIndex: renderModelIndex - 1,
    rightFormModelIndex: renderModelIndex
  };
}
