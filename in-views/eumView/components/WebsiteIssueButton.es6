import React from 'react';

import { getEventsViewFilteredByEntity } from 'in-stores/navigation/navigation';
import { getHealthInfoAtFocusedMoment } from 'in-stores/events';
import Button from 'in-components/Button';
import connectTo from 'in-hoc/connectTo';

import './WebsiteIssueButton.less';

const block = 'in-website-issue-button';

export default connectTo(
  props => {
    return {
      href: getEventsViewFilteredByEntity(props.snapshotId),
      healthInfo: getHealthInfoAtFocusedMoment(props.snapshotId)
    };
  },
  function({ healthInfo, href }) {
    if (!healthInfo) {
      return null;
    }

    const numberOfOpenIssues = healthInfo.get('numberOfOpenEvents');
    if (numberOfOpenIssues === 0) {
      return null;
    }

    return (
      <Button
        className={block}
        kind="default"
        href={href}
        onClick={e => {
          e.stopPropagation();
        }}
      >
        {`${numberOfOpenIssues} open issues`}
      </Button>
    );
  }
);
