/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { ReactNode, MouseEvent, MutableRefObject, RefCallback } from 'react';

import { SvgIconSizes } from '@instana/components';

export enum Kinds {
  primary,
  secondary,
  subtle
}

export enum Sizes {
  xl,
  normal,
  compact
}

export enum Types {
  button,
  submit,
  reset
}

type SvgSize = keyof typeof SvgIconSizes | number;

export interface PropsType
  extends Omit<React.HTMLAttributes<HTMLButtonElement | HTMLAnchorElement>, 'size' | 'onChange'> {
  /**
   * Add an Icon identifier. The Icon will be rendered to the left of the label.
   */
  icon?: string;
  /**
   * Indicate a loading state by spinning the icon (if it exists).
   */
  iconSpinning?: boolean;
  /**
   * The size of the icon.
   */
  iconSize?: SvgSize;
  /**
   * Will be turned into `form=` attribute on the buttons. Can be used to implement form controls outside of the `<form />` HTML sub-tree.
   */
  formId?: string;
  /**
   * Optional custom className. Avoid using where possible.
   */
  className?: string;
  /**
   * Option custom styles. Avoid using where possible.
   */
  style?: Record<string, string>;
  /**
   * The label for the Button
   */
  children: ReactNode;
  /**
   * Button types
   */
  kind?: keyof typeof Kinds;
  /**
   * Button sizes
   */
  size?: keyof typeof Sizes;
  /**
   * Event that fires when the user mouses over the button.
   */
  onMouseEnter?: (e: React.MouseEvent<HTMLElement>) => any;
  /**
   * Event that fires when the user's cursor leaves the button.
   */
  onMouseLeave?: (e: React.MouseEvent<HTMLElement>) => any;
  /**
   * Type to set on the HTML button (only applied if no href is supplied)
   */
  type?: keyof typeof Types;
  /**
   * Event that fires when the user clicks the button.
   */
  onClick?: (e: MouseEvent) => void;
  /**
   * A URL to pass to the button.
   */
  href?: string;
  /**
   * A target to pass to the HTML button.
   * See https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form#attr-target
   */
  target?: string;
  /**
   * Apply a disable state to the button.
   */
  disabled?: boolean;
  /**
   * A ref or function that resolves a ref.
   */
  refSetter?:
    | MutableRefObject<HTMLButtonElement | HTMLAnchorElement>
    | RefCallback<HTMLButtonElement | HTMLAnchorElement>;
  /**
   * Turn off automatic left-margin for button.
   */
  noAutoMargin?: boolean;
}
