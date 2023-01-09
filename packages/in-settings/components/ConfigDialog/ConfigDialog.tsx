/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React, { ReactNode } from 'react';
import { MapForm } from 'formalistic';

import ConfigDialogFooter, { ConfigDialogFooterProps } from 'in-settings/components/ConfigDialog/ConfigDialogFooter';
import DialogWithSlideInView, { DialogWithSlideInViewProps } from 'in-components/Dialog/DialogWithSlideInView';
import StepsContainer from 'in-components/StepsContainer/StepsContainer';
import { MessageType } from 'in-components/MessageStack/MessageStack';
import { NavItem } from 'in-components/SideNav/SideNav';

import locals from './ConfigDialog.mless';

export interface SubSlideConfig {
  title?: string;
  content?: ReactNode;
}

export interface ConfigDialogProps
  extends Pick<DialogWithSlideInViewProps, 'title'>,
    Pick<ConfigDialogFooterProps, 'onClickSave' | 'onClickCancel'> {
  navItems: Array<NavItem>;
  subSlideConfig?: SubSlideConfig;
  form?: MapForm;
  formId?: string;
  messages?: MessageType[];
  showSubSlide?: boolean;
  noHeader?: boolean;
  noDivider?: boolean;
  onSubmit?: (form?: MapForm) => void;
  onCloseSubSlide?: VoidFunction;
}

export default function ConfigDialog({
  form,
  formId,
  messages,
  title,
  navItems,
  showSubSlide,
  subSlideConfig,
  noHeader,
  noDivider,
  onClickCancel,
  onClickSave,
  onSubmit,
  onCloseSubSlide
}: ConfigDialogProps) {
  return (
    <DialogWithSlideInView
      title={title}
      slideInViewVisible={showSubSlide}
      slideInViewComponent={subSlideConfig?.content}
      slideInViewTitle={subSlideConfig?.title}
      onSlideInViewTitleClick={onCloseSubSlide}
      footer={<ConfigDialogFooter form={form} onClickCancel={onClickCancel} onClickSave={onClickSave} />}
    >
      <form
        id={formId}
        onSubmit={e => {
          e.preventDefault();
          e.stopPropagation();
          onSubmit?.(form);
        }}
        className={locals.dialog}
      >
        <StepsContainer messages={messages} navItems={navItems} noHeader={noHeader} noDivider={noDivider} />
      </form>
    </DialogWithSlideInView>
  );
}
