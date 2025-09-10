/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { LegacyRef, RefObject, useEffect, useRef, useState } from 'react';
import { VariableSizeList } from 'react-window';

import { CarbonSearch, IconButton, Toggle } from '@instana/components';
import { TagFilterExpressionElementUnion } from '@instana/types';
import { useObservable } from '@instana/hooks';

import {
  getLogMessageWithParams,
  getLogsOnIntervalObservable,
  LINE_HEIGHT
} from 'in-logging/analyze/ConsoleView/utils';
import { localisationStrings } from 'in-logging/analyze/ConsoleView/localisationStrings';
import { ConsoleViewRow } from 'in-logging/analyze/ConsoleView/ConsoleViewRow';
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
  const { ref, height, width } = useResizeObserver();
  const listRef = useRef<HTMLDivElement>();
  const windowRef = useRef<VariableSizeList>();
  const filtersString = JSON.stringify(props.filters);
  const logs = useObservable(getLogsOnIntervalObservable(props.filters), [filtersString]) ?? [];
  const dataLength = logs.length;

  useEffect(() => {
    if (isTailEnabled) {
      listRef.current?.scrollTo(0, listRef.current.scrollHeight);
    }
  }, [dataLength, isTailEnabled]);

  function getItemSize(index: number) {
    const log = logs[index];
    const messageLines = log.message.split('\n');
    const charactersPerLine = Math.floor((width || 100) / 10);
    const totalWrappedLines = messageLines.reduce((acc, line) => {
      const lineLength = line.length;
      const wrappedLines = lineLength > 0 ? Math.ceil(lineLength / charactersPerLine) : 1;
      return acc + wrappedLines;
    }, 0);

    return totalWrappedLines * LINE_HEIGHT;
  }

  function handleTailToggle(toggled: boolean) {
    setIsTailEnabled(toggled);
  }

  function handleSearchChange(e: { target: HTMLInputElement; type: 'change' }) {
    const searchString = e.target.value;
    setSearchValue(searchString);
    setSearchResultIndexes(
      logs.flatMap((log, i) =>
        getLogMessageWithParams(log).toLowerCase().includes(searchString.toLowerCase()) ? [i] : []
      )
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
    <div className={locals.consoleView} data-testid="logConsoleTailingToggle">
      <fieldset>
        <CarbonSearch
          onClear={() => setSearchValue('')}
          value={searchValue}
          onChange={handleSearchChange}
          labelText="Search logs"
          data-testid="logConsoleSearchInput"
        />
        <div className={locals.toggleContainer}>
          <label htmlFor="tailingToggle">{localisationStrings.tailing}</label>
          <Toggle id="tailingToggle" checked={isTailEnabled} onToggle={handleTailToggle} />
        </div>
      </fieldset>
      <pre className={locals.consoleContainer} ref={ref as RefObject<HTMLPreElement>}>
        {hasSearch && (
          <nav className={locals.searchNavigation} data-testid="logConsoleSearchArrows">
            <IconButton
              type="lib_arrow_down"
              disabled={isSearchNavigationDisabled || searchItemIndex === searchResultIndexes.length - 1}
              onClick={() => handleSearchItemIndexChange('next')}
            />
            <IconButton
              type="lib_arrow_up"
              disabled={isSearchNavigationDisabled || searchItemIndex === 0}
              onClick={() => handleSearchItemIndexChange('previous')}
            />
            <span>{localisationStrings.searchIndex(searchItemIndex + 1, searchResultIndexes.length)}</span>
          </nav>
        )}
        <section data-testid="logConsoleVirtualList">
          <VariableSizeList
            ref={windowRef as LegacyRef<VariableSizeList>}
            outerRef={listRef}
            height={height ?? 100}
            width={'100%'}
            itemCount={logs.length}
            itemSize={getItemSize}
          >
            {({ index, style }) => <ConsoleViewRow index={index} logs={logs} searchValue={searchValue} style={style} />}
          </VariableSizeList>
        </section>
      </pre>
    </div>
  );
}
