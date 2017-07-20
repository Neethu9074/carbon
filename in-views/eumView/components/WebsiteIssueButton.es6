import React from 'react';

import { eventViewLink$ } from 'in-stores/navigation/view';
import Button from 'in-components/Button';
import connectTo from 'in-hoc/connectTo';

import './WebsiteIssueButton.less';

const block = 'in-website-issue-button';

export default connectTo(
  {
    href: eventViewLink$
  },
  function({ openIssues, href }) {
    return (
      <Button
        className={block}
        kind="default"
        href={href}
        onClick={e => {
          e.stopPropagation();
        }}
      >
        {`${openIssues} open issues`}
      </Button>
    );
  }
);
