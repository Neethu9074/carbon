/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { stopPropagationAndPreventDefault } from 'in-services/util/function';
import Tooltip from 'in-components/Tooltip';

import locals from './KeyValueHeader.mless';

export default function KeyValueHeader({ label, value, onClick, tooltipContent }) {
  let content = null;
  if (onClick) {
    content = (
      <a
        href=""
        onClick={e => {
          stopPropagationAndPreventDefault(e);
          onClick();
        }}
        className={locals.valueLink}
      >
        {value}
      </a>
    );
  } else {
    content = <span className={locals.value}>{value}</span>;
  }

  content = (
    <div className={locals.header}>
      <span className={locals.key}>{label}</span>
      {content}
    </div>
  );

  if (tooltipContent) {
    content = (
      <Tooltip content={tooltipContent} align="leftMiddle">
        {content}
      </Tooltip>
    );
  }

  return content;
}
