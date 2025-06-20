/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { FilterSection, FilterValue } from 'in-events/components/IncidentPage/EventsDatagrid/EventFilterSections';

export type FilterSections = FilterSection[];

/**
 * Parses a query string and updates the filter sections with checked status
 * @param query The query string to parse
 * @param filterSections The original filter sections
 * @returns A deep copy of filterSections with updated checked status
 */
export function parseQueryToFilters(query: string | null | undefined, filterSections: FilterSections): FilterSections {
  // Create a deep copy of the filter sections to avoid mutating the original
  const filters: FilterSections = JSON.parse(JSON.stringify(filterSections));

  if (!query) {
    return filters;
  }

  try {
    // Parse the query to get a record of which filters are checked
    const checkedFilters = parseQuery(query);

    // Update the checked status in our filter sections copy
    filters.forEach((section: FilterSection) => {
      if (section.filters && Array.isArray(section.filters)) {
        // First pass: handle the toggle for transient events
        const showTransientToggleIndex = section.filters.findIndex(f => f.id === 'show-transient');
        if (showTransientToggleIndex !== -1) {
          // If "event.isTransient:false" is in the query, the toggle should be off
          if (Object.prototype.hasOwnProperty.call(checkedFilters, 'hide-transient')) {
            section.filters[showTransientToggleIndex].checked = false;

            // Find and disable the transient checkbox
            const transientCheckboxIndex = section.filters.findIndex(f => f.id === 'transient');
            if (transientCheckboxIndex !== -1) {
              section.filters[transientCheckboxIndex].disabled = true;
              section.filters[transientCheckboxIndex].checked = false;
            }
          } else {
            // Default is to show transient events (toggle on)
            section.filters[showTransientToggleIndex].checked = true;
          }
        }

        // Second pass: handle all other filters
        section.filters.forEach((filter: FilterValue) => {
          // Skip the show-transient toggle as we already handled it
          if (filter.id === 'show-transient') {
            return;
          }

          // Extract the configuration name from the dfq
          const dfqMatch = filter.dfq.match(/event\.configuration:"([^"]+)"|event\.isTransient:true/);
          if (dfqMatch) {
            const configName = dfqMatch[1] || 'transient'; // Handle special case for transient
            // Update checked status if it exists in the parsed query
            if (Object.prototype.hasOwnProperty.call(checkedFilters, configName)) {
              filter.checked = checkedFilters[configName];
            }
          }
        });
      }
    });

    return filters;
  } catch (error) {
    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.error('Error parsing query to filters:', error);
    }
    return filters;
  }
}

/**
 * Parses a query string and returns a record of which filters are checked
 * @param query The query string to parse
 * @returns A record with filter names as keys and boolean checked status as values
 */
function parseQuery(query: string | null | undefined): Record<string, boolean> {
  let result: Record<string, boolean> = {};

  if (query == null) {
    return result;
  }

  try {
    // Break down the query string into tokens
    let tokens = query.match(/(event\.configuration\s*:\s*"[^"]+"|\(|\)|NOT|event\.isTransient\s*:\s*(true|false))/g);

    if (!tokens) {
      return result;
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
      } else if (token === 'event.isTransient:true') {
        // Handle the special case for transient events
        result['transient'] = true;
      } else if (token === 'event.isTransient:false') {
        // Handle the special case for hiding transient events
        result['hide-transient'] = true;
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
    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.error('Error parsing query:', error);
    }
    return {}; // Return an empty result if the query is malformed
  }
}

/**
 * Converts filters back to a query string
 * @param filters The filter sections with checked status
 * @returns A query string representing the checked filters
 */
export function filtersToQuery(filters: FilterSections): string {
  const checkedFilters: string[] = [];

  filters.forEach((section: FilterSection) => {
    if (section.filters && Array.isArray(section.filters)) {
      // Handle special case for show-transient toggle
      const showTransientToggle = section.filters.find(f => f.id === 'show-transient');

      // If the toggle exists and is off (hide transient events), add the filter
      if (showTransientToggle && !showTransientToggle.checked) {
        checkedFilters.push(showTransientToggle.dfq);
      }

      // Add all other checked filters
      section.filters.forEach((filter: FilterValue) => {
        // Skip the toggle since we handled it separately
        if (filter.id === 'show-transient') {
          return;
        }

        if (filter.checked) {
          checkedFilters.push(filter.dfq);
        }
      });
    }
  });

  return checkedFilters.join(' OR ');
}
