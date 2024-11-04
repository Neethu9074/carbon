/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import Tooltip from 'in-components/Tooltip/Tooltip';

import locals from './EntityTableCellWithOverflow.mless';

/**
 * Props for the EntityTableCellWithOverflow component
 * @property content to be rendered as text
 */
interface Props {
  content: string;
}

/**
 * Renders the content with a maximum width and overflow (providing the content completely as tooltip)
 * @param param0 properties for current instance
 * @returns instance of component
 */
export default function EntityTableCellWithOverflow({ content }: Props) {
  return (
    <Tooltip content={content} align="topLeft">
      <div className={locals.abbreviatedContent}>{content}</div>
    </Tooltip>
  );
}
