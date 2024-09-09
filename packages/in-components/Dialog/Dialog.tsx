/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState, ReactElement, MouseEvent, PropsWithChildren } from 'react';
import classNames from 'classnames';

import { CarbonLayer } from '@instana/components';

import { stopPropagation, stopPropagationAndPreventDefault } from 'in-services/util/function';
import Header from 'in-components/Dialog/Header';

import locals from './Dialog.mless';

export interface Props {
  className?: string;
  title: string | ReactElement;
  titleIconType?: string;
  onClose: (e?: MouseEvent) => void;
  closeTooltip?: string;
  onTitleIconClick?: () => void;
  renderCustomCloseBehaviour?: () => ReactElement;
  withoutBodyPadding?: boolean;
  showOverflow?: boolean;
  headless?: boolean;
  doNotCloseOnOutsideClick?: boolean;
}

export default function Dialog({
  className,
  title,
  titleIconType,
  onClose,
  closeTooltip,
  onTitleIconClick,
  children,
  renderCustomCloseBehaviour,
  withoutBodyPadding,
  showOverflow,
  headless = false,
  doNotCloseOnOutsideClick
}: PropsWithChildren<Props>) {
  const [scrollshadow, setScrollshadow] = useState(false);

  return (
    <div
      className={classNames({
        [locals.wrapper]: true,
        [locals.cursorDefault]: doNotCloseOnOutsideClick
      })}
      onClick={e => (doNotCloseOnOutsideClick ? stopPropagationAndPreventDefault(e) : onClose(e))}
    >
      <section className={classNames(locals.dialog, className)} onClick={stopPropagation}>
        <CarbonLayer>
          {!headless && (
            <Header
              icon={titleIconType}
              onIconClick={onTitleIconClick}
              title={title}
              renderCustomCloseBehaviour={renderCustomCloseBehaviour}
              onClose={onClose}
              closeTooltip={closeTooltip}
              addScrollShadow={scrollshadow}
            />
          )}
          <div
            className={classNames(locals.body, locals.withRoundedBottomBorder, {
              [locals.withoutPadding]: withoutBodyPadding,
              [locals.showOverflow]: showOverflow
            })}
            onScroll={(e: { currentTarget: { scrollTop: number } }) => setScrollshadow(e.currentTarget?.scrollTop > 0)}
          >
            {children}
          </div>
        </CarbonLayer>
      </section>
    </div>
  );
}
