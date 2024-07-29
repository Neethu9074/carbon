/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState } from 'react';
import classNames from 'classnames';

import { CarbonLayer } from '@instana/components';

import { stopPropagation, stopPropagationAndPreventDefault, noop } from 'in-services/util/function';
import { shareAndInviteEnabled } from 'in-services/featureFlags';
import SlideInView from 'in-components/SlideInView/SlideInView';
import Header from 'in-components/Dialog/Header';

import locals from './Dialog.mless';

export interface DialogWithSlideInViewProps {
  children: React.ReactNode;
  className?: string;
  renderCustomCloseBehaviour?: (reset: any) => React.ReactElement;
  headless?: boolean;
  onClose?: (e?: React.MouseEvent) => void;
  onTitleIconClick?: () => void;
  showOverflow?: boolean;
  title: string | React.ReactElement;
  titleIconType?: string;
  withoutBodyPadding?: boolean;
  removeBottomPaddingWhenFooterIsShown?: boolean;
  doNotCloseOnOutsideClick?: boolean;
  onSlideInViewTitleClick?: VoidFunction;
  slideInViewTitle?: React.ReactNode;
  slideInViewComponent?: React.ReactNode;
  slideInViewVisible?: boolean;
  footer?: React.ReactNode;
}

export default function DialogWithSlideInView({
  title,
  titleIconType,
  onClose,
  onTitleIconClick,
  children,
  className,
  renderCustomCloseBehaviour,
  withoutBodyPadding,
  removeBottomPaddingWhenFooterIsShown,
  showOverflow,
  headless = false,
  doNotCloseOnOutsideClick,
  onSlideInViewTitleClick,
  slideInViewTitle,
  slideInViewComponent,
  slideInViewVisible,
  footer
}: DialogWithSlideInViewProps) {
  const [scrollshadow, setScrollshadow] = useState(false);

  const resetScrollShadow = () => {
    setScrollshadow(false);
  };

  return (
    <div
      data-testid="dialog-slide-in-view"
      className={classNames({
        [locals.wrapper]: true,
        [locals.cursorDefault]: doNotCloseOnOutsideClick,
        [locals.shareAndInvite]: shareAndInviteEnabled
      })}
      onClick={e => (doNotCloseOnOutsideClick ? stopPropagationAndPreventDefault(e) : onClose?.(e))}
    >
      <section
        className={classNames(locals.dialog, className)}
        onClick={stopPropagation}
        onScrollCapture={e => setScrollshadow((e.target as HTMLElement).scrollTop > 0)}
      >
        <CarbonLayer>
          <SlideInView
            onShowSlideInContentChange={onSlideInViewTitleClick ?? noop}
            slideInContentTitle={slideInViewTitle}
            slideInContent={slideInViewComponent}
            showSlideInContent={slideInViewVisible}
            staticContent={
              <>
                {!headless && (
                  <Header
                    icon={titleIconType}
                    onIconClick={onTitleIconClick}
                    title={title}
                    renderCustomCloseBehaviour={() => {
                      return renderCustomCloseBehaviour && renderCustomCloseBehaviour(resetScrollShadow);
                    }}
                    onClose={onClose}
                    addScrollShadow={scrollshadow}
                  />
                )}
                <div
                  className={classNames({
                    [locals.body]: true,
                    [locals.withoutPadding]: withoutBodyPadding,
                    [locals.withoutBottomPadding]:
                      withoutBodyPadding ?? (removeBottomPaddingWhenFooterIsShown && footer),
                    [locals.showOverflow]: showOverflow,
                    [locals.withRoundedBottomBorder]: slideInViewVisible || !footer
                  })}
                >
                  {children}
                </div>

                {!slideInViewVisible && footer}
              </>
            }
          />
        </CarbonLayer>
      </section>
    </div>
  );
}
