import React from 'react';

import {toggleView, view$ as view2D3D$} from 'in-map/src/stores/process/viewStore';
import {view, types as views} from 'in-stores/view';
import connectTo from 'in-hoc/connectTo';

import 'in-components/Switcher2D3D/Switcher2D3D.less';


const block = 'in-switcher-2d-3d';

export default connectTo({
    view2D3D: view2D3D$,
    currentView: view
  }, Switcher2D3D
);

function Switcher2D3D({view2D3D, currentView}) {
  if (!currentView || currentView !== views.process) {
    return null;
  }

  return (
    <div className={block}
         onClick={toggleView}>
      {view2D3D === '3D' ? '2D' : '3D'}
    </div>
  );
}

const rpt = React.PropTypes;
Switcher2D3D.propTypes = {
  currentView: rpt.string,
  view2D3D: rpt.string
};
