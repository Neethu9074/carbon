/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Typography, useTheme } from '@instana/components';

import { TagsType } from 'in-service-levels/components/TagsList/SloTagsList';
import useResizeObserver from 'in-hooks/useResizeObserver';
import Tooltip from 'in-components/Tooltip';
import Pill from 'in-components/Pill/Pill';

import locals from 'in-service-levels/components/TagsList/SloTagsList.mless';

interface TagListProps {
  displayedTags: any;
  wrapperClasses?: string;
  hiddenTags?: TagsType | undefined;
  shouldRenderTooltip?: boolean;
}
export default function TagLists({ displayedTags, wrapperClasses, hiddenTags, shouldRenderTooltip }: TagListProps) {
  if (!displayedTags[0].text) {
    displayedTags = displayedTags.map((tag: any) => ({
      text: tag,
      width: 0
    }));
  }

  const theme = useTheme();
  const { ref } = useResizeObserver();
  const { ref: tooltipRef } = useResizeObserver();
  return (
    <div ref={ref as React.MutableRefObject<HTMLDivElement>} className={wrapperClasses}>
      <div className={locals.tagsWrapper}>
        {displayedTags.map((tag: any) => (
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
                {hiddenTags?.map((hiddenTag: { text: any }) => (
                  <Typography variant="body-small" onDark key={hiddenTag.text}>
                    {hiddenTag.text}
                  </Typography>
                ))}
              </div>
            }
            delay={500}
          >
            <Pill className={locals.singleTag} color={theme.ids.color.option.neutral[400]}>
              <Typography variant="body-small">{hiddenTags?.length}</Typography>
            </Pill>
          </Tooltip>
        )}
      </div>
    </div>
  );
}
