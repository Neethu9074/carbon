/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useRef, useState } from 'react';

import { keyCodes, HorizontalIndicator, SearchInput } from '@instana/components';

import SlideInView, { ListHeader } from 'in-components/SlideInView/SlideInView';
import LoadingIndicator from 'in-components/LoadingIndicators/LoadingIndicator';
import SelectorNode, { Options } from 'in-components/SelectorOverlay/Node';
import { getKey, useSearch } from 'in-components/SelectorOverlay/search';
import { onArrowKeyDownFocusSiblings } from 'in-services/util/domFocus';
import NoDataAvailable from 'in-components/Errors/NoDataAvailable';
import { getInteractiveElements } from 'in-services/util/dom';
import { isBlank, isNotBlank } from 'in-services/util/string';
import { noop } from 'in-services/fixedObjects';
import { t } from 'in-i18n';

import locals from './SelectorOverlay.mless';

const { isArrowRight, isReturn, isArrowLeft, isArrowUp } = keyCodes;

const categoryHeight = 40;
// for performance reasons limit number of results shown as rendering is slow for high number of results
const maxResults = 100;

export interface SelectorOverlayProps {
  options: Options[];
  loading?: boolean;
  onChange: (node: Options) => void;
  withIcons: boolean;
  query: string;
  onQueryChange: (value: string) => void;
  onFocusNode?: (node?: Options) => void;
  backButton?: boolean;
  disabled?: boolean;
  shouldTriggerWindowResize?: boolean;
  nodesToSearchFrom?: (options: Options[], focusedNode?: Options) => Options[];
  showLoadingInBackground?: boolean;
}

export default function SelectorOverlay({
  options,
  loading = false,
  onChange,
  withIcons = true,
  query,
  onQueryChange,
  onFocusNode,
  backButton = true,
  disabled = false,
  shouldTriggerWindowResize = false,
  nodesToSearchFrom = (options, focusedNode) => (focusedNode ? [focusedNode] : options),
  showLoadingInBackground = false // true if the loading indicator should be shown at the top and the catalog still shown
}: Readonly<SelectorOverlayProps>) {
  // Used to jump to the first available group when clicking enter in the input field.
  const staticContentWrapperRef = useRef<HTMLInputElement>() as React.MutableRefObject<HTMLInputElement>;
  // Keep a reference to search input
  const searchElementRef = useRef<HTMLInputElement>() as React.MutableRefObject<HTMLInputElement>;

  const focusOnFirstResult = () => {
    if (staticContentWrapperRef.current) {
      const groups = getInteractiveElements(staticContentWrapperRef.current);
      groups[0]?.focus();
    }
  };

  return (
    <>
      <div className={locals.searchInputWrapper}>
        <SearchInput
          placeholder={t('in-components:selectorOverlay.placeholderSearch')}
          onChange={onQueryChange}
          query={query}
          autoFocus
          className={locals.searchInput}
          onReturn={focusOnFirstResult}
          onArrowDown={focusOnFirstResult}
          inputRef={searchElementRef as any}
          disabled={disabled}
        />
      </div>
      <div className={locals.overlay}>
        {loading === true && (!showLoadingInBackground || options.length === 0) && (
          <div className={locals.loading}>
            <LoadingIndicator
              text={t('in-components:selectorOverlay.loadingIndicatorLoadingCatalog')}
              className={locals.loading}
              height={100}
            />
          </div>
        )}
        {loading === true && showLoadingInBackground && options.length !== 0 && (
          <HorizontalIndicator progress={{ loading }} />
        )}
        {loading === false && options.length === 0 && (
          <NoDataAvailable className={locals.overlay} text={t('in-components:selectorOverlay.noResults')} />
        )}
        {(loading === false || showLoadingInBackground) && options.length !== 0 && (
          <DataAvailable
            onFocusNode={onFocusNode}
            disabled={disabled}
            onChange={onChange}
            options={options}
            nodesToSearchFrom={nodesToSearchFrom}
            query={query}
            shouldTriggerWindowResize={shouldTriggerWindowResize}
            withIcons={withIcons}
            staticContentWrapperRef={staticContentWrapperRef}
            searchElementRef={searchElementRef}
            backButton={backButton}
          />
        )}
      </div>
    </>
  );
}

function findFocusedNode(options: Options[]): Options | undefined {
  if (
    options.length != 1 ||
    !options[0].children ||
    options[0].type === 'APPLICATION' ||
    options[0].type === 'SERVICE' ||
    options[0].type === 'ENDPOINT'
  ) {
    return undefined;
  }
  if (options[0].children?.length != 1) {
    return undefined;
  }
  if (options[0].children?.length == 1) {
    return undefined;
  }
  return findFocusedNode(options[0].children);
}

export interface DataAvailableProps {
  disabled: boolean;
  // when choosing a node
  onChange: (node: Options) => void;
  options: Options[];
  // special handling for focused node
  onFocusNode?: (node?: Options) => void;
  backButton: boolean;
  nodesToSearchFrom: (options: Options[], focusedNode?: Options) => Options[];
  query: string;
  shouldTriggerWindowResize?: boolean;
  withIcons: boolean;
  staticContentWrapperRef: React.MutableRefObject<HTMLInputElement>;
  searchElementRef: React.MutableRefObject<HTMLInputElement>;
}

