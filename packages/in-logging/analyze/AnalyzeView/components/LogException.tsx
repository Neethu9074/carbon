/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useLayoutEffect, useRef, useMemo, useState } from 'react';
import classNames from 'classnames';

import { Stack } from '@instana/components';

import LogExceptionDialog from 'in-logging/analyze/AnalyzeView/components/LogExceptionDialog';
import { LOG_EXCEPTION_TYPE, LOG_EXCEPTION_MESSAGE } from 'in-logging/queryBuilder';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import useResizeObserver from 'in-hooks/useResizeObserver';
import { LogItem } from 'in-types';

// @ts-expect-error
import locals from './LogException.mless';

interface LogExceptionWrapperProps {
  item: LogItem;
}

interface LogExceptionProps extends LogExceptionWrapperProps {
  type?: string;
  message?: string;
}

export default function LogExceptionWrapper({ item }: LogExceptionWrapperProps) {
  const tags = item.tags;

  const exceptionTypeTag = useMemo(() => tags.find(({ name }) => name === LOG_EXCEPTION_TYPE), [tags]);
  const exceptionMessageTag = useMemo(() => tags.find(({ name }) => name === LOG_EXCEPTION_MESSAGE), [tags]);
  if (!exceptionTypeTag && !exceptionMessageTag) {
    return null;
  }

  return <LogException type={exceptionTypeTag?.stringValue} message={exceptionMessageTag?.stringValue} item={item} />;
}

function LogException({ type, message, item }: LogExceptionProps) {
  const [isOverflowing, setIsOverflowing] = useState(false);
  const messageRef = useRef<HTMLSpanElement>(null);
  const { ref, width: wrapperWidth } = useResizeObserver<HTMLSpanElement>();

  useLayoutEffect(() => {
    const messageDOMElement = messageRef.current;

    setIsOverflowing((messageDOMElement && wrapperWidth && wrapperWidth < messageDOMElement.offsetWidth) || false);
  }, [wrapperWidth]);

  if (!type && !message) {
    return null;
  }

  return (
    <Stack direction="horizontal" gap="normal">
      {type && <span className={locals.type}>{type}:</span>}
      {message && (
        <span className={locals.messageWrapper} ref={ref}>
          <span
            className={classNames({ [locals.overflowingMessage]: isOverflowing })}
            ref={messageRef}
            onClick={() => {
              if (isOverflowing) {
                addActiveDialog(<LogExceptionDialog onClose={close} item={item} />);
              }
            }}
          >
            {message}
          </span>
        </span>
      )}
    </Stack>
  );
}
