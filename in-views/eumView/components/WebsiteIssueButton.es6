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
  function({ numberOfOpenIssues, href }) {
    if (numberOfOpenIssues === 1) {
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
