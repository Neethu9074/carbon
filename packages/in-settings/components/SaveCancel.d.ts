/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { MapForm } from 'formalistic';

interface SaveCancelProps {
  loading?: boolean;
  listPath?: string;
  cancelButtonLabel?: string;
  hasSaveButton?: boolean;
  hasCancelButton?: boolean;
  isCreate?: boolean;
  form?: MapForm;
  onClickCancelButton?: (e: React.MouseEvent<Element, MouseEvent>) => void;
  message?: string | null;
  saveEnabled?: boolean;
  type?: string;
}

declare function SaveCancelComponent(props: SaveCancelProps): JSX.Element;

export default SaveCancelComponent;
