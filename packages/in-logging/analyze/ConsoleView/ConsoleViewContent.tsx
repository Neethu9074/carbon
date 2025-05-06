/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { LegacyRef, RefObject, useEffect, useRef, useState } from 'react';
import { VariableSizeList } from 'react-window';

import { CarbonSearch, IconButton, Toggle } from '@instana/components';
import { TagFilterExpressionElementUnion } from '@instana/types';
import { formatDateTime } from '@instana/format-date';
import { useObservable } from '@instana/hooks';

import {
  getLogsOnIntervalObservable,
  HighlightedText,
  LINE_HEIGHT,
  useAbsoluteUrlToItem
} from 'in-logging/analyze/ConsoleView/utils';
import { getLogLevelColor } from 'in-logging/analyze/AnalyzeView/components/Charts/constants';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { getLogLevel } from 'in-logging/analyze/AnalyzeView/logLevel';
import useResizeObserver from 'in-hooks/useResizeObserver';

import locals from 'in-logging/analyze/ConsoleView/ConsoleView.mless';

interface ConsoleViewContentProps {
  filters: TagFilterExpressionElementUnion;
}

export function ConsoleViewContent(props: ConsoleViewContentProps) {
  const [isTailEnabled, setIsTailEnabled] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [searchItemIndex, setSearchItemIndex] = useState(0);
  const [searchResultIndexes, setSearchResultIndexes] = useState<number[]>([]);
  const { ref, height } = useResizeObserver();
  const listRef = useRef<HTMLDivElement>();
  const windowRef = useRef<VariableSizeList>();
  const filtersString = JSON.stringify(props.filters);

  const { goToPath } = useNavigation();
  const logs = useObservable(getLogsOnIntervalObservable(props.filters), [filtersString]) ?? [];
  const dataLength = logs.length;

  useEffect(() => {
    if (isTailEnabled) {
      listRef.current?.scrollTo(0, listRef.current.scrollHeight);
    }
  }, [dataLength, isTailEnabled]);

  function getItemSize(index: number) {
    const lineCount = logs[index].message.split('\n').length || 1;
    return lineCount * LINE_HEIGHT;
  }

  function Row({ index, style }: { index: number; style: React.CSSProperties }) {
    const log = logs[index];
    const logLevel = getLogLevel(log.tags);
    const path = useAbsoluteUrlToItem(log.itemId);

    return (
      <div
        style={style}
        onClick={() => {
          goToPath(path.hash);
        }}
      >
        <div className={locals.logLine} style={{ lineHeight: `${LINE_HEIGHT}px` }}>
          <span>{formatDateTime(log.timestamp)}</span>
          <div className={locals.level} style={{ background: getLogLevelColor(logLevel) }}>
            <span>{logLevel}</span>
          </div>
          <HighlightedText text={log.message} keyword={searchValue} />
        </div>
      </div>
    );
  }

  function handleTailToggle(toggled: boolean) {
    setIsTailEnabled(toggled);
  }

  function handleSearchChange(e: { target: HTMLInputElement; type: 'change' }) {
    const searchString = e.target.value;
    setSearchValue(searchString);
    setSearchResultIndexes(
      logs.flatMap((log, i) => (log.message.toLowerCase().includes(searchString.toLowerCase()) ? [i] : []))
    );
    setSearchItemIndex(0);
  }

  function handleSearchItemIndexChange(direction: 'next' | 'previous') {
    setIsTailEnabled(false);
    setSearchItemIndex(prevIndex => {
      const maxIndex = searchResultIndexes.length - 1;
      let newIndex = prevIndex;

      if (direction === 'next' && prevIndex < maxIndex) {
        newIndex = prevIndex + 1;
      } else if (direction === 'previous' && prevIndex > 0) {
        newIndex = prevIndex - 1;
      }

      windowRef.current?.scrollToItem(searchResultIndexes[newIndex], 'start');
      return newIndex;
    });
  }

  const isSearchNavigationDisabled = searchResultIndexes.length === 0 || searchValue.length === 0;
  const hasSearch = searchValue.length > 0;

  return (
    <div className={locals.consoleView}>
      <fieldset>
        <CarbonSearch
          onClear={() => setSearchValue('')}
          value={searchValue}
          onChange={handleSearchChange}
          labelText="Search logs"
        />
        <div className={locals.toggleContainer}>
          <label htmlFor="tailingToggle">Tailing</label>
          <Toggle id="tailingToggle" checked={isTailEnabled} onToggle={handleTailToggle} />
        </div>
      </fieldset>
      <pre className={locals.consoleContainer} ref={ref as RefObject<HTMLPreElement>}>
        {hasSearch && (
          <nav className={locals.searchNavigation}>
            <IconButton
              type="lib_arrow_down"
              disabled={isSearchNavigationDisabled}
              onClick={() => handleSearchItemIndexChange('next')}
            />
            <IconButton
              type="lib_arrow_up"
              disabled={isSearchNavigationDisabled}
              onClick={() => handleSearchItemIndexChange('previous')}
            />
            <span>
              At {searchItemIndex} of {searchResultIndexes.length} results
            </span>
          </nav>
        )}
        <VariableSizeList
          ref={windowRef as LegacyRef<VariableSizeList>}
          outerRef={listRef}
          height={height ?? 100}
          width={'100%'}
          itemCount={logs.length}
          itemSize={getItemSize}
        >
          {Row}
        </VariableSizeList>
      </pre>
    </div>
  );
}
