import React from 'react';

import {isLoading$} from 'in-components/globeView/stores/isLoadingStore';
import Universe from 'in-components/globeView/components/Universe';
import connectTo from 'in-hoc/connectTo';

import './GlobeView.less';


const block = 'in-globe-view';

export default connectTo({
  isLoading: isLoading$
}, function GlobeView({isLoading}) {
  return (
    <div className={block}>
      <Universe className={`${block}__universe`} />

      {isLoading
        ? <div className={`${block}__loading`}>
            LOADING...
          </div>
        : null
      }
    </div>
  );
});
