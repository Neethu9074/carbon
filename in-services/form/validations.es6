import {parse} from 'lucene';


export function QueryValidator(query) {
  try {
    parse(query);
    return null;
  } catch (e) {
    return [{
      severity: 'error',
      message: `Please enter a valid lucene query. Parsing error: ${e.message}`
    }];
  }
}
