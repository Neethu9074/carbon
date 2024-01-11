/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

export const TcpStatusEnum = tcpState => {
  switch (tcpState) {
    case 0:
      return 'CLOSED';
    case 1:
      return 'CLOSE_WAIT';
    case 2:
      return 'CLOSING';
    case 3:
      return 'ESTABLISHED';
    case 4:
      return 'FIN_WAIT_1';
    case 5:
      return 'FIN_WAIT_2';
    case 6:
      return 'LAST_ACK';
    case 7:
      return 'LISTEN';
    case 8:
      return 'SYN_RECEIVED';
    case 9:
      return 'SYN_SENT';
    case 10:
      return 'TIME_WAIT';
    default:
      return '-';
  }
};

export const ProtocolEnum = protocol => {
  switch (protocol) {
    case 1:
      return 'TCP';
    case 2:
      return 'UDP';
    default:
      return '-';
  }
};
