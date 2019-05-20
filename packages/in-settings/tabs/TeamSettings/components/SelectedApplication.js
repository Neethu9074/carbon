import React from 'react';

import SelectBarOverlayBehavior from 'in-analyze/components/filterBar/SelectBarItem/SelectBarOverlayBehavior';
import { stopPropagationAndPreventDefault } from 'in-services/util/function';
import { evaluateClassNames } from 'in-services/util/classnames';
import Overlay from 'in-new-components/overlays/Overlay';
import SvgIcon from 'in-components/SvgIcon';

import locals from './SelectedApplication.mless';

export default function SelectedApplication(props) {
  return (
    <Overlay withoutWrapper content={SelectBarOverlayBehavior} props={props} align="topMiddle" inContentArea>
      {Content}
    </Overlay>
  );
}

function Content({ applicationName, isOpen, toggle, refSetter }) {
  return (
    <a
      className={evaluateClassNames({
        [locals.item]: true,
        [locals.hasValue]: applicationName
      })}
      href=""
      onClick={e => {
        stopPropagationAndPreventDefault(e);
        toggle();
      }}
      ref={refSetter}
    >
      <span className={locals.text}>{applicationName ? applicationName : 'Select an Application…'}</span>
      <SvgIcon
        className={locals.icon}
        type={isOpen ? 'lib_arrow_expand_up' : 'lib_arrow_expand_down'}
        width={16}
        height={16}
      />
    </a>
  );
}
