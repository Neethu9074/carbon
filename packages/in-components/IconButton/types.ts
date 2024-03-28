/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { MouseEvent } from 'react';

import { SvgIconSizes } from '@instana/components';
import { Observable } from '@instana/observables';

export type Kind = 'primary' | 'primaryv2' | 'secondary' | 'action' | 'create' | 'danger' | 'warning' | 'info';

export interface IconComponentProps {
  type: string;
  size?: 'normal' | 'compact';
  iconSize?: keyof typeof SvgIconSizes | number;
  iconSpinning?: boolean;
  kind?: Kind;
  onClick?: (e: MouseEvent<HTMLElement>) => void;
  disabled?: boolean;
  alignment?: 'left' | 'right';
  href?: string;
  href$?: Observable<string>;
  className?: string;
  id?: string;
  color?: string;
}
