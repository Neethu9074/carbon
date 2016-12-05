import React from 'react';

import {loadingResources$} from 'in-components/globeView/stores/isLoadingStore';
import Universe from 'in-components/globeView/components/Universe';
import connectTo from 'in-hoc/connectTo';

import './GlobeView.less';


const block = 'in-globe-view';

export default connectTo({
  loadingResources: loadingResources$
}, function GlobeView({loadingResources}) {
  if (!loadingResources) {
    return null;
  }

  const resources = Object.keys(loadingResources.resources).map(key => loadingResources.resources[key]);
  const loading = resources.filter(val => val);
  const percentLaoded = ((resources.length - loading.length) / resources.length) * 100;

  return (
    <div className={block}>
      <Universe className={`${block}__universe`} />

      {loadingResources.isLoading
        ? <div className={`${block}__loading`}>
            LOADING...
            <div className={`${block}__loading-indocator-wrapper`}>
              <div className={`${block}__loading-indocator`}
                   style={{
                     width: `${percentLaoded}%`
                   }} />
            </div>
        </div>
        : null
      }
    </div>
  );
});
