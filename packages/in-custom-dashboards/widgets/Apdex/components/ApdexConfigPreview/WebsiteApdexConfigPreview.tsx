/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import ApdexConfigPreview from 'in-custom-dashboards/widgets/Apdex/components/ApdexConfigPreview';
import { TagFilterExpressionElementUnion } from 'in-types';

interface WebsiteApdexConfigPreviewProps {
  entityId: string;
  threshold?: number;
  tagFilterExpression?: TagFilterExpressionElementUnion;
}

export default function WebsiteApdexConfigPreview({
  entityId,
  tagFilterExpression,
  threshold
}: WebsiteApdexConfigPreviewProps) {
  return (
    <ApdexConfigPreview
      apdexEntity={{
        apdexType: 'website',
        beaconType: 'httpRequest',
        entityId,
        threshold,
        tagFilterExpression
      }}
    />
  );
}
