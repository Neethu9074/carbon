/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

export const MessageTypeEnum = messageType => {
  switch (messageType) {
    case 1:
      return 'COMPLETION';
    case 2:
      return 'DIAGNOSTIC';
    case 3:
      return 'ESCAPE';
    case 4:
      return 'INFORMATIONAL';
    case 5:
      return 'INQUIRY';
    case 6:
      return 'NOTIFY';
    case 7:
      return 'REPLY';
    case 8:
      return 'REQUEST';
    case 9:
      return 'SENDER';
    default:
      return '-';
  }
};
