import React, { Fragment } from 'react';

import { stopPropagationAndPreventDefault } from 'in-services/util/function';
import { isNotBlank } from 'in-services/util/string';
import Button from 'in-new-components/Button';
import SvgIcon from 'in-components/SvgIcon';
import Tooltip from 'in-components/Tooltip';

import locals from './GroupingInfo.mless';

export default function GroupingInfo({ group, disableGrouping, openEditGroupDialog }) {
  let groupedBy = null;
  if (group && isNotBlank(group.groupbyTag)) {
    // website monitoring
    groupedBy = group.groupbyTag;

    if (isNotBlank(group.groupbyTagSecondLevelKey)) {
      groupedBy = `${groupedBy}.${group.groupbyTagSecondLevelKey}`;
    }
  } else if (group && isNotBlank(group.name)) {
    // analyze calls/traces
    groupedBy = group.name;

    if (isNotBlank(group.value)) {
      groupedBy = `${groupedBy}.${group.value}`;
    }
  }

  return (
    <div className={locals.wrapper}>
      <span className={locals.label}>Grouped by</span>

      {isNotBlank(groupedBy) && (
        <Fragment>
          <span className={locals.grouping}>{groupedBy}</span>

          <Tooltip content="Remove grouping" align="bottomMiddle">
            <SvgIcon
              className={locals.removeGrouping}
              aria-label="Remove grouping"
              type="lib_openclose_cancel"
              onClick={disableGrouping}
              width={18}
              height={18}
            />
          </Tooltip>
        </Fragment>
      )}

      <Button
        kind="primaryv2"
        onClick={e => {
          stopPropagationAndPreventDefault(e);
          openEditGroupDialog();
        }}
      >
        {isNotBlank(groupedBy) ? 'Change Group' : 'Add Group'}
      </Button>
    </div>
  );
}
