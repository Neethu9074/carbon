/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { MapForm } from 'formalistic';
import { ReactNode } from 'react';

import { HighlightedPlaceholders } from 'in-alerting/smart-alerts/components/dialog/advanced/placeholderUtil';

interface AlertPreviewProps {
  form: MapForm;
  renderHeadline: () => ReactNode;
  getDescriptionPlaceholder: (form: MapForm) => string;
  entityIconType: string;
  entityLabel?: string;
  entityIconType2?: string;
  entityLabel2?: string;
}

export function AlertPreview({
  form,
  renderHeadline,
  getDescriptionPlaceholder,
  entityLabel,
  entityIconType,
  entityLabel2,
  entityIconType2
}: AlertPreviewProps);

interface AlertPreviewHeadlineProps {
  title: string | HighlightedPlaceholders;
}

export function AlertPreviewHeadline({ title }: AlertPreviewHeadlineProps);
