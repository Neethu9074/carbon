import React from 'react';

import ExpandableCard from 'in-new-components/ExpandableCard';
import Select from 'in-components/form/Select';

import locals from './EntryContent.mless';

export default function EntryContent(props) {
  const selectedSubEntryIndex = props.selectedSubEntryIndex || 0;
  const { entry, onSubEntrySelected, onEntrySelected } = props;
  const entryToDisplay = entry.subTechnologies ? entry.subTechnologies[selectedSubEntryIndex] : entry;

  return (
    <ExpandableCard
      className={locals.card}
      framed={false}
      openByDefault
      title={<span className={locals.title}>{entry.fullLabel || entry.label}</span>}
      titleSubText={
        entry.subTechnologies && (
          <SubTechnologiesDropdown
            subTechnologies={entry.subTechnologies}
            selectedSubEntryIndex={selectedSubEntryIndex}
            onSubEntrySelected={onSubEntrySelected}
          />
        )
      }
    >
      <entryToDisplay.Content
        {...props}
        jumpToPage={(page, subPage) => {
          onEntrySelected(page);
          onSubEntrySelected(subPage ? subPage : undefined);
        }}
        regionShort={(props.region || '').indexOf('us-') >= 0 ? 'us' : 'eu'}
      />
    </ExpandableCard>
  );
}

function SubTechnologiesDropdown({ subTechnologies, selectedSubEntryIndex, onSubEntrySelected }) {
  return (
    <div className={locals.drownDownWrapper}>
      <span className={locals.dropDownLabel}>Technology</span>
      <Select
        className={locals.dropDown}
        value={selectedSubEntryIndex}
        onChange={e => onSubEntrySelected(e.target.value)}
        autoComplete="off"
      >
        {subTechnologies.map((subTechnology, i) => (
          <option key={subTechnology.label} value={i}>
            {subTechnology.label}
          </option>
        ))}
      </Select>
    </div>
  );
}
