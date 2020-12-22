import React from 'react';

import DraggableItemSelector from 'in-new-components/DraggableItemSelector';
import DropdownButton from 'in-new-components/Button/DropdownButton';
import { allAvailableTags } from 'in-logging/navigation/tags';
import Overlay from 'in-new-components/overlays/Overlay';
import { Ul, Li } from 'in-new-components/lists/List';
import { compare } from 'in-services/util/string';
import Button from 'in-new-components/Button';

import locals from './TagSelector.mless';

export default function TagSelector({
  maxSelectableTags = Number.MAX_VALUE,
  onSelectedTagsChange,
  selectedTags,
  compact
}) {
  return (
    <Overlay
      content={TagSelectorOverlay}
      props={{ selectedTags, maxSelectableTags, onSelectedTagsChange }}
      withoutWrapper
    >
      {({ toggle, refSetter }) =>
        compact ? (
          <Button size="compact" kind="secondary" icon="lib_actions_settings" refSetter={refSetter} onClick={toggle} />
        ) : (
          <DropdownButton kind="secondary" icon="lib_actions_settings" refSetter={refSetter} onClick={toggle}>
            Select tags
          </DropdownButton>
        )
      }
    </Overlay>
  );
}

function TagSelectorOverlay({ selectedTags, onSelectedTagsChange, maxSelectableTags }) {
  selectedTags = selectedTags.slice();
  selectedTags.sort(compare);

  const remainingTags = allAvailableTags.filter(tag => selectedTags.indexOf(tag) === -1);

  return (
    <DraggableItemSelector
      items={selectedTags.map(label => ({ label }))}
      Content={Content}
      onSwap={onSwap}
      onRemove={({ label }) => onSelectedTagsChange(selectedTags.filter(_tag => _tag !== label))}
      SlideInContent={TagList}
      slideInContentTitle="Add a tag"
      disabled={remainingTags.length === 0 || selectedTags.length >= maxSelectableTags}
      onSelectedTagsChange={onSelectedTagsChange}
      remainingTags={remainingTags}
      selectedTags={selectedTags}
    />
  );
}

function onSwap() {}

function TagList({ remainingTags, selectedTags, onSelectedTagsChange, onShowSlideInContentChange }) {
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
          {tag}
        </Li>
      ))}
    </Ul>
  );
}

function Content({ item }) {
  return <span className={locals.label}>{item.label}</span>;
}
