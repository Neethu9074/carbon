import PropTypes from 'prop-types';
import React from 'react';

import {
  source,
  destination
} from 'in-new-components/QueryBuilder/SourceDestinationSelectorOverlay/supportedSelections';
import OverlayOption from 'in-new-components/QueryBuilder/OverlayOption/OverlayOption';
import { Ul } from 'in-new-components/lists/List/List';
import SvgIcon from 'in-components/SvgIcon';

import locals from './SourceDestinationSelectorOverlay.mless';

export default function SourceDestinationSelectorOverlay({ value, onChange, close }) {
  return (
    <Ul framed={false} className={locals.list} borderRadius="medium">
      <OverlayOption
        autoFocus={value !== destination}
        className={locals.option}
        onChange={onChange}
        close={close}
        selectedValue={value}
        value={source}
      >
        <SvgIcon size="s" type="lib_application_call_source" /> Source
      </OverlayOption>
      <OverlayOption
        className={locals.option}
        onChange={onChange}
        close={close}
        selectedValue={value}
        value={destination}
      >
        <SvgIcon size="s" type="lib_application_call_destination" /> Destination
      </OverlayOption>
    </Ul>
  );
}

SourceDestinationSelectorOverlay.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  close: PropTypes.func.isRequired
};
