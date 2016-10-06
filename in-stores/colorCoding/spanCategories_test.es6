/* eslint-env mocha */

import {expect} from 'chai';
import {uniq} from 'lodash';

import {createColorPool} from 'in-services/util/ColorGenerator';
import spanCategoryColors from 'in-stores/colorCoding/spanCategories';
import {registry} from 'in-sdk/tracing';

describe('in-stores/colorCoding/spanCategories', () => {
  const categories = Object.keys(registry).map(type => registry[type].category);
  addTestsEnsuringColorsAreDefinedForAllPossibleValues(spanCategoryColors, categories, 16);
});


function addTestsEnsuringColorsAreDefinedForAllPossibleValues(colorMapping, possibleValues, estimatedNumberOfValues) {
  it('must estimate a value equal to or larger than the actual values', () => {
    expect(uniq(possibleValues).length).to.be.at.most(estimatedNumberOfValues);
  });

  uniq(possibleValues).forEach(possibleValue => {
    it(`must define a color for possible value "${possibleValue}"`, () => {
      expect(colorMapping[possibleValue])
        .to
        .be
        .a('string', `Color for "${possibleValue}" is missing. ` +
          `How about one of the following: ${getColorProposal(colorMapping, estimatedNumberOfValues)}`);
    });
  });
}


function getColorProposal(colorMapping, estimatedNumberOfValues) {
  const colorPool = createColorPool(`${Date.now}-test-pool`, estimatedNumberOfValues);
  const usedColors = Object.keys(colorMapping).map(possibleValue => colorMapping[possibleValue]);
  const availableColors = [];
  for (let i = 0; i < estimatedNumberOfValues; i++) {
    const nextColor = colorPool.getColorHex(i);
    if (usedColors.indexOf(availableColors) === -1) {
      availableColors.push(nextColor);
    }
  }

  return availableColors.join(', ');
}
