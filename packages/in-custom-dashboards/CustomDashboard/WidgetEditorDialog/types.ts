/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { Dispatch, SetStateAction } from 'react';
import { Item } from 'formalistic';

export type SubSlideState<S> = [Partial<S> | undefined, Dispatch<SetStateAction<S | undefined>>];

export interface SlideInViewContentProps<SLIDE_OUT_STATE> {
  slideOut: VoidFunction;
  subSlideState: SubSlideState<SLIDE_OUT_STATE>;
}

export interface SlideInViewConfig<SLIDE_OUT_STATE> {
  renderTitle: (selected: SLIDE_OUT_STATE | undefined) => string;
  slideOutHandler: (slideOut: () => void, state: SubSlideState<SLIDE_OUT_STATE>) => void;
  getContent: (props: SlideInViewContentProps<SLIDE_OUT_STATE>) => React.ReactNode;
}

export type SetSlideInViewAction<SLIDE_OUT_STATE> = (view: SlideInViewConfig<SLIDE_OUT_STATE>) => void;

export interface FormComponentProps<FORM extends Item, SLIDE_OUT_STATE> {
  form: FORM;
  onChange: (path: string[], updater: (f: FORM) => FORM) => void;
  setSlideInView: SetSlideInViewAction<SLIDE_OUT_STATE>;
}
