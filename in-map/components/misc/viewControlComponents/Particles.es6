import React from 'react';

import {particlesAreActive$, toggleParticles} from 'in-map/stores/logical/particlesStore';
import SvgIcon from 'in-components/SvgIcon';
import Button from 'in-components/Button';
import connectTo from 'in-hoc/connectTo';

import 'in-map/components/misc/viewControlComponents/Particles.less';


const block = 'in-particles-button';

export default connectTo({
    particlesAreActive: particlesAreActive$
  }, Particles
);

function Particles({particlesAreActive}) {
  let classes = block;
  if (!particlesAreActive) {
    classes += ' ' + classes + '--inactive';
  }

  return (
    <Button onClick={toggleParticles}
            className={classes}>
      <SvgIcon type={'particles'}
               width={24}
               height={24}
               color={particlesAreActive ? '#000' : '#7b8e96'} />
    </Button>
  );
}

const rpt = React.PropTypes;
Particles.propTypes = {
  particlesAreActive: rpt.bool,
  currentView: rpt.string
};
