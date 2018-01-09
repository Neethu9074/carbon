import React from 'react';

import ToplistRow from 'in-components/TopList/TopListRow';
import ButtonGroup from 'in-components/ButtonGroup';
import Button from 'in-components/Button';

import locals from './TopList.mless';

export default function TopList({ dummyData, header }) {
  return (
    <div className={`${locals.topList}`}>
      <div className={`${locals.header}`}>
        <h3>{header}</h3>
        <ButtonGroup className={`${locals.buttons}`} horizontal>
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
