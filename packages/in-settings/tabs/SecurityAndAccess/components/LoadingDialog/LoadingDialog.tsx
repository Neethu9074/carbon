/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { CarbonModal, LoadingSkeleton } from '@instana/components';

import locals from './LoadingDialog.mless';

const MAX_SKELETON_WIDTH = 80; // percent

interface LoadingDialogProps {
  numberSkeletons: number;
}

export default function LoadingDialog({ numberSkeletons }: LoadingDialogProps) {
  return (
    <CarbonModal
      modalHeading={<LoadingSkeleton className={locals.skeleton} />}
      open
      primaryButtonDisabled
      primaryButtonText={<LoadingSkeleton />}
      secondaryButtonText={<LoadingSkeleton />}
      size="lg"
    >
      {Array(numberSkeletons)
        .fill(null)
        .map((_, index) => (
          <div key={`loading-skeleton-${index}`} style={{ width: `${Math.random() * MAX_SKELETON_WIDTH}%` }}>
            <LoadingSkeleton className={locals.skeleton} />
          </div>
        ))}
    </CarbonModal>
  );
}
