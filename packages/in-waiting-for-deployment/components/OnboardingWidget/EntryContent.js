/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import LocallyChangedTheme from 'in-themes/LocallyChangedTheme';
import Select from 'in-components/form/Select';
import Card from 'in-new-components/Card';
import { light } from 'in-themes/themes';
import { t } from 'in-i18n';

import locals from './EntryContent.mless';

export default function EntryContent(props) {
  const { entry, onSubEntrySelected } = props;
  const selectedSubEntryIndex = props.selectedSubEntryIndex || 0;
  const entryToDisplay = entry.subTechnologies ? entry.subTechnologies[selectedSubEntryIndex] : entry;

  return (
    <LocallyChangedTheme theme={light}>
      <Card
        className={locals.card}
        framed={false}
        openByDefault
        title={<span className={locals.title}>{entry.fullLabel || entry.label}</span>}
        titleSubContent={
          entry.subTechnologies && (
            <SubTechnologiesDropdown
              subTechnologies={entry.subTechnologies}
              selectedSubEntryIndex={selectedSubEntryIndex}
              onSubEntrySelected={onSubEntrySelected}
            />
          )
        }
      >
        <entryToDisplay.Content {...props} />
      </Card>
    </LocallyChangedTheme>
  );
}

function SubTechnologiesDropdown({ subTechnologies, selectedSubEntryIndex, onSubEntrySelected }) {
  return (
    <div className={locals.drownDownWrapper}>
      <span className={locals.dropDownLabel}>{t('in-waiting-for-deployment:technology')}</span>
      <Select
        className={locals.dropDown}
        value={selectedSubEntryIndex}
        onChange={e => onSubEntrySelected(e.target.value, subTechnologies[e.target.value].label)}
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
