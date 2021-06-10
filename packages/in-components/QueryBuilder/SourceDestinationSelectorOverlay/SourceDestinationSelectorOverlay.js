/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import PropTypes from 'prop-types';
import React from 'react';

import { ColumnizedContent } from '@instana/components';
import { SvgIcon } from '@instana/components';
import { Ul } from '@instana/components';

import { source, destination } from 'in-components/QueryBuilder/SourceDestinationSelectorOverlay/supportedSelections';
import { onArrowKeyDownFocusSiblings } from 'in-services/util/domFocus';
import OverlayOption from 'in-components/OverlayOption/OverlayOption';
import { t } from 'in-i18n';

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
        <ColumnizedContent
          columnDefinitions={columnDefinitions}
          icon="lib_application_call_source"
          label={t('in-components:queryBuilder.source')}
        />
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
          label={t('in-components:queryBuilder.destination')}
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
