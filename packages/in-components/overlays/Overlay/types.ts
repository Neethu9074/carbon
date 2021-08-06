/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { CSSProperties, ReactNode, ReactPropTypes } from 'react';

type Align =
  | 'leftBottom'
  | 'leftMiddle'
  | 'leftTop'
  | 'topLeft'
  | 'topMiddle'
  | 'topRight'
  | 'rightTop'
  | 'rightMiddle'
  | 'rightBottom'
  | 'bottomLeft'
  | 'bottomMiddle'
  | 'bottomRight'
  | 'auto'
  | 'mousePosition';

export interface ExternalContentProps extends ReactPropTypes {
  align?: Align;
}

export interface OverlayContentProps extends ExternalContentProps {
  align?: Align;
  autoClose?: boolean;
  refSetter?: (r: Element | null) => void;
  ref?: (r: Element | null) => void;
  isOpen: boolean;
  toggle: () => void;
  open: () => void;
  close: (e?: any) => void;
  delayedOpen: () => void;
  delayedClose: () => void;
}

export interface OverlayProps<FORWARDED_CONTENT_PROPS> {
  autoOpen?: boolean;
  inContentArea?: boolean;
  behindSidebar?: boolean;
  forceConfiguredAlignment?: boolean;
  wrapperStyle?: CSSProperties;
  wrapperClassName?: string;
  withoutWrapper?: boolean;
  withoutArrow?: boolean;
  align?: Align;
  kind?: string;
  props?: FORWARDED_CONTENT_PROPS;
  children: (p: FORWARDED_CONTENT_PROPS & OverlayContentProps) => ReactNode;
  autoClose?: boolean;
  content?: ReactNode;
  focusOnClose?: boolean;

  onToggle?: (b: boolean) => void;
  onCloseSideEffect?: (e?: any) => void;
}

export interface OverlayState {
  id: string;
  isOpen: boolean;
  wrapper: HTMLElement | null;
  parentOverlay: HTMLElement | null;
}

export interface OverlayMounterContentProps extends ExternalContentProps {
  close: (e: any) => void;
  asyncClose: (e: any) => void;
}

export interface OverlayMounterProps {
  id: string;
  content: ReactNode;
  props: OverlayMounterContentProps;
  autoClose?: boolean;
  relativeTo: HTMLElement | null;
  parentOverlay: HTMLElement | null;
  kind?: string;
  close: (e: any) => void;
  delayedOpen: () => void;
  delayedClose: () => void;
  autoOpen?: boolean;
  withoutArrow?: boolean;
  inContentArea?: boolean;
  behindSidebar?: boolean;
  align?: Align;
  forceConfiguredAlignment?: boolean;
}
