/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { Link } from '@instana/components';
import { LogTag } from '@instana/types';

import { logMessageTagClicked } from 'in-logging/analyze/AnalyzeView/tracker';
import { t } from 'in-i18n';

import locals from 'in-logging/analyze/AnalyzeView/components/LogTagsTable.mless';

export default function LogFilePathTag({
  resolvedLink,
  resolvedValue,
  resolvedLogTagName,
  tag
}: {
  resolvedLink?: string | null;
  resolvedValue: string;
  resolvedLogTagName: string;
  tag: LogTag;
}) {
  return (
    <span>
      <>
        <span className={locals.value}>{tag.stringValue}</span>
        <span>{` ${t('in-logging:fileOnHost')} `}</span>
      </>
      {resolvedLink ? (
        <Link
          className={locals.value}
          href={resolvedLink}
          onClick={() => logMessageTagClicked({ tag: { name: tag.name, value: resolvedValue, key: tag.key } })}
        >
          {resolvedLogTagName}
        </Link>
      ) : (
        <span className={locals.value}>{resolvedLogTagName}</span>
      )}
    </span>
  );
}
