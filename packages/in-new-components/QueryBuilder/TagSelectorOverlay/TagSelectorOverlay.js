import React, { useState } from 'react';
import PropTypes from 'prop-types';

import ConjunctionsAndBrackets from 'in-new-components/QueryBuilder/TagSelectorOverlay/ConjunctionsAndBrackets';
import TreeNodeList from 'in-new-components/QueryBuilder/TagSelectorOverlay/TreeNodeList';
import SlideInView, { ListHeader } from 'in-new-components/SlideInView/SlideInView';
import TagTree from 'in-new-components/QueryBuilder/TagSelectorOverlay/TagTree';
import ExternalSearchInput from 'in-new-components/SearchInput';

import locals from './TagSelectorOverlay.mless';

export default function TagSelectorOverlay({ tagCatalog, onChange, close }) {
  const [query, setQuery] = useState('');
  const [activeGroup, setActiveGroup] = useState(null);

  return (
    <div>
      <div className={locals.searchInputWrapper}>
        <ExternalSearchInput
          placeholder="Search"
          onChange={_query => {
            setQuery(_query);
            setActiveGroup(null);
          }}
          query={query}
          autoFocus
        />
      </div>
      <div className={locals.overlay}>
        <SlideInView
          showSlideInContent={!!activeGroup}
          onShowSlideInContentChange={() => setActiveGroup(null)}
          HeaderComponent={ListHeader}
          transitionDurationMillis={250}
          slideInContentTitle={activeGroup?.label}
          slideInContent={
            activeGroup?.children && (
              <TreeNodeList
                nodes={activeGroup.children}
                onChange={selectedNode => {
                  onChange(selectedNode);
                  setActiveGroup(null);
                }}
                close={close}
              />
            )
          }
          staticContent={
            <div className={locals.content}>
              <ConjunctionsAndBrackets
                onChange={v => {
                  onChange(v);
                  close();
                }}
              />

              <TagTree tagCatalog={tagCatalog} query={query} onChange={setActiveGroup} close={close} />
            </div>
          }
        />
      </div>
    </div>
  );
}

TagSelectorOverlay.propTypes = {
  tagCatalog: PropTypes.any.isRequired,
  onChange: PropTypes.func.isRequired,
  close: PropTypes.func.isRequired
};
