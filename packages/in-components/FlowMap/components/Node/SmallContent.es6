import React from 'react';

import EntityLink from 'in-components/FlowMap/components/Node/EntityLink';

import locals from './SmallContent.mless';

export default function SmallContent({ data }) {
  return <EntityLink className={locals.entityLink} data={data} />;
}
