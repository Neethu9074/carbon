/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import PropTypes from 'prop-types';
import React from 'react';

import {
  source,
  destination
} from 'in-new-components/QueryBuilder/SourceDestinationSelectorOverlay/supportedSelections';
import OverlayOption from 'in-new-components/OverlayOption/OverlayOption';
import { onArrowKeyDownFocusSiblings } from 'in-services/util/domFocus';
import { ColumnizedContent } from 'in-new-components/lists/List';
import { Ul } from 'in-new-components/lists/List/List';
import SvgIcon from 'in-components/SvgIcon';

import locals from './SourceDestinationSelectorOverlay.mless';

const columnDefinitions = [
  {
    width: '2rem',
    getContent({ icon }) {
      return <SvgIcon className={locals.icon} type={icon} />;
    }
  },
  {
    getContent({ label }) {
      return label;
    }
  }
];

export default function SourceDestinationSelectorOverlay({ value, onChange, close }) {
  return (
    <Ul framed={false} className={locals.list} borderRadius="medium" onKeyDown={onArrowKeyDownFocusSiblings}>
      <OverlayOption
        autoFocus={value !== destination}
        className={locals.option}
        onChange={onChange}
        close={close}
        selectedValue={value}
        value={source}
        size="compact"
      >
        <ColumnizedContent columnDefinitions={columnDefinitions} icon="lib_application_call_source" label="Source" />
      </OverlayOption>
      <OverlayOption
        className={locals.option}
        onChange={onChange}
        close={close}
        selectedValue={value}
        size="compact"
        value={destination}
      >
        <ColumnizedContent
          columnDefinitions={columnDefinitions}
          icon="lib_application_call_destination"
          label="Destination"
        />
      </OverlayOption>
    </Ul>
  );
}

SourceDestinationSelectorOverlay.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  close: PropTypes.func.isRequired
};
