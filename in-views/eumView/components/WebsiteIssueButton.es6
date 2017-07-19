import React from 'react';

import Button from 'in-components/Button';

import './WebsiteIssueButton.less';

const block = 'in-website-issue-button';

export default function ({color, openIssues, snapshotId}) {

  const backgroundColor = {backgroundColor: color};

  return (
  <Button className={block}
          style={backgroundColor}
          kind="default"
          href={''} onClick={()=>{}}>
    {`${openIssues} open issues`}
  </Button>
  )

}
