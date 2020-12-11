import React from 'react';

import DraggableItemSelector from 'in-new-components/DraggableItemSelector';
import DropdownButton from 'in-new-components/Button/DropdownButton';
import { allAvailableTags } from 'in-logging/navigation/tags';
import Overlay from 'in-new-components/overlays/Overlay';
import { Ul, Li } from 'in-new-components/lists/List';
import { compare } from 'in-services/util/string';

import locals from './TagSelector.mless';

export default function TagSelector({ selectedTags, onSelectedTagsChange }) {
  return (
    <Overlay content={TagSelectorOverlay} props={{ selectedTags, onSelectedTagsChange }} withoutWrapper>
      {({ toggle, ref }) => (
        <DropdownButton ref={ref} kind="secondary" icon="lib_actions_settings" onClick={toggle}>
          Select tags
        </DropdownButton>
      )}
    </Overlay>
  );
}

function TagSelectorOverlay({ selectedTags, onSelectedTagsChange }) {
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
      disabled={remainingTags.length === 0}
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
