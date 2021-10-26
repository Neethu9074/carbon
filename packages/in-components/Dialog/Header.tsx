/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { ReactElement } from 'react';
import classNames from 'classnames';

import { SvgIcon } from '@instana/components';

import IconButton from 'in-components/IconButton/IconButton';

import locals from './Dialog.mless';

export interface Props {
  icon?: string;
  onIconClick?: () => void;
  onClose?: () => void;
  title: string | ReactElement;
  renderCustomCloseBehaviour?: () => ReactElement;
  addScrollShadow?: boolean;
}

export default function Header({
  icon,
  onIconClick,
  title,
  renderCustomCloseBehaviour,
  onClose,
  addScrollShadow
}: Props) {
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
            <IconButton type={icon} iconSize="l" onClick={onIconClick} kind="info" alignment="left" />
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
      {onClose && (
        <IconButton type="lib_openclose_cancel" iconSize="l" onClick={onClose} kind="info" alignment="right" />
      )}
    </div>
  );
}

export function Title({ title }: { title: string | ReactElement }): ReactElement {
  if (typeof title === 'string') {
    return <h1 className={locals.title}>{title}</h1>;
  }
  return title;
}
