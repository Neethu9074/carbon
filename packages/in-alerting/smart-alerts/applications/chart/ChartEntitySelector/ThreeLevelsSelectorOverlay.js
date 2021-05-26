/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React, { useState, useMemo, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

import { ListGroup, Li } from '@instana/components';
import { useObservable } from '@instana/hooks';

import { DynamicNode } from 'in-alerting/smart-alerts/applications/chart/ChartEntitySelector/DynamicNode';
import SlideInView, { ListHeader, NoHeader } from 'in-new-components/SlideInView/SlideInView';
import { nodeArray as nodeArrayPropType } from 'in-new-components/SelectorOverlay/props';
import { stopPropagationAndPreventDefault } from 'in-services/util/function';
import { onArrowKeyDownFocusSiblings } from 'in-services/util/domFocus';
import { LoadingIndicator } from 'in-new-components/LoadingIndicators';
import { search } from 'in-new-components/SelectorOverlay/search';
import { isNotBlank, isBlank } from 'in-services/util/string';
import { getInteractiveElements } from 'in-services/util/dom';
import SearchInput from 'in-new-components/SearchInput';
import { isLoading } from 'in-services/util/result';
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
    { focusedNode, showFocusedNode, secondFocusedNode, showSecondFocusedNode, loading, loading2ndLevel },
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

  // Keep a reference to search input
  const searchElementRef = useRef();

  const focusOnFirstResult = () => {
    const groups = getInteractiveElements(staticContentWrapperRef.current);
    groups[0]?.focus();
  };

  useObservable(
    focusedNode?.loadChildren &&
      (() =>
        focusedNode.loadChildren().map(result => {
          const loading = isLoading(result);
          const resolvedChildren = result?.data?.items;
          if (!loading && resolvedChildren) {
            focusedNode.children = resolvedChildren;
            focusedNode.loadChildren = undefined;

            setState({
              focusedNode,
              secondFocusedNode,
              showFocusedNode,
              showSecondFocusedNode
            });
          }
          return result;
        })),
    [focusedNode?.loadChildren]
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
        {MainSlideInView({
          showFocusedNode,
          showSecondFocusedNode,
          focusedNode,
          setState,
          onKeyDown,
          lastFocusedElementRef,
          staticContentWrapperRef,
          innerSlideInView: (
            <InnerSlideInView
              showFocusedNode={showFocusedNode}
              showSecondFocusedNode={showSecondFocusedNode}
              focusedNode={focusedNode}
              focus2ndLevelNode={focus2ndLevelNode}
              secondFocusedNode={secondFocusedNode}
              setState={setState}
              onKeyDown2={onKeyDown2}
              onKeyDown3={onKeyDown3}
              onChange={onChange}
              withIcons={withIcons}
              loading={loading}
              loading2ndLevel={loading2ndLevel}
            />
          ),
          level1StaticContent: <MainStaticContent {...{ options, focusNode, onChange, query, withIcons }} />
        })}
      </div>
    </>
  );

  function focusNode(focusedNode) {
    setState({
      loading: focusedNode.loadChildren && !focusedNode.children,
      focusedNode,
      secondLvlFocusedNode: null,
      showFocusedNode: true
    });
  }

  function focus2ndLevelNode(secondFocusedNode) {
    setState({
      loading2ndLevel: secondFocusedNode.loadChildren && !secondFocusedNode.children,
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

function MainStaticContent({ options, focusNode, onChange, query, withIcons }) {
  return options.slice(0, maxResults).map((node, i) => {
    const noChildren = !node.children || node.children.length === 0;
    if (noChildren && !node.loadChildren)
      return (
        <DynamicNode
          key={i}
          node={node}
          focusNode={focusNode}
          onChange={onChange}
          withIcons={isBlank(query) && withIcons}
          withBreadcrumbs={isNotBlank(query)}
        />
      );

    return (
      <ListGroup key={i} label={node.label} height={`${categoryHeight}px`} sticky>
        {node.children?.map((node, j) => (
          <DynamicNode key={j} node={node} focusNode={focusNode} onChange={onChange} withIcons={withIcons} />
        ))}
      </ListGroup>
    );
  });
}

function InnerSlideInView({
  focusedNode,
  showSecondFocusedNode,
  setState,
  secondFocusedNode,
  showFocusedNode,
  onKeyDown3,
  onChange,
  withIcons,
  loading,
  loading2ndLevel,
  focus2ndLevelNode,
  onKeyDown2
}) {
  const innerStaticRef = useRef();
  const innerSlideInRef = useRef();
  const lastFocusedElementLevel2Ref = useRef();

  useObservable(
    secondFocusedNode?.loadChildren &&
      (() =>
        secondFocusedNode.loadChildren().map(result => {
          const loading = isLoading(result);
          const resolvedChildren = result?.data?.items;
          if (!loading && resolvedChildren) {
            secondFocusedNode.children = resolvedChildren;
            //secondFocusedNode.loadChildren = undefined;

            setState({
              focusedNode,
              secondFocusedNode,
              showFocusedNode,
              showSecondFocusedNode
            });
          }
          return result;
        })),
    [secondFocusedNode?.loadChildren]
  );

  useEffect(() => {
    if (showSecondFocusedNode && !loading2ndLevel && secondFocusedNode?.children) {
      const groups = getInteractiveElements(innerSlideInRef.current);
      groups[0]?.focus();
    }
  }, [showSecondFocusedNode, loading2ndLevel, secondFocusedNode?.children]);

  useEffect(() => {
    if (!showSecondFocusedNode && !loading && focusedNode?.children) {
      getInteractiveElements(innerStaticRef.current)[0]?.focus();
    }
  }, [showSecondFocusedNode, loading, focusedNode?.children]);

  return (
    ((focusedNode?.children || focusedNode?.loadChildren) && (
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
          <div onKeyDown={onKeyDown3} ref={innerSlideInRef}>
            {loading2ndLevel && (
              <div className={locals.loading}>
                <Li noAlternatingBg className={locals.option}>
                  <LoadingIndicator
                    text={t('in-alerting:smartAlerts.components.smartAlertDialog.PreviewSelectLoadingEndpoints')}
                    className={locals.loading}
                  />
                </Li>
              </div>
            )}
            {secondFocusedNode?.children?.slice(0, maxResults).map((node, i) => (
              <DynamicNode
                key={i}
                node={node}
                onChange={onChange}
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
            ref={innerStaticRef}
          >
            {loading && (
              <div className={locals.loading}>
                <Li noAlternatingBg className={locals.option}>
                  <LoadingIndicator
                    text={t('in-alerting:smartAlerts.components.smartAlertDialog.PreviewSelectLoadingEndpoints')}
                    className={locals.loading}
                  />
                </Li>
              </div>
            )}
            {focusedNode?.children?.slice(0, maxResults).map((node, i) => (
              <DynamicNode
                key={i}
                node={node}
                focusNode={focus2ndLevelNode}
                onChange={onChange}
                withIcons={withIcons}
              />
            ))}
          </div>
        }
        enforceMaxHeightForStaticContent
      />
    )) ??
    null
  );
}

function MainSlideInView({
  showFocusedNode,
  setState,
  focusedNode,
  lastFocusedElementRef,
  showSecondFocusedNode,
  innerSlideInView,
  staticContentWrapperRef,
  onKeyDown,
  level1StaticContent
}) {
  return (
    <SlideInView
      showSlideInContent={showFocusedNode}
      onShowSlideInContentChange={() =>
        // slide out / close
        // from 2nd to 1st level
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
      slideInContent={innerSlideInView}
      staticContent={
        <div
          onFocus={e => {
            lastFocusedElementRef.current = e.target;
          }}
          ref={staticContentWrapperRef}
          onKeyDown={onKeyDown}
        >
          {level1StaticContent}
        </div>
      }
      enforceMaxHeightForStaticContent
    />
  );
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
