/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import DialogWithSlideInView from 'in-components/Dialog/DialogWithSlideInView';
import useSubSlideControl from 'in-settings/hooks/useSubSlideControl';

/**
 * Properties for ShowCreatedToken component
 * @property title to be used as title of dialog
 * @property onClickCancel to be called when clicked on cancel button
 * @property children to be used to show component in dialog
 * @property footer to be used to show component as footer in dialog
 */
interface DialogWrapperProps {
  readonly title: string;
  readonly onClickCancel: () => void;
  readonly children: JSX.Element;
  readonly footer: JSX.Element;
}

export const DialogWrapper = ({ title, onClickCancel, children, footer }: DialogWrapperProps) => {
  const { subSlideConfig, showSubSlide } = useSubSlideControl();

  return (
    <DialogWithSlideInView
      title={title}
      slideInViewVisible={showSubSlide}
      slideInViewComponent={subSlideConfig?.content}
      slideInViewTitle={subSlideConfig?.title}
      onClose={onClickCancel}
      footer={footer}
    >
      {children}
    </DialogWithSlideInView>
  );
};
