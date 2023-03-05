/**
 * Capitalize the string (used in capitalizing the main component function)
 * @param {string} string A string to capitalize
 * @returns {string} Capitalized string
 */
export function capitalCase(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
