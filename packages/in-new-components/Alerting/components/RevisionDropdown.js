import React from 'react';

import ComboBoxBehavior from 'in-components/form/ComboBox/ComboBoxBehavior';
import DropdownButton from 'in-new-components/Button/DropdownButton';
import classNames from 'classnames';
import { formatDateTime } from 'in-services/formatters/date';

import locals from './RevisionDropdown.mless';

export default function RevisionDropdown({ alertConfig, alertConfigVersions, setRevision, alertRevision }) {
  const options = alertConfigVersions.map((v, i) => ({
    value: v,
    label: renderItemContent(v, i, alertConfig, alertConfigVersions)
  }));
  return (
    <ComboBoxBehavior
      align="bottomRight"
      value={options[alertConfigVersions.length - alertRevision]?.value}
      options={options}
      onChange={revision => {
        setRevision(revision.created);
      }}
      disableAutomaticOptionSorting
    >
      {({ elementProps, isOpen }) => (
        <DropdownButton {...elementProps} kind="primaryv2" icon="lib_datetime_timerange" expanded={isOpen}>
          Revision {alertRevision}
        </DropdownButton>
      )}
    </ComboBoxBehavior>
  );
}

export function toAlertRevision(i, alertConfigVersions) {
  return alertConfigVersions.length - i;
}

function renderItemContent(item, i, alertConfig, alertConfigVersions) {
  return (
    <>
      <span
        className={classNames({
          [locals.selectedItem]: item.created === alertConfig.created
        })}
      >
        Revision {toAlertRevision(i, alertConfigVersions)}
      </span>
      &nbsp;
      <span className={locals.createdDate}>({formatDateTime(item.created)})</span>
    </>
  );
}
