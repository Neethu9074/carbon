import rpt from 'prop-types';
import React from 'react';

import { evaluateClassNames } from 'in-services/util/classnames';
import IconButton from 'in-new-components/IconButton/IconButton';
import SvgIcon from 'in-components/SvgIcon';

import locals from './BigHeaderDialog.mless';

export default function Header({ icon, onIconClick, title, renderCustomCloseBehaviour, onClose, addScrollShadow }) {
  return (
    <div
      className={evaluateClassNames({
        [locals.header]: true,
        [locals.scrollShadow]: addScrollShadow
      })}
    >
      {icon ? (
        <div className={locals.customTitle}>
          {onIconClick ? (
            <IconButton type={icon} iconSize="l" onClick={onIconClick} kind="info" leftAligned />
          ) : (
            <SvgIcon size="l" type={icon} />
          )}
          <h1 className={locals.title}>{title}</h1>
        </div>
      ) : (
        <h1 className={locals.title}>{title}</h1>
      )}
      {renderCustomCloseBehaviour && (
        <span className={locals.customCloseBehaviour}>{renderCustomCloseBehaviour()}</span>
      )}
      {onClose && <IconButton type="lib_openclose_cancel" iconSize="l" onClick={onClose} kind="info" rightAligned />}
    </div>
  );
}

Header.propType = {
  icon: rpt.string,
  onIconClick: rpt.func,
  title: rpt.string.isRequired,
  renderCustomCloseBehaviour: rpt.func,
  onClose: rpt.func,
  addScrollShadow: rpt.bool
};
