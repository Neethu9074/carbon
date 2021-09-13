/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { SvgIconSizes } from '@instana/components';

import LogHealthColumn from 'in-logging/analyze/AnalyzeView/components/LogHealthColumn';
// @ts-expect-error
import CopyToClipboard from 'in-components/CopyToClipboard';
import { formatDateTime } from 'in-services/formatters/date';
import IconButton from 'in-components/IconButton/IconButton';
import Tooltip from 'in-components/Tooltip';
import { LogTag } from 'in-types';
import { t } from 'in-i18n';

// @ts-expect-error
import locals from './Logs.mless';

interface LogLevelColumnProps {
  tags: LogTag[];
  onSelectTagHref: (tag: LogTag) => string;
}

export const logLevelColumn = {
  id: 'logLevel',
  width: '4.5rem',
  widthInAbsoluteUnit: true,
  getContent({ tags, onSelectTagHref }: LogLevelColumnProps) {
    return (
      <div className={locals.healthColumn}>
        <LogHealthColumn tags={tags} onSelectTagHref={onSelectTagHref} />
      </div>
    );
  }
};

interface TimestampColumnProps {
  timestamp: number;
}

export const timestampColumn = {
  id: 'timestamp',
  width: '10rem',
  useMaxHeight: true,
  widthInAbsoluteUnit: true,
  getContent({ timestamp }: TimestampColumnProps) {
    return <div className={locals.dateTime}>{formatDateTime(timestamp)}</div>;
  }
};

interface CopyColumnProps {
  message: string;
}

export const copyColumn = {
  id: 'copyIcon',
  width: '2.5rem',
  getContent({ message }: CopyColumnProps) {
    return (
      <div className={locals.copyButtonWrapper}>
        <Tooltip content={t('in-logging:tooltipCopyToClipboard')}>
          <CopyToClipboard getText={() => message}>
            {(copyToClipboardRef: React.MutableRefObject<HTMLButtonElement>) => (
              <IconButton ref={copyToClipboardRef} iconSize={SvgIconSizes.xs} type="lib_actions_copy" />
            )}
          </CopyToClipboard>
        </Tooltip>
      </div>
    );
  }
};
