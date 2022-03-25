/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc.
 */

import React, { useEffect, useState } from 'react';
import { noop } from 'lodash';

import { just } from '@instana/observables';

import AccordionListPresenter from './AccordionListPresenter';

export default function AccordionConfigs({ configs, label, id, icon, checked, onChange }) {
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
                      id: id,
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
                id: id,
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
            })
        }}
        alertApplicationId="btg-B701Rx6o9QNXUS4TVw"
        applicationsSelection={{}}
        boundaryScope="INBOUND"
        timeConfig={{ windowSize: 86400000 }}
        onChange={onChange ? onChange : noop}
        includeSynthetic={false}
        icon={icon}
        checked={checked}
      />
    </>
  );
}
