import irpt from 'react-immutable-proptypes';
import React from 'react';

import Collapsible from 'in-components/Collapsible';

import ElasticsearchInfo from '../ElasticsearchInfo';


export default function ElasticsearchSidebar({snapshot}) {
  return (
    <div>
      <Collapsible initiallyOpen={true}>
        <Collapsible.Header>Elasticsearch</Collapsible.Header>
        <Collapsible.Content>
          <ElasticsearchInfo snapshot={snapshot}
                             snapshotId={snapshot.get('id')}/>
        </Collapsible.Content>
      </Collapsible>
    </div>
  );
}

ElasticsearchSidebar.propTypes = {
  snapshot: irpt.map.isRequired
};
