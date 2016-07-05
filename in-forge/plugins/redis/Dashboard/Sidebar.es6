import irpt from 'react-immutable-proptypes';
import React from 'react';

import RedisInfo from 'in-forge/plugins/redis/RedisInfo';
import Collapsible from 'in-components/Collapsible';


export default function RedisSidebar({snapshot}) {
  return (
    <div>
      <Collapsible initiallyOpen={true}>
        <Collapsible.Header>
          Redis
        </Collapsible.Header>
        <Collapsible.Content>
          <RedisInfo snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>
    </div>
  );
}

RedisSidebar.propTypes = {
  snapshot: irpt.map.isRequired
};
