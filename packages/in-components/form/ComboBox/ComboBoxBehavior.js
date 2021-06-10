/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useRef } from 'react';
import PropTypes from 'prop-types';

import { toInteractiveElement } from '@instana/components';

import ComboBoxOverlay from 'in-components/form/ComboBox/ComboBoxOverlay';
import OverlayOption from 'in-components/OverlayOption/OverlayOption';
import { compositeRef } from 'in-services/util/react';
import Overlay from 'in-components/overlays/Overlay';

export default function ComboBoxBehavior({
  options,
  value,
  onChange,
  children,
  disableAutomaticOptionSorting,
  requiresCustomInteractivity,
  ariaLabel,
  overlayAlignment = 'bottomLeft',
  listItemClassName,
  listItemAlignment
}) {
  const ref = useRef();

  return (
    <Overlay
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
      withoutWrapper
      onCloseSideEffect={e => {
        // Auto focus button in case the ESC key is used to close the overlay.
        if (e instanceof KeyboardEvent) {
          ref.current?.focus();
        }
      }}
    >
      {({ toggle, isOpen, ref: overlayRef }) => {
        let elementProps = {
          ref: compositeRef(ref, overlayRef),
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

ComboBoxBehavior.propTypes = {
  children: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.any.isRequired,
      label: PropTypes.node.isRequired
    })
  ).isRequired,
  value: PropTypes.any,

  requiresCustomInteractivity: PropTypes.bool,
  disableAutomaticOptionSorting: PropTypes.bool,
  ariaLabel: PropTypes.string,
  overlayAlignment: PropTypes.string,
  listItemClassName: PropTypes.string,
  listItemAlignment: OverlayOption.propTypes.alignment
};
