
/**
 * Formats a date string in the "MMM DD YYYY" format.
 *
 * @param {string} dateString - The date string to need change format.
 * @returns {string} The formatted date string.
 */
export function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}