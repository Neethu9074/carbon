import React from 'react';

import {particlesAreActive$, toggleParticles} from 'in-map/src/stores/process/particles';
import {view, types as views} from 'in-stores/view';
import SvgIcon from 'in-components/SvgIcon';
import Button from 'in-components/Button';
import connectTo from 'in-hoc/connectTo';

import 'in-map/src/components/react/ViewControls/components/Particles.less';


const block = 'in-particles-button';

export default connectTo({
    particlesAreActive: particlesAreActive$,
    currentView: view
  }, Particles
);

function Particles({particlesAreActive, currentView}) {
  if (!currentView || currentView !== views.process) {
    return null;
  }

  let classes = block;
  if (!particlesAreActive) {
    classes += ' ' + classes + '--inactive';
  }

  return (
    <Button onClick={toggleParticles}
            className={classes}>
      <SvgIcon type={'particles'}
               width={16}
               height={16}
               color={particlesAreActive ? '#000' : '#7b8e96'} />
    </Button>
  );
}

const rpt = React.PropTypes;
Particles.propTypes = {
  particlesAreActive: rpt.bool,
  currentView: rpt.string
};
