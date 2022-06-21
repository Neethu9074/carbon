/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

interface SaveCancelProps {
  loading?: boolean;
  listPath?: string;
  cancelButtonLabel?: string;
  hasSaveButton?: boolean;
}

declare function SaveCancelComponent(props: SaveCancelProps): JSX.Element;

export default SaveCancelComponent;
