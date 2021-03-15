/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { forwardRef } from 'react';
import classNames from 'classnames';

import { stopPropagationAndPreventDefault } from 'in-services/util/function';
import SvgIcon from 'in-components/SvgIcon';

import locals from './BarItem.mless';

export default forwardRef(function BarItem(
  { children, withoutTextTransform, active, isOpen, showArrow, showMore, notAvailable, onClick, refSetter },
  ref
) {
  return (
    <a
      className={classNames({
        [locals.item]: true,
        [locals.active]: active,
        [locals.notAvailable]: notAvailable,
        [locals.withIcon]: showArrow,
        [locals.withoutTextTransform]: withoutTextTransform
      })}
      href=""
      onClick={e => {
        stopPropagationAndPreventDefault(e);
        onClick();
      }}
      ref={ref || refSetter}
    >
      <span className={locals.text}>{children}</span>
      {showArrow && (
        <SvgIcon className={locals.icon} type={isOpen ? 'lib_arrow_expand_up' : 'lib_arrow_expand_down'} size="xs" />
      )}
      {showMore && <SvgIcon className={locals.icon} type="lib_menu_more_horizontal" size="s" />}
    </a>
  );
});
