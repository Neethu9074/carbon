/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';

import { keyCodes } from '@instana/components';

import { nodeArray as nodeArrayPropType } from 'in-components/SelectorOverlay/props';
import SlideInView, { ListHeader } from 'in-components/SlideInView/SlideInView';
import LoadingIndicator from 'in-components/LoadingIndicators/LoadingIndicator';
import { onArrowKeyDownFocusSiblings } from 'in-services/util/domFocus';
import NoDataAvailable from 'in-components/Errors/NoDataAvailable';
import { search } from 'in-components/SelectorOverlay/search';
import { getInteractiveElements } from 'in-services/util/dom';
import Node from 'in-components/SelectorOverlay/Node';
import { isNotBlank } from 'in-services/util/string';
import SearchInput from 'in-components/SearchInput';
import { noop } from 'in-services/fixedObjects';
import { t } from 'in-i18n';

import locals from './SelectorOverlay.mless';

const { isArrowRight, isReturn, isArrowLeft, isArrowUp } = keyCodes;

const categoryHeight = 40;
// for performance reasons limit number of results shown as rendering is slow for high number of results
const maxResults = 100;

export default function SelectorOverlay({
  options,
  loading = false,
  onChange,
  withIcons = true,
  query,
  onQueryChange,
  disabled
}) {
  const [focusedNode, setFocusedNode] = useState(null);
  const [showFocusedNode, setShowFocusedNode] = useState(false);
  options = useMemo(() => {
    if (isNotBlank(query)) {
      const results = search(options, query);
      return results.filter(node => !node.disabled);
    }
    return options;
  }, [options, query]);
  useEffect(() => {
    setShowFocusedNode(false);
  }, [options]);

  // Used to jump to the first available group when clicking enter in the input field.
  const staticContentWrapperRef = useRef();
  // We use this ref to store the last element (either search or tag groups)
  // which received focus. This information is used when sliding out to restore
  // focus to whatever was focused beforehand.
  const lastFocusedElementRef = useRef();
  // Keep a reference to search input
  const searchElementRef = useRef();

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
          inputRef={searchElementRef}
          disabled={disabled}
        />
      </div>
      <div className={locals.overlay}>
        {loading === true && (
          <div className={locals.loading}>
            <LoadingIndicator
              text={t('in-components:selectorOverlay.loadingIndicatorLoadingCatalog')}
              className={locals.loading}
              height={100}
            />
          </div>
        )}
        {loading === false && options.length === 0 && (
          <NoDataAvailable className={locals.overlay} text={t('in-components:selectorOverlay.noResults')} />
        )}
        {loading === false && (
          <SlideInView
            showSlideInContent={showFocusedNode}
            onShowSlideInContentChange={setShowFocusedNode}
            onAfterSlideOut={() => {
              lastFocusedElementRef.current?.focus();
            }}
            HeaderComponent={ListHeader}
            slideTransitionDurationMillis={250}
            slideInContentTitle={focusedNode?.label}
            slideInContent={
              focusedNode?.children && (
                <div onKeyDown={onKeyDown}>
                  {focusedNode?.children.slice(0, maxResults).map((node, i) => (
                    <Node
                      key={i}
                      node={node}
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
                {options.slice(0, maxResults).map((node, i) => (
                  <Node
                    key={i}
                    node={node}
                    focusNode={disabled ? noop : focusNode}
                    onChange={disabled ? noop : onChange}
                    asListGroup
                    withIcons={withIcons}
                    withBreadcrumbs={isNotBlank(query)}
                    height={`${categoryHeight}px`}
                  />
                ))}
              </div>
            }
            enforceMaxHeightForStaticContent
          />
        )}
      </div>
    </>
  );

  function focusNode(focusedNode) {
    setFocusedNode(focusedNode);
    setShowFocusedNode(true);
  }

  function onKeyDown(event) {
    if (isArrowRight(event) || isReturn(event)) {
      event.target.click();
    } else if (isArrowLeft(event)) {
      setShowFocusedNode(false);
    } else if (
      isArrowUp(event) &&
      !showFocusedNode &&
      getInteractiveElements(event.currentTarget).indexOf(event.target) === 0
    ) {
      //arrow up from first element in root menu
      searchElementRef?.current?.focus();
    } else {
      const nextElement = onArrowKeyDownFocusSiblings(event);
      if (nextElement) {
        const scrollPosition = staticContentWrapperRef?.current?.parentElement.scrollTop;
        const elementPosition = nextElement.offsetTop;
        if (elementPosition < scrollPosition + categoryHeight) {
          // element is at top but behind category, scroll to show element right under category
          staticContentWrapperRef?.current?.parentElement.scrollTo({
            top: elementPosition - categoryHeight,
            behavior: 'smooth'
          });
        }
      }
    }
  }
}

SelectorOverlay.propTypes = {
  options: nodeArrayPropType.isRequired,
  loading: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  withIcons: PropTypes.bool,
  query: PropTypes.string.isRequired,
  onQueryChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool
};
