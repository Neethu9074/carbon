import irpt from 'react-immutable-proptypes';
import React from 'react';

import DefaultLogicalSidebar from 'in-sdk/components/sidebar/DefaultLogicalSidebar';


export default function LogicalWebAppSidebar({snapshot}) {
  return (
    <DefaultLogicalSidebar snapshot={snapshot} />
  );
}

LogicalWebAppSidebar.propTypes = {
  snapshot: irpt.map.isRequired
};
