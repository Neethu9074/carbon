/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import { CustomPayloadFieldUnion } from '@instana/types/typeDefinitions';

interface Props {
  customPayloadFields?: CustomPayloadFieldUnion[];
  TagBasedPayloadConfigurator?: React.ReactNode;
  title?: string;
  noCustomPayloadConfiguredText?: string;
  openByDefault?: boolean;
  alternatingBg?: boolean;
}

export default function CustomPayloadCard(props: Props);
