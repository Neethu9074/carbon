/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

type TransferStates = Record<number, string>;

export const StatesMap: TransferStates = {
  0: 'CompletedTransfer',
  1: 'CancelledInProgressTransfer',
  2: 'CancelledNewTransfer',
  3: 'CompleteReceivedTransfer',
  4: 'FailedTransferEnding',
  5: 'NegotiatingTransfer',
  6: 'NewReceiverTransfer',
  7: 'NewSenderTransfer',
  8: 'RecoveringTransfer',
  9: 'RecoveryTimedOut',
  10: 'RestartingTransfer',
  11: 'ResumingTransfer',
  12: 'ReSynchronisingTransfer',
  13: 'RunningTransfer',
  14: 'WaitingForDestinationCapacity'
};
