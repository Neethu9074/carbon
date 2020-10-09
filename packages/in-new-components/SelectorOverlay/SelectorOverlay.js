import React, { useState, useRef, useMemo } from 'react';
import PropTypes from 'prop-types';

import { nodeArray as nodeArrayPropType } from 'in-new-components/SelectorOverlay/props';
import SlideInView, { ListHeader } from 'in-new-components/SlideInView/SlideInView';
import { onArrowKeyDownFocusSiblings } from 'in-services/util/domFocus';
import { search } from 'in-new-components/SelectorOverlay/search';
import { getInteractiveElements } from 'in-services/util/dom';
import Node from 'in-new-components/SelectorOverlay/Node';
import SearchInput from 'in-new-components/SearchInput';
import keyCodes from 'in-components/keyCodes';

import locals from './SelectorOverlay.mless';
import { isNotBlank } from 'in-services/util/string';

const initialState = {
  query: '',
  focussedNode: null,
  focusOnNode: false
};

export default function SelectorOverlay({ options, onChange, withIcons = true }) {
  const [{ query, focussedNode, showFocussedNode }, setState] = useState(initialState);
  options = useMemo(() => {
    if (isNotBlank(query)) {
      return search(
        options.filter(level => level.searchable),
        query
      );
    }
    return options;
  }, [options, query]);

  // Used to jump to the first available group when clicking enter in the input field.
  const staticContentWrapperRef = useRef();
  // We use this ref to store the last element (either search or tag groups)
  // which received focus. This information is used when sliding out to restore
  // focus to whatever was focused beforehand.
  const lastFocusedElementRef = useRef();

  return (
    <>
      <div className={locals.searchInputWrapper}>
        <SearchInput
          placeholder="Search"
          onChange={_query => {
            setState({
              query: _query,
              focussedNode,
              showFocussedNode: false
            });
          }}
          query={query}
          autoFocus
          className={locals.searchInput}
          onReturn={() => {
            const groups = getInteractiveElements(staticContentWrapperRef.current);
            groups[0]?.focus();
            if (groups.length === 1) {
              groups[0].click();
            }
          }}
        />
      </div>
      <div className={locals.overlay}>
        <SlideInView
          showSlideInContent={showFocussedNode}
          onShowSlideInContentChange={() =>
            setState({
              query,
              focussedNode,
              showFocussedNode: false
            })
          }
          onAfterSlideOut={() => {
            lastFocusedElementRef.current?.focus();
          }}
          HeaderComponent={ListHeader}
          slideTransitionDurationMillis={250}
          slideInContentTitle={focussedNode?.label}
          slideInContent={
            focussedNode?.children && (
              <div onKeyDown={onKeyDown}>
                {focussedNode?.children.map((node, i) => (
                  <Node
                    key={i}
                    node={node}
                    focusNode={focusNode}
                    onChange={onChange}
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
              {options.map((node, i) => (
                <Node
                  key={i}
                  node={node}
                  focusNode={focusNode}
                  onChange={onChange}
                  asListGroup
                  withIcons={withIcons}
                  withBreadcrumbs={isNotBlank(query)}
                />
              ))}
            </div>
          }
          enforceMaxHeightForStaticContent
        />
      </div>
    </>
  );

  function focusNode(focussedNode) {
    setState({
      query: '',
      focussedNode,
      showFocussedNode: true
    });
  }

  function onKeyDown(event) {
    // keyCode is deprecated and code is not yet supported everywhere
    const code = event.code ?? event.keyCode;
    if (code === keyCodes.arrows.right) {
      event.target.click();
    } else if (code === keyCodes.arrows.left) {
      setState({
        query,
        focussedNode,
        showFocussedNode: false
      });
    } else {
      onArrowKeyDownFocusSiblings(event);
    }
  }
}

SelectorOverlay.propTypes = {
  options: nodeArrayPropType.isRequired,
  onChange: PropTypes.func.isRequired,
  withIcons: PropTypes.bool,
  nonSearchableOptions: nodeArrayPropType
};
