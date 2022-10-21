/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { MapForm } from 'formalistic';
import { ReactNode } from 'react';

interface SelectListDialogButtonProps {
  form: MapForm;
  onSubmit: (selectedIds: string[]) => void;
  title: string;
  label: string;
  listComponent: ReactNode;
  limit: number;
  hiddenIds: string[];
  createSubmitLabel: (numberOfItems: number) => string;
  requiresAtLeastOneMessage: string;
}

declare function SelectListDialogButton(props: SelectListDialogButtonProps): JSX.Element;

export default SelectListDialogButton;
