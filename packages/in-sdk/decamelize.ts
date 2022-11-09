/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

export default function decamelize(str: string): string {
  const parts: string[] = [];
  for (let index = 0; index < str.length; index++) {
    if (index == 0 || isUppercase(str[index])) {
      parts.push(str[index].toUpperCase());
    } else {
      parts[parts.length - 1] = parts[parts.length - 1] + str[index];
    }
  }
  return parts.join(' ');
}

function isUppercase(char: string): boolean {
  return char.toUpperCase() === char;
}
