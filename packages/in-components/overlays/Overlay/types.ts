/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { CSSProperties, ReactNode } from 'react';

export type Align =
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

export interface ExternalContentProps {
  align?: Align;
}

export interface OverlayContentProps extends ExternalContentProps {
  autoClose?: boolean;
  refSetter?: React.MutableRefObject<HTMLElement> | React.RefCallback<HTMLElement>;
  ref?: React.MutableRefObject<HTMLElement>;
  delayedOpen?: () => void;
  delayedClose?: () => void;

  isOpen: boolean;
  toggle: () => void;
  open: () => void;
  close: (e?: any) => void;
}

export interface OverlayProps<FORWARDED_CONTENT_PROPS> {
  autoOpen?: boolean;
  inContentArea?: boolean;
  inSidePanel?: boolean;
  behindSidebar?: boolean;
  forceConfiguredAlignment?: boolean;
  wrapperStyle?: CSSProperties;
  wrapperClassName?: string;
  withoutWrapper?: boolean;
  withoutArrow?: boolean;
  align?: Align;
  kind?: string;
  props?: FORWARDED_CONTENT_PROPS;
  children: (p: OverlayContentProps) => ReactNode;
  autoClose?: boolean;
  content: React.ComponentType<OverlayContentProps & OverlayMounterContentProps & FORWARDED_CONTENT_PROPS>;
  focusOnClose?: boolean;
  /**
   * This could be used for an overlay alignment issue on small screen resolution, see
   * "CSP TS018037439: Instana application view - screen resolution issue on SA Dialog"
   * https://jsw.ibm.com/browse/INSTA-21973
   *
   * It will help to avoid cutting-off content on the left side (out-of-screen)
   *
   * It is only tested with align="buttonLeft"
   * Use with care!
   */
  fixOverlayLeftAlignment?: boolean;
  onToggle?: (b: boolean) => void;
  onCloseSideEffect?: (e?: any) => void;
}

export interface OverlayState {
  id: string;
  isOpen: boolean;
  wrapper: HTMLElement | null;
  parentOverlay: string | null | undefined;
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
  parentOverlay: string | null | undefined;
  kind?: string;
  close: (e: any) => void;
  delayedOpen: () => void;
  delayedClose: () => void;
  autoOpen?: boolean;
  withoutArrow?: boolean;
  inContentArea?: boolean;
  inSidePanel?: boolean;
  behindSidebar?: boolean;
  /** see OverlayProps for comment */
  fixOverlayLeftAlignment?: boolean;
  align?: Align;
  forceConfiguredAlignment?: boolean;
}
