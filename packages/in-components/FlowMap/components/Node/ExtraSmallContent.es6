import React from 'react';

import EntityLink from 'in-components/FlowMap/components/Node/EntityLink';

import locals from './ExtraSmallContent.mless';

export default function ExtraSmallContent({ data }) {
  return <EntityLink className={locals.entityLink} data={data} />;
}
