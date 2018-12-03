import React from 'react';

import Overlay from 'in-new-components/overlays/Overlay';
import SvgIcon from 'in-components/SvgIcon';

import locals from './HighlightSwitch.mless';

export default function HighlightSwitch(props) {
  const { showHealth } = props;

  return (
    <div className={locals.switch}>
      <span className={locals.label}>Highlight:</span>
      <Overlay align="bottomMiddle" content={ContextMenu} props={props}>
        {({ toggle, isOpen }) => (
          <div className={locals.optionSwitch}>
            <span className={locals.option} onClick={toggle}>
              {showHealth ? 'Unhealthy' : 'None'}
            </span>
            <SvgIcon
              className={locals.expandIcon}
              type={isOpen ? 'lib_arrow_expand_up' : 'lib_arrow_expand_down'}
              width={18}
              height={18}
            />
          </div>
        )}
      </Overlay>
    </div>
  );
}

function ContextMenu({ showHealth, setShowHealth, close }) {
  return (
    <div className={locals.contextMenu}>
      <span
        className={locals.option}
        onClick={() => {
          setShowHealth(!showHealth);
          close();
        }}
      >
        {showHealth ? 'None' : 'Unhealthy'}
      </span>
    </div>
  );
}
