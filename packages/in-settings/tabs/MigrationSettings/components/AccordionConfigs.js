/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc.
 */

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { noop } from 'lodash';

import { just } from '@instana/observables';

import AccordionListPresenter from './AccordionListPresenter';

export default function AccordionConfigs({
  configs,
  label,
  icon,
  checked,
  onChange,
  configType,
  toggleContentOnRowClick
}) {
  const [labelWithCount, setLabelWithCount] = useState(label);

  useEffect(() => {
    if (configs) setLabelWithCount(label + ' (' + configs.length + ')');
  }, [configs, label, setLabelWithCount]);

  return (
    <>
      <AccordionListPresenter
        apiSubscriptions={{
          getApplicationsCursorPaginated: () =>
            just({
              data: {
                items: [
                  {
                    application: {
                      id: configType,
                      label: labelWithCount,
                      isStaleItem: true
                    }
                  }
                ]
              }
            }),
          getApplication: () =>
            just({
              data: {
                id: configType,
                label: labelWithCount,
                isStaleItem: true
              }
            }),
          getServicesCursorPaginated: () =>
            just({
              data: {
                items: configs
                // page: 1,
                // pageSize: 10,
                // totalHits: 1
              },
              time: 1607606463167,
              adjustedWindowSize: null,
              errors: [],
              progress: {
                percentage: null,
                loading: false,
                note: null
              }
            }),
          getEndpointsCursorPaginated: () => just({ data: { items: [] } })
        }}
        applicationsSelection={{}}
        boundaryScope="INBOUND"
        timeConfig={{ windowSize: 86400000 }}
        onChange={onChange ? onChange : noop}
        includeSynthetic={false}
        icon={icon}
        entityType={configType}
        checked={checked}
        toggleContentOnRowClick={toggleContentOnRowClick}
      />
    </>
  );
}

AccordionConfigs.propTypes = {
  onChange: PropTypes.func,
  checked: PropTypes.bool,
  icon: PropTypes.string,
  label: PropTypes.string,
  toggleContentOnRowClick: PropTypes.bool.isRequired,
  configs: PropTypes.array,
  configType: PropTypes.string
};
