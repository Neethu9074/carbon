/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useEffect, useState } from 'react';

import { ColumnizedContent, Ul, Li } from '@instana/components';

import { compareIgnoreCase, containsIgnoreCase } from 'in-services/util/string';
import { selectedChanged } from 'in-logging/analyze/AnalyzeView/tracker';
import DropdownButton from 'in-components/Button/DropdownButton';
import CheckboxFancy from 'in-components/form/CheckboxFancy';
import { LOG_MESSAGE } from 'in-logging/queryBuilder';
import Overlay from 'in-components/overlays/Overlay';
import SearchInput from 'in-components/SearchInput';
import { t } from 'in-i18n';

import locals from './TagSelector.mless';

const columnDefinitions = [
  {
    id: 'check',
    width: '2.25rem',
    sortable: false,
    getContent({ isSelected }) {
      return <CheckboxFancy checked={isSelected} onChange={() => {}} />;
    }
  },
  {
    id: 'label',
    sortable: false,
    getContent({ tag, tagCatalog, tagTree }) {
      return <div className={locals.label}> {getLabelFromTreeOrCatalog(tag, tagCatalog, tagTree)}</div>;
    }
  }
];

export default function TagSelector(props) {
  const { onSelectedTagsChange, filteringTagCatalog, selectedTags: initialSelectedTags } = props;
  const [selectedTags, setSelectedTags] = useState(initialSelectedTags);

  const tagCatalog = filteringTagCatalog?.tags ?? [];
  const tagTree = filteringTagCatalog?.tagTree ?? [];

  useTracking(selectedTags);

  return (
    <Overlay
      content={TagSelectorOverlay}
      props={{ selectedTags, setSelectedTags, tagCatalog, tagTree }}
      withoutWrapper
      onCloseSideEffect={() => onSelectedTagsChange(selectedTags)}
    >
      {({ toggle, refSetter }) => (
        <DropdownButton kind="secondary" icon="lib_actions_settings" refSetter={refSetter} onClick={toggle}>
          {t('in-logging:selectTags')}
        </DropdownButton>
      )}
    </Overlay>
  );
}

function TagSelectorOverlay({ selectedTags, setSelectedTags, tagCatalog, tagTree }) {
  const [query, setQuery] = useState('');

  const allAvailableTags = tagCatalog
    .filter(isAllowedLogTag)
    .filter(({ name }) => containsIgnoreCase(name, query))
    .map(mapToName)
    .sort(compareIgnoreCase);

  return (
    <div>
      <div className={locals.header}>
        <SearchInput className={locals.searchInput} onChange={setQuery} query={query} autoFocus />
      </div>

      <Ul className={locals.list}>
        {allAvailableTags.map(tag => {
          const isSelected = selectedTags.includes(tag);
          return (
            <Li
              key={tag}
              onClick={() => {
                setSelectedTags(isSelected ? selectedTags.filter(t => t !== tag) : [...selectedTags, tag]);
              }}
            >
              <ColumnizedContent
                columnDefinitions={columnDefinitions}
                tag={tag}
                tagCatalog={tagCatalog}
                tagTree={tagTree}
                selectedTags={selectedTags}
                isSelected={isSelected}
              />
            </Li>
          );
        })}
      </Ul>
    </div>
  );
}

function mapToName({ name }) {
  return name;
}

function isAllowedLogTag({ name }) {
  return name !== LOG_MESSAGE;
}

function getLabelFromTreeOrCatalog(name, tagCatalog, tagTree) {
  for (let i = 0; i < tagTree.length; i++) {
    const match = getLabelFromTree(name, tagTree[i], []);
    if (match) {
      return `${match.path.join('.')}.${match.label}`;
    }
  }

  for (let i = 0; i < tagCatalog.length; i++) {
    const item = tagCatalog[i];
    if (item.name === name) {
      return item.label;
    }
  }
  return name;
}

function getLabelFromTree(name, tagTree, path) {
  if (tagTree.type === 'TAG' && tagTree.tagName === name) {
    return { path, label: tagTree.label };
  } else if (tagTree.type === 'LEVEL') {
    for (let i = 0; i < tagTree.children.length; i++) {
      const match = getLabelFromTree(name, tagTree.children[i], [...path, tagTree.label]);
      if (match) {
        return match;
      }
    }
  }
}

function useTracking(sortedTags) {
  useEffect(() => selectedChanged({ sortedTags }), [sortedTags.join()]);
}
