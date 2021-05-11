/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useEffect } from 'react';

import { Button } from '@instana/components';
import { Ul, Li } from '@instana/components';

import DraggableItemSelector from 'in-new-components/DraggableItemSelector';
import { selectedChanged } from 'in-logging/analyze/AnalyzeView/tracker';
import DropdownButton from 'in-new-components/Button/DropdownButton';
import Overlay from 'in-new-components/overlays/Overlay';
import { compare } from 'in-services/util/string';
import { t } from 'in-i18n';

import locals from './TagSelector.mless';

export default function TagSelector(props) {
  const {
    maxSelectableTags = Number.MAX_VALUE,
    onSelectedTagsChange,
    filteringTagCatalog,
    selectedTags,
    compact
  } = props;

  const tagCatalog = filteringTagCatalog?.tags ?? [];
  const tagTree = filteringTagCatalog?.tagTree ?? [];

  useEffect(() => {
    selectedChanged({ selectedTags });
  }, [
    selectedTags
      .slice()
      .sort()
      .join()
  ]);

  return (
    <Overlay
      content={TagSelectorOverlay}
      props={{ selectedTags, maxSelectableTags, onSelectedTagsChange, tagCatalog, tagTree }}
      withoutWrapper
    >
      {({ toggle, refSetter }) =>
        compact ? (
          <Button size="compact" kind="secondary" icon="lib_actions_settings" refSetter={refSetter} onClick={toggle} />
        ) : (
          <DropdownButton kind="secondary" icon="lib_actions_settings" refSetter={refSetter} onClick={toggle}>
            {t('in-logging:selectTags')}
          </DropdownButton>
        )
      }
    </Overlay>
  );
}

function TagSelectorOverlay({ selectedTags, onSelectedTagsChange, maxSelectableTags, tagCatalog, tagTree }) {
  selectedTags = selectedTags.slice();
  selectedTags.sort(compare);

  const allAvailableTags = tagCatalog.filter(isAllowedLogTag).map(mapToName);
  const remainingTags = allAvailableTags.filter(tag => selectedTags.indexOf(tag) === -1);

  return (
    <DraggableItemSelector
      items={selectedTags.map(name => ({ name }))}
      Content={Content}
      tagCatalog={tagCatalog}
      tagTree={tagTree}
      onRemove={({ name }) => onSelectedTagsChange(selectedTags.filter(_tag => _tag !== name))}
      SlideInContent={TagList}
      slideInContentTitle={t('in-logging:addATag')}
      disabled={remainingTags.length === 0 || selectedTags.length >= maxSelectableTags}
      onSelectedTagsChange={onSelectedTagsChange}
      remainingTags={remainingTags}
      selectedTags={selectedTags}
    />
  );
}

function mapToName({ name }) {
  return name;
}

function isAllowedLogTag({ name }) {
  return name !== 'log.message';
}

function TagList({
  remainingTags,
  selectedTags,
  onSelectedTagsChange,
  onShowSlideInContentChange,
  tagCatalog,
  tagTree
}) {
  return (
    <Ul>
      {remainingTags.map(tag => (
        <Li
          key={tag}
          onClick={() => {
            onSelectedTagsChange(selectedTags.concat(tag));
            onShowSlideInContentChange(false);
          }}
        >
          {getLabelFromTreeOrCatalog(tag, tagCatalog, tagTree)}
        </Li>
      ))}
    </Ul>
  );
}

function Content({ item, tagCatalog, tagTree }) {
  return <span className={locals.label}>{getLabelFromTreeOrCatalog(item.name, tagCatalog, tagTree)}</span>;
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
