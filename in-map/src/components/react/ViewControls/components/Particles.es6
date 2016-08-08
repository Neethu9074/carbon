import React from 'react';

import {particlesAreActive$, toggleParticles} from 'in-map/src/stores/process/particles';
import {view, types as views} from 'in-stores/view';
import Button from 'in-components/Button';
import connectTo from 'in-hoc/connectTo';


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
    <Button onClick={toggleParticles}>
      {particlesAreActive ? 'Particles Off' : 'Particles On'}
    </Button>
  );
}

const rpt = React.PropTypes;
Particles.propTypes = {
  particlesAreActive: rpt.bool,
  currentView: rpt.string
};
