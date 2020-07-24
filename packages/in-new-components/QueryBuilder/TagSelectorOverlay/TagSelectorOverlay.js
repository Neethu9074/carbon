import React, { useState } from 'react';
import PropTypes from 'prop-types';

import ConjunctionsAndBrackets from 'in-new-components/QueryBuilder/TagSelectorOverlay/ConjunctionsAndBrackets';
import TreeNodeList from 'in-new-components/QueryBuilder/TagSelectorOverlay/TreeNodeList';
import SlideInView, { ListHeader } from 'in-new-components/SlideInView/LocalSlideInView';
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
          title={activeGroup?.label}
          slideIn={!!activeGroup}
          HeaderComponent={ListHeader}
          sliderContent={
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
          onTitleIconClick={() => setActiveGroup(null)}
        >
          <div className={locals.content}>
            <ConjunctionsAndBrackets
              onChange={v => {
                onChange(v);
                close();
              }}
            />

            {/* {__DEV__ && (
              <>
                <Ul className={locals.filterList} framed={false} borderRadius="medium">
                  <PreviousUsedFilter filter="foo AND bar" onClick={() => {}} />
                </Ul>

                <ListGroup label="Recently Used">
                  <OverlayOption className={locals.option} onChange={onChange} close={close} value="foobar">
                    foobar
                  </OverlayOption>
                </ListGroup>
              </>
            )} */}

            {!activeGroup && <TagTree tagCatalog={tagCatalog} query={query} onChange={setActiveGroup} close={close} />}
          </div>
        </SlideInView>
      </div>
    </div>
  );
}

TagSelectorOverlay.propTypes = {
  tagCatalog: PropTypes.any.isRequired,
  onChange: PropTypes.func.isRequired,
  close: PropTypes.func.isRequired
};
