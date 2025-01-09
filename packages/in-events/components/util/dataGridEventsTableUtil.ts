/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

export default function parseQuery(query: string | null | undefined): Record<string, boolean> {
  const MAX_QUERY_LENGTH = 200;
  let result: Record<string, boolean> = {};

  if (query == null || query.length > MAX_QUERY_LENGTH) {
    return result;
  }

  try {
    // Break down the query string into tokens
    let tokens = query.match(/(event\.configuration\s*:\s*"[^"]+"|\(|\)|NOT)/g);

    if (!tokens) {
      throw new Error('Invalid query format');
    }

    while (tokens.length > 0) {
      let token = tokens.shift()?.trim();
      if (!token) continue;

      if (token === 'NOT') {
        // Handle NOT expressions
        let nextToken = tokens.shift()?.trim();
        if (!nextToken) {
          throw new Error('Malformed query: unexpected end after NOT');
        }

        if (nextToken.includes('event.configuration:')) {
          let value = nextToken.split(':')[1].replace(/"/g, '').trim();
          result[value] = false; // Mark as NOT selected
        } else if (nextToken === '(') {
          // Handle NOT with nested expression
          let subQuery = '';
          let openBrackets = 1;

          while (openBrackets > 0 && tokens.length > 0) {
            let subToken = tokens.shift()?.trim();
            if (!subToken) continue;

            if (subToken === '(') {
              openBrackets++;
            } else if (subToken === ')') {
              openBrackets--;
            }

            if (openBrackets > 0) {
              subQuery += subToken + ' ';
            }
          }

          if (openBrackets > 0) {
            throw new Error('Malformed query: mismatched parentheses');
          }

          // Recursively parse the sub-expression with NOT
          let subResult = parseQuery(subQuery.trim());
          // Negate the results
          for (let key in subResult) {
            result[key] = !subResult[key];
          }
        }
      } else if (token.includes('event.configuration:')) {
        // Extract the value after event.configuration:
        let value = token.split(':')[1].replace(/"/g, '').trim();
        result[value] = true; // Mark as selected
      } else if (token === '(') {
        // Handle sub-expression with a recursive call
        let subQuery = '';
        let openBrackets = 1;

        while (openBrackets > 0 && tokens.length > 0) {
          let subToken = tokens.shift()?.trim();
          if (!subToken) continue;

          if (subToken === '(') {
            openBrackets++;
          } else if (subToken === ')') {
            openBrackets--;
          }

          if (openBrackets > 0) {
            subQuery += subToken + ' ';
          }
        }

        if (openBrackets > 0) {
          throw new Error('Malformed query: mismatched parentheses');
        }

        // Recursively parse the sub-expression
        let subResult = parseQuery(subQuery.trim());
        result = { ...result, ...subResult };
      }
    }

    return result;
  } catch (error) {
    return {}; // Return an empty result if the query is malformed
  }
}
