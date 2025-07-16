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
        // First pass: handle radio buttons for transient events
        const transientRadioGroup = section.filters.find(f => f.radioGroup === 'transient');

        if (transientRadioGroup) {
          // Default to "Show all" if no transient filter is specified
          let selectedTransientOption = 'transient-all';

          // Check if we have a transient filter in the query
          if (Object.prototype.hasOwnProperty.call(checkedFilters, 'transient')) {
            selectedTransientOption = 'transient-only';
          } else if (Object.prototype.hasOwnProperty.call(checkedFilters, 'hide-transient')) {
            selectedTransientOption = 'non-transient-only';
          }

          // Update the checked status for all radio buttons in the transient group
          section.filters.forEach((filter, index) => {
            if (filter.radioGroup === 'transient') {
              section.filters[index].checked = filter.id === selectedTransientOption;
            }
          });
        }

        // Second pass: handle all other filters
        section.filters.forEach((filter: FilterValue) => {
          // Skip radio buttons as we already handled them
          if (filter.type === 'radio') {
            return;
          }

          // Extract the configuration name from the dfq
          const dfqMatch = filter.dfq.match(/event\.configuration:"([^"]+)"|event\.isTransient:(true|false)/);
          if (dfqMatch) {
            const configName = dfqMatch[1] || (dfqMatch[2] === 'true' ? 'transient' : 'hide-transient');
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
  // Array to hold each section's combined filters
  const sectionQueries: string[] = [];

  filters.forEach((section: FilterSection) => {
    if (section.filters && Array.isArray(section.filters)) {
      // Array to hold all checked filters for this section
      const sectionCheckedFilters: string[] = [];

      // Handle radio button groups
      const radioGroups = new Set<string>();
      section.filters.forEach(filter => {
        if (filter.type === 'radio' && filter.radioGroup) {
          radioGroups.add(filter.radioGroup);
        }
      });

      // Process each radio group
      radioGroups.forEach(groupName => {
        const checkedRadio = section.filters.find(filter => filter.radioGroup === groupName && filter.checked);

        // Only add non-empty dfq values to the filter query
        // This handles the "Show all" case which has an empty dfq
        if (checkedRadio && checkedRadio.dfq) {
          sectionCheckedFilters.push(checkedRadio.dfq);
        }
      });

      // Add all other checked filters (non-radio buttons)
      section.filters.forEach((filter: FilterValue) => {
        // Skip radio buttons since we handled them separately
        if (filter.type === 'radio') {
          return;
        }

        if (filter.checked) {
          sectionCheckedFilters.push(filter.dfq);
        }
      });

      // If this section has any checked filters, add them to the section queries
      // wrapped in parentheses and joined with OR
      if (sectionCheckedFilters.length > 0) {
        // Only add parentheses if there's more than one filter in the section
        const sectionQuery =
          sectionCheckedFilters.length > 1 ? `(${sectionCheckedFilters.join(' OR ')})` : sectionCheckedFilters[0];

        sectionQueries.push(sectionQuery);
      }
    }
  });

  // Join all section queries with AND
  return sectionQueries.join(' AND ');
}
