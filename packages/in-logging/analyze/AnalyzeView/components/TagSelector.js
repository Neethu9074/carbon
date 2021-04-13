/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useEffect } from 'react';

import DraggableItemSelector from 'in-new-components/DraggableItemSelector';
import { selectedChanged } from 'in-logging/analyze/AnalyzeView/tracker';
import DropdownButton from 'in-new-components/Button/DropdownButton';
import Overlay from 'in-new-components/overlays/Overlay';
import { Ul, Li } from 'in-new-components/lists/List';
import { compare } from 'in-services/util/string';
import Button from 'in-new-components/Button';
import { t } from 'in-i18n';

import locals from './TagSelector.mless';

export default function TagSelector({
  maxSelectableTags = Number.MAX_VALUE,
  onSelectedTagsChange,
  filteringTagCatalog,
  selectedTags,
  compact
}) {
  const tagCatalog = filteringTagCatalog?.tags ?? [];

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
      props={{ selectedTags, maxSelectableTags, onSelectedTagsChange, tagCatalog }}
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

function TagSelectorOverlay({ selectedTags, onSelectedTagsChange, maxSelectableTags, tagCatalog }) {
  selectedTags = selectedTags.slice();
  selectedTags.sort(compare);

  const allAvailableTags = tagCatalog.filter(isAllowedLogTag).map(mapToName);
  const remainingTags = allAvailableTags.filter(tag => selectedTags.indexOf(tag) === -1);

  return (
    <DraggableItemSelector
      items={selectedTags.map(name => ({ name }))}
      Content={Content}
      onSwap={onSwap}
      tagCatalog={tagCatalog}
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

function onSwap() {}

function TagList({ remainingTags, selectedTags, onSelectedTagsChange, onShowSlideInContentChange, tagCatalog }) {
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
          {getLabelFromCatalog(tag, tagCatalog)}
        </Li>
      ))}
    </Ul>
  );
}

function Content({ item, tagCatalog }) {
  return <span className={locals.label}>{getLabelFromCatalog(item.name, tagCatalog)}</span>;
}

function getLabelFromCatalog(name, tagCatalog) {
  for (let i = 0; i < tagCatalog.length; i++) {
    const item = tagCatalog[i];
    if (item.name === name) {
      return item.label;
    }
  }
  return name;
}
