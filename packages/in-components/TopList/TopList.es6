import React from 'react';

import ToplistRow from 'in-components/TopList/TopListRow';
import ButtonGroup from 'in-components/ButtonGroup';
import Button from 'in-components/Button';

import locals from './TopList.mless';

export default function TopList({ dummyData, header }) {
  return (
    <div className={`${locals['top-list']}`}>
      <div className={`${locals.header}`}>
        <div>
          <h3>{header}</h3>
        </div>
        <div>
          <ButtonGroup className={`${locals.buttons}`}>
            <Button kind={'secondary'}>Latency</Button>
            <Button kind={'secondary'} outlineOnly={true}>
              Calls
            </Button>
          </ButtonGroup>
        </div>
      </div>
      <ol>{dummyData.map(data => <ToplistRow {...data} />)}</ol>
    </div>
  );
}
