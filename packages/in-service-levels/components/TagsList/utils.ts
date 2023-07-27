/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { TagsType } from 'in-service-levels/components/TagsList/SloDynamicTagList';
import { tagsCssGap } from 'in-service-levels/components/TagsList/constants';

export const getTagsThatFitIntoMaxWidth = (tags: TagsType, targetWidth: number) => {
  const tagsThatFit: TagsType = [];
  const tagsThatDontFit: TagsType = [];

  let currentSum = -tagsCssGap;

  for (let i = 0; i < tags.length; i++) {
    const { text, width } = tags[i];

    const normalizedTagData = {
      text,
      width
    };

    // When adding an item, css gap will be added
    if (currentSum + width + tagsCssGap <= targetWidth) {
      currentSum += width + tagsCssGap;
      tagsThatFit.push(normalizedTagData);
    } else {
      tagsThatDontFit.push(normalizedTagData);
    }
  }

  return {
    tagsThatFit,
    tagsThatDontFit
  };
};

interface IFitTags {
  displayedTags: TagsType;
  hiddenTags: TagsType;
  targetWidth: number;
}

export const getTagsThatFitAfterResize = ({ displayedTags, hiddenTags, targetWidth }: IFitTags) => {
  const shallowDisplayedTags = [...displayedTags];
  const shallowHiddenTags = [...hiddenTags];

  let sumOfWidthsOfDisplayedTags = shallowDisplayedTags.reduce(
    (accumulator, { width }) => accumulator + width + tagsCssGap,
    -tagsCssGap
  );

  while (sumOfWidthsOfDisplayedTags < targetWidth) {
    const theFirstHiddenTag = shallowHiddenTags[0];

    if (!shallowHiddenTags.length || theFirstHiddenTag.width + tagsCssGap + sumOfWidthsOfDisplayedTags > targetWidth) {
      break;
    } else {
      sumOfWidthsOfDisplayedTags += theFirstHiddenTag.width + tagsCssGap;
      shallowDisplayedTags.push(theFirstHiddenTag);
      shallowHiddenTags.shift();
    }
  }

  while (sumOfWidthsOfDisplayedTags > targetWidth) {
    const theLastDisplayedTag = shallowDisplayedTags[shallowDisplayedTags.length - 1];

    if (!theLastDisplayedTag) break;

    sumOfWidthsOfDisplayedTags -= theLastDisplayedTag.width - tagsCssGap;
    shallowHiddenTags.unshift(theLastDisplayedTag);
    shallowDisplayedTags.pop();
  }

  return {
    displayedTags: shallowDisplayedTags,
    hiddenTags: shallowHiddenTags
  };
};
