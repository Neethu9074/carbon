import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';

import SlideInView, { ListHeader } from 'in-new-components/SlideInView/SlideInView';
import TreeNodeList from 'in-new-components/TagSelectorOverlay/TreeNodeList';
import TagTree from 'in-new-components/TagSelectorOverlay/TagTree';
import ExternalSearchInput from 'in-new-components/SearchInput';
import { getInteractiveElements } from 'in-services/util/dom';

import locals from './TagSelectorOverlay.mless';

const initialState = {
  query: '',
  activeGroup: null,
  showGroup: false
};

export default function TagSelectorOverlay({ tagCatalog, onChange, close }) {
  const [{ query, activeGroup, showGroup }, setState] = useState(initialState);
  // Used to jump to the first available group when clicking enter in the
  // input field.
  const staticContentWrapperRef = useRef();
  // We use this ref to store the last element (either search or tag groups)
  // which received focus. This information is used when sliding out to restore
  // focus to whatever was focused beforehand.
  const lastFocusedElementRef = useRef();

  return (
    <>
      <div className={locals.searchInputWrapper}>
        <ExternalSearchInput
          placeholder="Search"
          onChange={_query => {
            setState({
              query: _query,
              activeGroup,
              showGroup: false
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
          onFocus={e => {
            lastFocusedElementRef.current = e.target;
          }}
        />
      </div>
      <div className={locals.overlay}>
        <SlideInView
          showSlideInContent={activeGroup && showGroup}
          onShowSlideInContentChange={() =>
            setState({
              query,
              activeGroup,
              showGroup: false
            })
          }
          onAfterSlideOut={() => {
            lastFocusedElementRef.current?.focus();
          }}
          HeaderComponent={ListHeader}
          slideTransitionDurationMillis={250}
          slideInContentTitle={activeGroup?.label}
          slideInContent={
            activeGroup?.children && (
              <TreeNodeList
                nodes={activeGroup.children}
                onChange={onChangeTag}
                onSlideOut={() =>
                  setState({
                    query,
                    activeGroup,
                    showGroup: false
                  })
                }
                close={close}
              />
            )
          }
          staticContent={
            <div
              onFocus={e => {
                lastFocusedElementRef.current = e.target;
              }}
            >
              <TagTree
                tagCatalog={tagCatalog}
                query={query}
                onChange={newActiveGroup =>
                  setState({
                    query,
                    activeGroup: newActiveGroup,
                    showGroup: true
                  })
                }
                onChangeTag={onChangeTag}
                close={close}
                ref={staticContentWrapperRef}
              />
            </div>
          }
          enforceMaxHeightForStaticContent
        />
      </div>
    </>
  );

  function onChangeTag(selectedNode) {
    onChange(selectedNode);
    setState({
      query,
      activeGroup,
      showGroup: false
    });
  }
}

TagSelectorOverlay.propTypes = {
  tagCatalog: PropTypes.any.isRequired,
  onChange: PropTypes.func.isRequired,
  close: PropTypes.func.isRequired
};
