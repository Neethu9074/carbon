/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

import { ListGroup, Li, keyCodes } from '@instana/components';

import useLazyLoadingOfNodeChildren from 'in-alerting/smart-alerts/applications/chart/ChartEntitySelector/useLazyLoadingOfNodeChildren';
import EntityItemNode from 'in-alerting/smart-alerts/applications/chart/ChartEntitySelector/EntityItemNode';
import SlideInView, { ListHeader, NoHeader } from 'in-components/SlideInView/SlideInView';
import { nodeArray as nodeArrayPropType } from 'in-components/SelectorOverlay/props';
import { stopPropagationAndPreventDefault } from 'in-services/util/function';
import { onArrowKeyDownFocusSiblings } from 'in-services/util/domFocus';
import { LoadingIndicator } from 'in-components/LoadingIndicators';
import NoDataAvailable from 'in-components/Errors/NoDataAvailable';
import { isNotBlank, isBlank } from 'in-services/util/string';
import { getInteractiveElements } from 'in-services/util/dom';
import useDebouncedValue from 'in-hooks/useDebouncedValue';
import SearchInput from 'in-components/SearchInput';
import { t } from 'in-i18n';

import threeLevelsSelectorLocals from './ThreeLevelsSelectorOverlay.mless';
import locals from 'in-components/SelectorOverlay/SelectorOverlay.mless';

const { isArrowRight, isReturn, isArrowLeft, isArrowUp } = keyCodes;

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

export default function ThreeLevelsSelectorOverlay({ options, onChange, query, onQueryChange }) {
  const [
    { focusedNode, showFocusedNode, secondFocusedNode, showSecondFocusedNode, loading, loading2ndLevel },
    setState
  ] = useState(initialState);

  useEffect(() => {
    if (!searchEnabled) focusOnFirstResult();
  });

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

  function triggerRenderingAfterUpdated(updatedNode) {
    // only re-render if currently in focus:
    if (updatedNode === focusedNode || updatedNode === secondFocusedNode)
      setState({
        focusedNode,
        secondFocusedNode,
        showFocusedNode,
        showSecondFocusedNode,
        loading: updatedNode === focusedNode ? false : loading,
        loading2ndLevel: updatedNode === secondFocusedNode ? false : loading2ndLevel
      });
  }

  useLazyLoadingOfNodeChildren(focusedNode, triggerRenderingAfterUpdated);

  return (
    <>
      {searchEnabled && (
        <div className={locals.searchInputWrapper}>
          <EntitiesSearchInput
            placeholder={t('in-components:selectorOverlay.placeholderSearch')}
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
      <div className={threeLevelsSelectorLocals.wide}>
        <MainSlideInView
          {...{
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
                focusNode={focusNode}
                focus2ndLevelNode={focus2ndLevelNode}
                secondFocusedNode={secondFocusedNode}
                setState={setState}
                onKeyDown2={onKeyDown2}
                onKeyDown3={onKeyDown3}
                onChange={onChange}
                triggerRenderingAfterUpdated={triggerRenderingAfterUpdated}
                loading={loading}
                loading2ndLevel={loading2ndLevel}
              />
            ),
            mainStaticContent: <MainStaticContent {...{ options, focusNode, onChange, query }} />
          }}
        />
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
    if (isArrowRight(event) || isReturn(event)) {
      // remember last selection
      stopPropagationAndPreventDefault(event);
      event.target.click();
    } else if (isArrowLeft(event)) {
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

function MainStaticContent({ options, focusNode, onChange, query }) {
  if (options.length === 0) {
    return <NoDataAvailable />;
  }

  const asSearchResult = isNotBlank(query);
  return options.map((node, i) => {
    const noChildren = !node.children || node.children.length === 0;
    if (noChildren && !node.loadChildren)
      return (
        <EntityItemNode
          key={i}
          node={node}
          focusNode={focusNode}
          onChange={onChange}
          withIcons={isBlank(query)}
          asSearchResult={asSearchResult}
        />
      );

    return (
      <ListGroup key={i} label={node.label} height={`${categoryHeight}px`} sticky>
        {node.children?.map((node, j) => (
          <EntityItemNode
            key={j}
            node={node}
            focusNode={focusNode}
            onChange={onChange}
            asSearchResult={asSearchResult}
            withIcons
          />
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
  triggerRenderingAfterUpdated,
  loading,
  loading2ndLevel,
  focus2ndLevelNode,
  onKeyDown2
}) {
  const innerStaticRef = useRef();
  const innerSlideInRef = useRef();
  const lastFocusedElementLevel2Ref = useRef();

  useLazyLoadingOfNodeChildren(secondFocusedNode, triggerRenderingAfterUpdated);

  useEffect(() => {
    if (showSecondFocusedNode && !loading2ndLevel && secondFocusedNode?.children) {
      getInteractiveElements(innerSlideInRef.current)[0]?.focus();
    }
  }, [showSecondFocusedNode, loading2ndLevel, secondFocusedNode?.children]);

  useEffect(() => {
    if (!showSecondFocusedNode && !loading && focusedNode?.children) {
      getInteractiveElements(innerStaticRef.current)[0]?.focus();
    }
  }, [showSecondFocusedNode, loading, focusedNode?.children]);

  const hasChildren = focusedNode?.children || focusedNode?.loadChildren;
  return (
    (hasChildren && (
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
            <Loading loading={loading2ndLevel} />
            {secondFocusedNode?.children?.slice(0, maxResults).map((node, i) => (
              <EntityItemNode key={i} node={node} onChange={onChange} focusNode={focus2ndLevelNode} withIcons />
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
            <Loading loading={loading} />
            {focusedNode?.children?.slice(0, maxResults).map((node, i) => (
              <EntityItemNode key={i} node={node} focusNode={focus2ndLevelNode} onChange={onChange} withIcons />
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
  mainStaticContent
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
          {mainStaticContent}
        </div>
      }
      enforceMaxHeightForStaticContent
    />
  );
}

function EntitiesSearchInput({ query = '', onChange, ...props }) {
  const { value, onChange: debouncedOnChange } = useDebouncedValue(
    query,
    value => {
      onChange?.(value);
    },
    300
  );
  return <SearchInput onChange={debouncedOnChange} query={value} {...props} />;
}

function Loading({ loading }) {
  if (!loading) {
    return null;
  }
  return (
    <div className={locals.loading}>
      <Li noAlternatingBg className={locals.option}>
        <LoadingIndicator
          text={t('in-alerting:smartAlerts.components.smartAlertDialog.PreviewSelectLoadingEndpoints')}
          className={locals.loading}
        />
      </Li>
    </div>
  );
}

ThreeLevelsSelectorOverlay.propTypes = {
  options: nodeArrayPropType.isRequired,
  onChange: PropTypes.func.isRequired,
  query: PropTypes.string.isRequired,
  onQueryChange: PropTypes.func.isRequired
};
