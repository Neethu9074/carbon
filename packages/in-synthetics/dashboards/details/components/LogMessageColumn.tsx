/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React, { useLayoutEffect, useMemo, useRef, useState } from 'react';
import classNames from 'classnames';

import useResizeObserver from 'in-hooks/useResizeObserver';

import locals from './LogMessageColumn.mless';

interface LogDetailsProps {
  logs?: string;
}

export default function LogMessageColumn({ logs }: LogDetailsProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const messageRef = useRef();
  const { ref, width: wrapperWidth } = useResizeObserver();

  useLayoutEffect(() => {
    const messageDOMElement = messageRef.current;
    // @ts-expect-error Possibly undefined object
    setIsOverflowing(messageDOMElement.offsetWidth < messageDOMElement.scrollWidth);
    setIsExpanded(false);
  }, [wrapperWidth]);

  return (
    // @ts-expect-error
    <div className={locals.messageWrapper} ref={ref}>
      <span
        className={classNames({
          [locals.collapsedMessage]: !isExpanded,
          [locals.messageExpanded]: isExpanded
        })}
        // @ts-expect-error
        ref={messageRef}
      >
        <LogMessage
          logs={logs}
          isOverflowing={isOverflowing}
          setIsExpanded={setIsExpanded}
          isExpanded={isExpanded}
          setIsHovered={setIsHovered}
          isHovered={isHovered}
        />
      </span>
    </div>
  );
}

interface LogMessageProps {
  logs?: string;
  isExpanded: boolean;
  isHovered: boolean;
  isOverflowing: boolean;
  setIsExpanded?: (v: boolean) => void;
  setIsHovered?: (v: boolean) => void;
}

function LogMessage({ logs, isExpanded, isOverflowing, setIsExpanded, setIsHovered, isHovered }: LogMessageProps) {
  const providesMessageExpanding = !isExpanded && isOverflowing && isHovered;

  return useMemo(() => {
    return (
      <span
        className={classNames({
          [locals.message]: true,
          [locals.hovered]: providesMessageExpanding
        })}
        onMouseEnter={() => setIsHovered?.(true)}
        onMouseLeave={() => setIsHovered?.(false)}
        onClick={() => setIsExpanded && setIsExpanded(!isExpanded)}
      >
        {logs}
      </span>
    );
  }, [logs, providesMessageExpanding, isExpanded, setIsExpanded, setIsHovered]);
}