function DataAvailable({
  disabled,
  onChange,
  options,
  onFocusNode,
  backButton = true,
  nodesToSearchFrom,
  query,
  shouldTriggerWindowResize,
  withIcons,
  staticContentWrapperRef,
  searchElementRef
}: Readonly<DataAvailableProps>) {
  const [focusedNode, setFocusedNode] = useState<Options | undefined>(findFocusedNode(options));
  const changeFocusedNode: (node?: Options) => void = (focusedNode?: Options) =>
    onFocusNode ? onFocusNode(focusedNode) : setFocusedNode(focusedNode);

  // We use this ref to store the last element (either search or tag groups)
  // which received focus. This information is used when sliding out to restore
  // focus to whatever was focused beforehand.
  const lastFocusedElementRef = useRef<HTMLDivElement>() as React.MutableRefObject<HTMLDivElement>;
  const List = isBlank(query) ? OptionList : SearchResults;
  return (
    <SlideInView
      showSlideInContent={showFocusedNode()}
      onShowSlideInContentChange={backButton ? unfocusNode : undefined}
      onAfterSlideOut={() => {
        lastFocusedElementRef.current?.focus();
      }}
      HeaderComponent={ListHeader}
      slideTransitionDurationMillis={250}
      slideInContentTitle={focusedNode?.label}
      shouldTriggerWindowResize={shouldTriggerWindowResize}
      slideInContent={
        focusedNode?.children && (
          <div onKeyDown={onKeyDown}>
            {focusedNode?.children.slice(0, maxResults).map((node, i) => (
              <SelectorNode
                key={i}
                node={node as Options}
                focusNode={disabled ? noop : focusNode}
                onChange={disabled ? noop : onChange}
                asListGroup
                withIcons={withIcons}
              />
            ))}
          </div>
        )
      }
      staticContent={
        <div
          onFocus={e => {
            lastFocusedElementRef.current = e.target;
          }}
          ref={staticContentWrapperRef}
          onKeyDown={onKeyDown}
        >
          <List
            options={nodesToSearchFrom(options, focusedNode)}
            disabled={disabled}
            focusNode={focusNode}
            onChange={onChange}
            query={query}
            withIcons={withIcons}
          />
        </div>
      }
      enforceMaxHeightForStaticContent
    />
  );

  function focusNode(focusedNode: Options) {
    changeFocusedNode(focusedNode);
  }

  function unfocusNode() {
    changeFocusedNode();
  }

  function showFocusedNode() {
    return focusedNode !== undefined && isBlank(query);
  }

  function onKeyDown(event: KeyboardEvent | React.KeyboardEvent) {
    if (isArrowRight(event) || isReturn(event)) {
      (event.target as any).click();
    } else if (isArrowLeft(event)) {
      unfocusNode();
    } else if (
      isArrowUp(event) &&
      !showFocusedNode() &&
      getInteractiveElements(event.currentTarget as HTMLElement).indexOf(event.target as HTMLElement) === 0
    ) {
      //arrow up from first element in root menu
      searchElementRef?.current?.focus();
    } else {
      const nextElement = onArrowKeyDownFocusSiblings(event);
      if (nextElement) {
        const scrollPosition = (staticContentWrapperRef?.current?.parentElement as HTMLElement).scrollTop;
        const elementPosition = nextElement.offsetTop;
        if (elementPosition < scrollPosition + categoryHeight) {
          // element is at top but behind category, scroll to show element right under category
          (staticContentWrapperRef?.current?.parentElement as HTMLElement).scrollTo({
            top: elementPosition - categoryHeight,
            behavior: 'smooth'
          });
        }
      }
    }
  }
}

interface SearchResultsProps {
  options: Options[];
  disabled: boolean;
  focusNode: (node: Options) => void;
  onChange: (node: Options) => void;
  withIcons: boolean;
  query: string;
}

function SearchResults({ options, disabled, focusNode, onChange, query, withIcons }: Readonly<SearchResultsProps>) {
  const filteredOptions = useSearch(options, query);
  return (
    <OptionList
      options={filteredOptions.slice(0, maxResults)}
      disabled={disabled}
      focusNode={focusNode}
      onChange={onChange}
      query={query}
      withIcons={withIcons}
    />
  );
}

interface OptionsListProps {
  options: Options[];
  disabled: boolean;
  focusNode: (node: Options) => void;
  onChange: (node: Options) => void;
  query: string;
  withIcons: boolean;
}
function OptionList({ options, disabled, focusNode, onChange, query, withIcons }: Readonly<OptionsListProps>) {
  return (
    <>
      {options.map(node => (
        <SelectorNode
          key={getKey(node)}
          node={node}
          focusNode={disabled ? noop : focusNode}
          onChange={disabled ? noop : onChange}
          asListGroup
          withIcons={withIcons}
          withBreadcrumbs={isNotBlank(query)}
          height={`${categoryHeight}px`}
        />
      ))}
    </>
  );
}
