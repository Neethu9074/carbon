import React from 'react';

import {particlesAreActive$, toggleParticles} from 'in-map/src/stores/process/particles';
import {view, types as views} from 'in-stores/view';
import connectTo from 'in-hoc/connectTo';

import 'in-map/src/components/react/Particles/Particles.less';


const block = 'in-switcher-particles';

export default connectTo({
    particlesAreActive: particlesAreActive$,
    currentView: view
  }, Particles
);

function Particles({currentView, particlesAreActive}) {
  if (!currentView || currentView !== views.process) {
    return null;
  }

  return (
    <div className={block}
         onClick={toggleParticles}>
      {particlesAreActive ? 'Particles Off' : 'Particles On'}
    </div>
  );
}

const rpt = React.PropTypes;
Particles.propTypes = {
  particlesAreActive: rpt.bool,
  currentView: rpt.string
};
