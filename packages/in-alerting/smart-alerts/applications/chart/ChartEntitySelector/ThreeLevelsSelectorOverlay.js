/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React, { useState, useMemo, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

import { DynamicNode } from 'in-alerting/smart-alerts/applications/chart/ChartEntitySelector/DynamicNode';
import SlideInView, { ListHeader, NoHeader } from 'in-new-components/SlideInView/SlideInView';
import { nodeArray as nodeArrayPropType } from 'in-new-components/SelectorOverlay/props';
import { stopPropagationAndPreventDefault } from 'in-services/util/function';
import { onArrowKeyDownFocusSiblings } from 'in-services/util/domFocus';
import { search } from 'in-new-components/SelectorOverlay/search';
import { isNotBlank, isBlank } from 'in-services/util/string';
import { getInteractiveElements } from 'in-services/util/dom';
import SearchInput from 'in-new-components/SearchInput';
import keyCodes from 'in-components/keyCodes';
import { t } from 'in-i18n';

import locals from 'in-new-components/SelectorOverlay/SelectorOverlay.mless';

/* we found the current implementation does not fully work with latest, on-demand loading items,
 * so this is temporary disabled
 * There is this follow-up task to implement it in a different way:
 * https://instana.kanbanize.com/ctrl_board/37/cards/57241
 */
const searchEnabled = false;

const initialState = {
  focusedNode: null,
  showFocusedNode: false,
  secondFocusedNode: null,
  showSecondFocusedNode: false
};

const categoryHeight = 40;
// for performance reasons limit number of results shown as rendering is slow for high number of results
const maxResults = 100;

export default function ThreeLevelsSelectorOverlay({
  options,
  onChange,
  withIcons = true,
  query,
  searchNodes = search,
  onQueryChange
}) {
  const [
    { focusedNode, showFocusedNode: showFocusedNode, secondFocusedNode, showSecondFocusedNode },
    setState
  ] = useState(initialState);

  useEffect(() => {
    focusOnFirstResult();
  });

  options = useMemo(() => {
    if (isNotBlank(query)) {
      return searchNodes(options, query);
    }
    return options;
    // changing searchNodes should not trigger a new result-calculation
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options, query]);

  // Used to jump to the first available group when clicking enter in the input field.
  const staticContentWrapperRef = useRef();
  // We use this ref to store the last element (either search or tag groups)
  // which received focus. This information is used when sliding out to restore
  // focus to whatever was focused beforehand.
  const lastFocusedElementRef = useRef();
  const lastFocusedElementLevel2Ref = useRef();

  // Keep a reference to search input
  const searchElementRef = useRef();

  const focusOnFirstResult = () => {
    const groups = getInteractiveElements(staticContentWrapperRef.current);
    groups[0]?.focus();
  };

  const innerSlideInContent = focusedNode?.children && (
    <SlideInView
      showSlideInContent={showSecondFocusedNode}
      onShowSlideInContentChange={() =>
        // slide out / close
        // from 3rd to 2nd level
        setState({
          focusedNode,
          secondFocusedNode,
          showFocusedNode,
          showSecondFocusedNode: false
        })
      }
      onAfterSlideOut={() => {
        lastFocusedElementLevel2Ref.current?.focus();
      }}
      HeaderComponent={ListHeader}
      slideTransitionDurationMillis={250}
      slideInContentTitle={secondFocusedNode?.label}
      slideInContent={
        <div onKeyDown={onKeyDown3}>
          {secondFocusedNode?.children.slice(0, maxResults).map((node, i) => (
            <DynamicNode
              key={i}
              node={node}
              onChange={onChange}
              asListGroup={false}
              withIcons={withIcons}
              focusNode={focus2ndLevelNode}
            />
          ))}
        </div>
      }
      staticContent={
        <div
          onFocus={e => {
            lastFocusedElementLevel2Ref.current = e.target;
          }}
          onKeyDown={onKeyDown2}
        >
          {focusedNode?.children.slice(0, maxResults).map((node, i) => (
            <DynamicNode
              key={i}
              node={node}
              focusNode={focus2ndLevelNode}
              onChange={onChange}
              asListGroup={false}
              withIcons={withIcons}
            />
          ))}
        </div>
      }
      enforceMaxHeightForStaticContent
    />
  );

  return (
    <>
      {searchEnabled && (
        <div className={locals.searchInputWrapper}>
          <SearchInput
            placeholder={t('in-new-components:selectorOverlay.placeholderSearch')}
            onChange={_query => {
              onQueryChange(_query);
              setState({
                focusedNode,
                showFocusedNode: false
              });
            }}
            query={query}
            autoFocus
            className={locals.searchInput}
            onReturn={focusOnFirstResult}
            onArrowDown={focusOnFirstResult}
            inputRef={searchElementRef}
          />
        </div>
      )}
      <div className={locals.overlay}>
        <SlideInView
          showSlideInContent={showFocusedNode}
          onShowSlideInContentChange={() =>
            setState({
              focusedNode,
              showFocusedNode: false
            })
          }
          onAfterSlideOut={() => {
            lastFocusedElementRef.current?.focus();
          }}
          HeaderComponent={showSecondFocusedNode ? NoHeader : ListHeader}
          slideTransitionDurationMillis={250}
          slideInContentTitle={focusedNode?.label}
          slideInContent={innerSlideInContent}
          staticContent={
            <div
              onFocus={e => {
                lastFocusedElementRef.current = e.target;
              }}
              ref={staticContentWrapperRef}
              onKeyDown={onKeyDown}
            >
              {options.slice(0, maxResults).map((node, i) => (
                <DynamicNode
                  key={i}
                  node={node}
                  focusNode={focusNode}
                  onChange={onChange}
                  asListGroup
                  withIcons={isBlank(query) && withIcons}
                  withBreadcrumbs={isNotBlank(query)}
                  height={`${categoryHeight}px`}
                />
              ))}
            </div>
          }
          enforceMaxHeightForStaticContent
        />
      </div>
    </>
  );

  function focusNode(focusedNode) {
    setState({
      focusedNode,
      secondLvlFocusedNode: null,
      showFocusedNode: true
    });
  }

  function focus2ndLevelNode(secondFocusedNode) {
    setState({
      secondFocusedNode,
      showSecondFocusedNode: true,
      focusedNode,
      showFocusedNode: true
    });
  }

  function onKeyDown3(event) {
    onKeyDown(event, 3);
  }

  function onKeyDown2(event) {
    onKeyDown(event, 2);
  }

  function onKeyDown(event, level123) {
    // keyCode is deprecated and code is not yet supported everywhere
    const code = event.code ?? event.keyCode;
    if (code === keyCodes.arrows.right || code === keyCodes.enter) {
      // remember last selection
      stopPropagationAndPreventDefault(event);
      event.target.click();
    } else if (code === keyCodes.arrows.left) {
      stopPropagationAndPreventDefault(event);
      if (level123 === 2)
        setState({
          focusedNode,
          showFocusedNode: false
        });
      else if (level123 === 3)
        setState({
          focusedNode,
          secondFocusedNode,
          showSecondFocusedNode: false,
          showFocusedNode: true
        });
    } else if (
      code === keyCodes.arrows.up &&
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

ThreeLevelsSelectorOverlay.propTypes = {
  options: nodeArrayPropType.isRequired,
  onChange: PropTypes.func.isRequired,
  withIcons: PropTypes.bool,
  query: PropTypes.string.isRequired,
  /**
   * function (nodes:[node], query:string): [node]
   * default: in-new-components/SelectorOverlay/search
   */
  searchNodes: PropTypes.func,
  onQueryChange: PropTypes.func.isRequired
};
