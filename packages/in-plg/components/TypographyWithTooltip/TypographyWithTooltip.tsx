/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { Typography } from '@instana/components';

import Tooltip from 'in-components/Tooltip/Tooltip';

interface TypographyWithTooltipProp {
  content: string;
}

/**
 * This function returns a <Typography /> wrapped with a tooltip
 * @param content
 * @returns A JSX element element.
 */
const TypographyWithTooltip = ({ content }: TypographyWithTooltipProp) => {
  return (
    <Tooltip content={content} align="auto" caret={false}>
      <span>
        <Typography variant="body-regular">{content}</Typography>
      </span>
    </Tooltip>
  );
};

export default TypographyWithTooltip;
