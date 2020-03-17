import React from 'react';

import { evaluateClassNames } from 'in-services/util/classnames';
import { formatDateTime } from 'in-services/formatters/date';
import Dropdown from 'in-new-components/Dropdown';

import locals from './RevisionDropdown.mless';

export default function RevisionDropdown({ alertConfig, alertConfigVersions, setRevision, alertRevision }) {
  return (
    <Dropdown
      icon="lib_datetime_timerange"
      label={`Revision ${alertRevision}`}
      align="bottomRight"
      items={alertConfigVersions}
      renderItemContent={(item, i) => renderItemContent(item, i, alertConfig, alertConfigVersions)}
      onClick={revision => {
        if (revision.created !== alertConfig.created) {
          setRevision(revision);
        }
      }}
    />
  );
}

function toAlertRevision(i, alertConfigVersions) {
  return alertConfigVersions.length - i;
}

function renderItemContent(item, i, alertConfig, alertConfigVersions) {
  return (
    <div className={locals.item}>
      <span>
        <span
          className={evaluateClassNames({
            [locals.selectedItem]: item.created === alertConfig.created
          })}
        >
          {`Revision ${toAlertRevision(i, alertConfigVersions)} `}
        </span>
        <span className={locals.createdDate}>({formatDateTime(item.created)})</span>
      </span>
    </div>
  );
}
