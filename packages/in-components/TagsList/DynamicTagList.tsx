/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useLayoutEffect, useState } from 'react';
import classNames from 'classnames';

import { Typography, Pill } from '@instana/components';
import { themes } from '@instana/design-tokens';

import { getTagsThatFitAfterResize, getTagsThatFitIntoMaxWidth } from 'in-components/TagsList/utils';
import useResizeObserver from 'in-hooks/useResizeObserver';
import TagList from 'in-components/TagsList/TagList';
import Tooltip from 'in-components/Tooltip';

import locals from 'in-components/TagsList/TagsList.mless';

export const tagsCssGap = 8;

export type TagsType = {
  text: string;
  width: number;
}[];

interface DynamicTagListProps {
  tags: string[];
}

export function DynamicTagList({ tags }: DynamicTagListProps) {
  const [displayedTags, setDisplayedTags] = useState<TagsType>(
    tags.map(tag => ({
      text: tag,
      width: 0
    }))
  );
  const [hiddenTags, setHiddenTags] = useState<TagsType>([]);
  const [shouldDoFirstCalculation, setShouldDoFirstCalculation] = useState<boolean>(true);
  const [shouldDoSecondCalculation, setShouldDoSecondCalculation] = useState<boolean>(true);

  const { ref, width } = useResizeObserver<HTMLDivElement>();
  const { ref: tooltipRef, width: tooltipWidth } = useResizeObserver<HTMLDivElement>();

  // This is the initial calculation with the tags being rendered while the visibility is set to hidden by css.
  // it is required to figure our how much space the tags need
  useLayoutEffect(() => {
    if (!ref.current || !width || !shouldDoFirstCalculation) return;

    const { children } = ref.current;

    const arrayWithTagsWidth = Array.from(children[0].children).map(node => node.scrollWidth);

    const tagsWithWidth = tags.map((tag, index) => ({
      text: tag,
      width: arrayWithTagsWidth[index]
    }));

    const { tagsThatDontFit, tagsThatFit } = getTagsThatFitIntoMaxWidth(tagsWithWidth, width);

    setDisplayedTags(tagsThatFit);
    setHiddenTags(tagsThatDontFit);
    setShouldDoFirstCalculation(false);
    setShouldDoSecondCalculation(true);
    // eslint-disable-next-line
  }, [shouldDoFirstCalculation, ref, width]);

  // This is the follow-up calculation that works when the table or the column with the tags is resized
  useLayoutEffect(() => {
    if (!width || shouldDoFirstCalculation) return;

    const widthOfTooltip = tooltipWidth && hiddenTags.length !== 0 ? tooltipWidth + tagsCssGap : 0;
    const targetWidth = width - widthOfTooltip;

    const optimizedTags = getTagsThatFitAfterResize({ displayedTags, hiddenTags, targetWidth });

    const hasStateChangedFromPreviousRender = optimizedTags.displayedTags.length !== displayedTags.length;
    const hasTooltipWidthBeenCorrectlyCalculated =
      (tooltipWidth === 0 && hiddenTags.length === 0) || (tooltipWidth !== 0 && hiddenTags.length !== 0);

    if (hasStateChangedFromPreviousRender) {
      setDisplayedTags(optimizedTags.displayedTags);
      setHiddenTags(optimizedTags.hiddenTags);
      setShouldDoSecondCalculation(false);
    }

    if (shouldDoSecondCalculation && hasTooltipWidthBeenCorrectlyCalculated) {
      setShouldDoSecondCalculation(false);
    }

    // For performance reasons recalculation should only be triggered when the width of the container or the tooltip changes, state is ommited
    // eslint-disable-next-line
  }, [shouldDoSecondCalculation, width, tooltipWidth]);

  // This runs when the table tag filter is changed.
  // It is necessary because the table does not render children anew but uses
  // old children and passes different props to them, which results in no rerender.
  useLayoutEffect(() => {
    if (shouldDoSecondCalculation) return;

    setDisplayedTags(
      tags.map(tag => ({
        text: tag,
        width: 0
      }))
    );
    setHiddenTags([]);
    setShouldDoFirstCalculation(true);
    // eslint-disable-next-line
  }, [tags]);

  const shouldRenderTooltip = hiddenTags.length !== 0;

  const wrapperClasses = classNames(locals.wrapper, {
    [locals.hidden]: shouldDoSecondCalculation
  });

  return (
    <div ref={ref} className={wrapperClasses}>
      <TagList tags={displayedTags.map(({ text }) => text)} />
      <div ref={tooltipRef}>
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
            <div>
              <Pill className={locals.singleTag} color={themes.default.ids.color.option.neutral['400']}>
                <Typography variant="body-small">+{hiddenTags.length}</Typography>
              </Pill>
            </div>
          </Tooltip>
        )}
      </div>
    </div>
  );
}
