import React from 'react';

import Universe from 'in-components/globeView/components/Universe';

import './GlobeView.less';


const block = 'in-globe-view';

export default function GlobeView() {
  return (
    <div className={block}>
      <Universe className={block + '__universe'}/>
    </div>
  );
}
