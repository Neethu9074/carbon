/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useLayoutEffect, useRef, useState } from 'react';
import classNames from 'classnames';

import { Typography, useTheme } from '@instana/components';

import {
  getTagsThatFitAfterResize,
  getTagsThatFitIntoMaxWidth
} from 'in-service-levels/components/SloList/components/TagsList/utils';
import { tagsCssGap } from 'in-service-levels/components/SloList/components/TagsList/constants';
import useResizeObserver from 'in-hooks/useResizeObserver';
import Tooltip from 'in-components/Tooltip';
import Pill from 'in-components/Pill/Pill';

import locals from 'in-service-levels/components/SloList/components/TagsList/SloTagsList.mless';

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
  const { ref: tooltipRef, width: tooltipWidth } = useResizeObserver();

  const hasCompletedFirstCalculationRef = useRef(false);
  const hasCompletedSecondCalculationRef = useRef(false);

  const theme = useTheme();

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
    <div ref={ref as React.MutableRefObject<HTMLDivElement>} className={wrapperClasses}>
      <div className={locals.tagsWrapper}>
        {displayedTags.map(tag => (
          <Pill className={locals.singleTag} color={theme.ids.color.option.neutral[400]} key={tag.text}>
            <Typography variant="body-small">{tag.text}</Typography>
          </Pill>
        ))}
      </div>
      <div ref={tooltipRef as React.MutableRefObject<HTMLDivElement>}>
        {shouldRenderTooltip && (
          <Tooltip
            content={
              <div className={locals.tooltipWrapper}>
                {hiddenTags.map(hiddenTag => (
                  <Typography variant="body-small" onDark key={hiddenTag.text}>
                    {hiddenTag.text}
                  </Typography>
                ))}
              </div>
            }
            delay={500}
          >
            <Pill className={locals.singleTag} color={theme.ids.color.option.neutral[400]}>
              <Typography variant="body-small">+{hiddenTags.length}</Typography>
            </Pill>
          </Tooltip>
        )}
      </div>
    </div>
  );
};
