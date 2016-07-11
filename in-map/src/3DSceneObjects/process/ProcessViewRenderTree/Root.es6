import irpt from 'react-immutable-proptypes';
import React from 'react';

import Process from 'in-map/src/3DSceneObjects/process/ProcessViewRenderTree/Process';


export default function Root({children}) {
  return (
    <div style={{display: 'none'}}>
      {children.map(processNodeEntity => <Process key={processNodeEntity.get('id')}
                                                  entity={processNodeEntity} />
      )}
    </div>
  );
}

Root.propTypes = {
  children: irpt.list.isRequired
};
