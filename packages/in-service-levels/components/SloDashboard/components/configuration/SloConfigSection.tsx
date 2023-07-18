/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { ColumnizedContent, ColumnizedDefinition, Li, Ul } from '@instana/components';

import { ApplicationSloTabData, SloTabData } from 'in-service-levels/components/SloDashboard/tabs';

export type SloConfigSectionData = SloTabData | ApplicationSloTabData;
export interface RowDefinition {
  id: string;
  columns: ColumnizedDefinition[];
  shouldRender?: (data: SloConfigSectionData) => boolean;
}

interface SloConfigSectionProps {
  data: SloConfigSectionData;
  label: string;
  contentDefinitions: RowDefinition[];
}

export default function SloConfigSection({ data, label, contentDefinitions }: SloConfigSectionProps) {
  return (
    <Li
      renderNestedContent={() => (
        <Ul>
          {contentDefinitions.map(row => {
            if (row.shouldRender?.(data) ?? true) {
              return (
                <Li key={row.id}>
                  <ColumnizedContent columnDefinitions={row.columns} data={data} />
                </Li>
              );
            }
            return null;
          })}
        </Ul>
      )}
      initiallyOpen
    >
      {label}
    </Li>
  );
}
