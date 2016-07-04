import irpt from 'react-immutable-proptypes';
import React from 'react';

import List from 'in-components/List';


export default function WebSiteList({snapshot}) {
  const sites = snapshot.getIn(['data', 'allsites']);
  return (
    (!sites || sites.size === 0) ?
    null :
    <List>
      {sites.map(site =>
        <List.Item key={site}>
          {site}
        </List.Item>
      )}
    </List>
  );
}

WebSiteList.propTypes = {
  snapshot: irpt.map.isRequired
};
