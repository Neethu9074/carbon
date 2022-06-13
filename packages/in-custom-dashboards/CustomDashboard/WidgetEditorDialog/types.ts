/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { Dispatch, SetStateAction } from 'react';

export type SubSlideState<S> = [Partial<S> | undefined, Dispatch<SetStateAction<S | undefined>>];

export interface SlideInViewConfig<SlideoutState> {
  renderTitle: (selected: SlideoutState | undefined) => string;
  slideOutHandler: (slideOut: () => void, state: SubSlideState<SlideoutState>) => void;
  getContent: (props: { slideOut: () => void; subSlideState: SubSlideState<SlideoutState> }) => React.ReactNode;
}
