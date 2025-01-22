/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

export const returnFirstDeleteableDate = () => {
  const today = new Date();
  today.setDate(today.getDate() - 30); // 30 days back from now because is the maximum to play with the graph
  today.setHours(0, 0, 0, 0);
  return today;
};

export const returnNumberLogsToDeleteMock = (startDate: any, endDate: any) => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const timeDifference = end.getTime() - start.getTime();
  const dayDifference = timeDifference / (1000 * 3600 * 24);

  if (dayDifference > 25) {
    return 1123;
  } else if (dayDifference >= 10 && dayDifference <= 25) {
    return 514;
  } else if (dayDifference < 100) {
    return 87;
  }

  return 0;
};
