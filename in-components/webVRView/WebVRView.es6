import React from 'react';

import Map from 'in-map/index.es6';

import './WebVRView.less';

const block = 'in-webvr-view';

export default function WebVRView() {
  return (
    <div className={block}>
      <Map webVRMode />
    </div>
  );
}
