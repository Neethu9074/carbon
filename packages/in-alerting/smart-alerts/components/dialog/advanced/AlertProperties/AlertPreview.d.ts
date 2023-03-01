/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { MapForm } from 'formalistic';
import { ReactNode } from 'react';

interface AlertPreviewProps {
  form: MapForm;
  renderHeadline: () => ReactNode;
  getDescriptionPlaceholder: (form: MapForm) => string;
  entityIconType: string;
  entityLabel?: string;
}

export function AlertPreview({
  form,
  renderHeadline,
  getDescriptionPlaceholder,
  entityLabel,
  entityIconType
}: AlertPreviewProps);

interface AlertPreviewHeadlineProps {
  title: string;
}

export function AlertPreviewHeadline({ title }: AlertPreviewHeadlineProps);
