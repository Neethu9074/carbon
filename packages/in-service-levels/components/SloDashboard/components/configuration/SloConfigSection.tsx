/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { ColumnizedContent, ColumnizedDefinition, Li, Typography, Ul } from '@instana/components';

import { ApplicationSloTabData, SloTabData } from 'in-service-levels/components/SloDashboard/tabs';

export type SloConfigSectionData = SloTabData | ApplicationSloTabData;

type ShouldRender = (data: SloConfigSectionData) => boolean;

export interface RowDefinition {
  id: string;
  columns: (ColumnizedDefinition & { shouldRender?: ShouldRender })[];
  shouldRender?: ShouldRender;
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
        <Ul framed={false}>
          {contentDefinitions.map(row => {
            if (row.shouldRender?.(data) ?? true) {
              return (
                <Li key={row.id} noAlternatingBg>
                  <ColumnizedContent
                    columnDefinitions={row.columns.flatMap(col => {
                      const { shouldRender, ...originalCol } = col;
                      return shouldRender?.(data) ?? true
                        ? {
                            width: '50%',
                            shrink: false,
                            verticallyCenter: true,
                            ...originalCol
                          }
                        : [];
                    })}
                    data={data}
                  />
                </Li>
              );
            }
            return null;
          })}
        </Ul>
      )}
      initiallyOpen
      noNestedFrame
    >
      <Typography component="h2" variant="body-regular" noMargin>
        {label}
      </Typography>
    </Li>
  );
}
