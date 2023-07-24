/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useLayoutEffect, useRef, useState } from 'react';
import classNames from 'classnames';

import { getTagsThatFitAfterResize, getTagsThatFitIntoMaxWidth } from 'in-service-levels/components/TagsList/utils';
import { tagsCssGap } from 'in-service-levels/components/TagsList/constants';
import TagLists from 'in-service-levels/components/TagsList/TagList';
import useResizeObserver from 'in-hooks/useResizeObserver';

import locals from 'in-service-levels/components/TagsList/SloTagsList.mless';

export type TagsType = {
  text: string;
  width: number;
}[];

interface SloTagsListProps {
  tags: string[];
}

export const SloTagsList = ({ tags }: SloTagsListProps) => {
  const [displayedTags, setDisplayedTags] = useState<TagsType>(
    tags.map(tag => ({
      text: tag,
      width: 0
    }))
  );
  const [hiddenTags, setHiddenTags] = useState<TagsType>([]);

  const { ref, width } = useResizeObserver();

  const { width: tooltipWidth } = useResizeObserver();

  const hasCompletedFirstCalculationRef = useRef(false);
  const hasCompletedSecondCalculationRef = useRef(false);

  useLayoutEffect(() => {
    if (!width || !hasCompletedFirstCalculationRef.current) return;

    const widthOfTooltip = tooltipWidth ? tooltipWidth + tagsCssGap : 0;
    const targetWidth = width - widthOfTooltip;

    const optimizedTags = getTagsThatFitAfterResize({ displayedTags, hiddenTags, targetWidth });

    const hasStateChangedFromPreviousRender = optimizedTags.displayedTags.length !== displayedTags.length;
    const hasTooltipWidthBeenCorrectlyCalculated =
      (tooltipWidth === 0 && hiddenTags.length === 0) || (tooltipWidth !== 0 && hiddenTags.length !== 0);

    if (!hasCompletedSecondCalculationRef.current || hasStateChangedFromPreviousRender) {
      setDisplayedTags(optimizedTags.displayedTags);
      setHiddenTags(optimizedTags.hiddenTags);
    }

    if (!hasCompletedSecondCalculationRef.current && hasTooltipWidthBeenCorrectlyCalculated) {
      hasCompletedSecondCalculationRef.current = true;
    }

    // For performance reasons recalculation should only be triggered when the width of the container or the tooltip changes, state is ommited
    // eslint-disable-next-line
  }, [width, tooltipWidth]);

  useLayoutEffect(() => {
    if (!ref.current || !width || hasCompletedFirstCalculationRef.current) return;

    const { children } = ref.current;

    const arrayWithTagsWidth = Array.from(children[0].children).map(node => node.scrollWidth);

    const tagsWithWidth = tags.map((tag, index) => ({
      text: tag,
      width: arrayWithTagsWidth[index]
    }));

    const { tagsThatDontFit, tagsThatFit } = getTagsThatFitIntoMaxWidth(tagsWithWidth, width);

    setDisplayedTags(tagsThatFit);
    setHiddenTags(tagsThatDontFit);

    hasCompletedFirstCalculationRef.current = true;
  }, [ref, tags, width]);

  const wrapperClasses = classNames(locals.wrapper, {
    [locals.visible]: hasCompletedSecondCalculationRef.current,
    [locals.hidden]: !hasCompletedSecondCalculationRef.current
  });

  const shouldRenderTooltip = hiddenTags.length !== 0;

  return (
    <TagLists
      wrapperClasses={wrapperClasses}
      displayedTags={displayedTags}
      hiddenTags={hiddenTags}
      shouldRenderTooltip={shouldRenderTooltip}
    />
  );
};
