import React from 'react';

import Button from 'in-components/Button';
import connectTo from 'in-hoc/connectTo';
import { eventViewLink$ } from 'in-stores/navigation/view';

import './WebsiteIssueButton.less';

const block = 'in-website-issue-button';

export default connectTo(
  () => {
    return {
      eventViewLink: eventViewLink$
    };
  },
  function({ openIssues, eventViewLink }) {
    return (
      <Button
        className={block}
        kind="default"
        href={eventViewLink}
        onClick={e => {
          e.stopPropagation();
        }}
      >
        {`${openIssues} open issues`}
      </Button>
    );
  }
);
