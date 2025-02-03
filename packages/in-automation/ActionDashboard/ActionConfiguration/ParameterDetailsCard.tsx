/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import {
  CarbonColumn,
  CarbonGrid,
  CarbonRow,
  CarbonStack,
  CarbonTable,
  CarbonTableBody,
  CarbonTableCell,
  CarbonTableHead,
  CarbonTableHeader,
  CarbonTableRow,
  CarbonTile,
  Typography
} from '@instana/components';
import { Action } from '@instana/types';

import { Nullish } from 'in-types';

import local from 'in-automation/ActionDashboard/ActionDashboard.mless';

interface ActionDetailsCardProps {
  data: Action | Nullish;
}

export default function ActionDetailsCard({ data }: ActionDetailsCardProps) {
  if (!data) return null;
  const { inputParameters } = data;

  return (
    <CarbonTile>
      <CarbonStack orientation="horizontal" className={local.titleStack}>
        <Typography variant="heading-02">Parameter details</Typography>
      </CarbonStack>
      <CarbonRow>
        <CarbonGrid fullWidth className={local.noHorizontalPaddings}>
          <CarbonColumn span="100%">
            <CarbonTable aria-label="sample table">
              <CarbonTableHead>
                <CarbonTableRow>
                  <CarbonTableHeader>Display name</CarbonTableHeader>
                  <CarbonTableHeader>Name</CarbonTableHeader>
                  <CarbonTableHeader>Description</CarbonTableHeader>
                  <CarbonTableHeader>Type</CarbonTableHeader>
                </CarbonTableRow>
              </CarbonTableHead>
              <CarbonTableBody>
                {inputParameters?.map(parameter => (
                  <CarbonTableRow key={parameter.label}>
                    <CarbonTableCell>{parameter.label}</CarbonTableCell>
                    <CarbonTableCell>{parameter.name}</CarbonTableCell>
                    <CarbonTableCell>{parameter.description}</CarbonTableCell>
                    <CarbonTableCell>{parameter.type}</CarbonTableCell>
                  </CarbonTableRow>
                ))}
              </CarbonTableBody>
            </CarbonTable>
          </CarbonColumn>
        </CarbonGrid>
      </CarbonRow>
    </CarbonTile>
  );
}
