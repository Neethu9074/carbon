import PropTypes from 'prop-types';
import React, { useRef } from 'react';

import { toInteractiveElement } from 'in-new-components/interactiveCustomElement';
import ComboBoxOverlay from 'in-components/form/ComboBox/ComboBoxOverlay';
import Overlay from 'in-new-components/overlays/Overlay';
import { compositeRef } from 'in-services/util/react';

export default function ComboBoxBehavior({
  options,
  value,
  onChange,
  children,
  disableAutomaticOptionSorting,
  requiresCustomInteractivity,
  ariaLabel,
  overlayAlignment = 'bottomLeft'
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
        disableAutomaticOptionSorting
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
  overlayAlignment: PropTypes.string
};
