/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

/**
 * Function to build query string from list of queries
 * @param list list of queries
 * @param keyword keyword to be used in query
 * @returns {string} final query string
 */
const buildQueryString = (list: string[], keyword: string) => {
  let queryString = '';

  list.forEach((item, index) => {
    queryString += `${keyword}:"${item}"`;
    if (index < list.length - 1) {
      queryString += ' OR ';
    }
  });

  return queryString;
};

export default buildQueryString;
