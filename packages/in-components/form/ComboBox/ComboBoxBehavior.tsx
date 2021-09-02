/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { PropsWithRef, ReactNode, Ref, useRef } from 'react';

import { toInteractiveElement } from '@instana/components';

import ComboBoxOverlay, { ComboBoxOption, ComboBoxOverlayProps } from 'in-components/form/ComboBox/ComboBoxOverlay';
import { OverlayOptionAlignments } from 'in-components/OverlayOption/OverlayOption';
import { Align } from 'in-components/overlays/Overlay/types';
import { compositeRef } from 'in-services/util/react';
import Overlay from 'in-components/overlays/Overlay';

interface ElementProps extends Partial<ReturnType<typeof toInteractiveElement>> {
  ref: Ref<HTMLElement>;
}

interface ChildrenProps<OPTION_VALUE_TYPE> {
  options: ComboBoxOption<OPTION_VALUE_TYPE>[];
  value: OPTION_VALUE_TYPE;
  isOpen: boolean;
  elementProps: PropsWithRef<ElementProps>;
}

interface ComboboxBehaviorProps<OPTION_VALUE_TYPE> {
  children: (p: ChildrenProps<OPTION_VALUE_TYPE | undefined>) => ReactNode;
  onChange: (v: any) => void;
  options: ComboBoxOption<OPTION_VALUE_TYPE>[];

  value?: OPTION_VALUE_TYPE;
  requiresCustomInteractivity?: boolean;
  disableAutomaticOptionSorting?: boolean;
  'aria-label'?: string;
  overlayAlignment?: Align;
  listItemClassName?: string;
  listItemAlignment?: OverlayOptionAlignments;
}

export default function ComboBoxBehavior<OPTION_VALUE_TYPE>({
  options,
  value,
  onChange,
  children,
  disableAutomaticOptionSorting,
  requiresCustomInteractivity,
  'aria-label': ariaLabel,
  overlayAlignment = 'bottomLeft',
  listItemClassName,
  listItemAlignment
}: ComboboxBehaviorProps<OPTION_VALUE_TYPE>) {
  const ref = useRef<HTMLElement>();

  return (
    <Overlay<ComboBoxOverlayProps<OPTION_VALUE_TYPE>>
      content={ComboBoxOverlay}
      props={{
        options,
        value,
        onChange(newValue) {
          ref.current?.focus();
          onChange(newValue);
        },
        disableAutomaticOptionSorting,
        listItemClassName,
        listItemAlignment
      }}
      align={overlayAlignment}
      onCloseSideEffect={e => {
        // Auto focus button in case the ESC key is used to close the overlay.
        if (e instanceof KeyboardEvent) {
          ref.current?.focus();
        }
      }}
      withoutWrapper
    >
      {({ toggle, isOpen, ref: overlayRef }) => {
        let elementProps: PropsWithRef<ElementProps> = {
          ref: compositeRef<HTMLElement>(ref, overlayRef),
          onClick: toggle
        };
        if (requiresCustomInteractivity) {
          elementProps = {
            ...elementProps,
            ...toInteractiveElement({
              onDefaultInteraction: toggle,
              ariaLabel
            })
          };
        }

        return children({
          options,
          value,
          isOpen: isOpen,
          elementProps
        });
      }}
    </Overlay>
  );
}
