/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { forwardRef } from 'react';

import { Typography, useTheme } from '@instana/components';

import Tooltip from 'in-components/Tooltip';
import Pill from 'in-components/Pill/Pill';

import locals from 'in-service-levels/components/TagsList/SloTagsList.mless';

interface TagListProps {
  tags: string[];
  className?: string;
  hiddenTags?: string[];
  renderTooltip?: boolean;
  tooltipRef?: React.RefObject<HTMLElement>;
}
export default forwardRef(function TagLists(
  { tags, className, hiddenTags, renderTooltip, tooltipRef }: TagListProps,
  ref
) {
  const theme = useTheme();

  return (
    <div ref={ref as React.MutableRefObject<HTMLDivElement>} className={className}>
      <div className={locals.tagsWrapper}>
        {tags.map((tag: any) => (
          <Pill className={locals.singleTag} color={theme.ids.color.option.neutral[400]} key={tag}>
            <Typography variant="body-small">{tag}</Typography>
          </Pill>
        ))}
      </div>

      <div ref={tooltipRef as React.MutableRefObject<HTMLDivElement>}>
        {renderTooltip && (
          <Tooltip
            content={
              <div className={locals.tooltipWrapper}>
                {hiddenTags?.map((tag: any) => (
                  <Typography variant="body-small" onDark key={tag}>
                    {tag}
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
});
