/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import rpt from 'prop-types';
import React from 'react';

import { SvgIcon } from '@instana/components';

import IconButton from 'in-new-components/IconButton/IconButton';

import locals from './Dialog.mless';

export default function Header({ icon, onIconClick, title, renderCustomCloseBehaviour, onClose, addScrollShadow }) {
  return (
    <div
      className={classNames({
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
          <Title title={title} />
        </div>
      ) : (
        <Title title={title} />
      )}
      {renderCustomCloseBehaviour && (
        <span className={locals.customCloseBehaviour}>{renderCustomCloseBehaviour()}</span>
      )}
      {onClose && <IconButton type="lib_openclose_cancel" iconSize="l" onClick={onClose} kind="info" rightAligned />}
    </div>
  );
}

export function Title({ title }) {
  if (typeof title === 'string') {
    return <h1 className={locals.title}>{title}</h1>;
  }
  return title;
}

Header.propType = {
  icon: rpt.string,
  onIconClick: rpt.func,
  title: rpt.oneOfType([rpt.string, rpt.object]),
  renderCustomCloseBehaviour: rpt.func,
  onClose: rpt.func,
  addScrollShadow: rpt.bool
};
