import React from 'react';

import ToplistRow from 'in-components/TopList/TopListRow';
import ButtonGroup from 'in-components/ButtonGroup';
import Button from 'in-components/Button';

import './TopList.less';

export default function TopList({ dummyData, header }) {
  const block = 'in-toplist';
  const headerClass = `${block}__header`;

  return (
    <div className={block}>
      <div className={headerClass}>
        <h3>{header}</h3>
        <ButtonGroup className={`${headerClass}__buttons`} horizontal>
          <Button kind={'secondary'}>Latency</Button>
          <Button kind={'secondary'} outlineOnly={true}>
            Calls
          </Button>
        </ButtonGroup>
      </div>
      <ol>{dummyData.map(data => <ToplistRow {...data} />)}</ol>
    </div>
  );
}
