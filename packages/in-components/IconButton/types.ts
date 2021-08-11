/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { MouseEvent } from 'react';

import { SvgIconSizes } from '@instana/components';
import { Observable } from '@instana/observables';

export type Kind = 'primary' | 'primaryv2' | 'action' | 'create' | 'danger' | 'warning' | 'info';

export interface IconComponentProps {
  type: string;
  size?: 'normal' | 'compact';
  iconSize?: SvgIconSizes;
  iconSpinning?: boolean;
  kind?: Kind;
  onClick?: (e: MouseEvent<HTMLElement>) => void;
  disabled?: boolean;
  leftAligned?: boolean;
  rightAligned?: boolean;
  href?: string;
  href$?: Observable<string>;
  className?: string;
}
