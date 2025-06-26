const crypto = require('crypto');

/**
 * Generate a unique, deterministic contentid for any content.
 * @param {Object} content - The content object.
 * @param {string} content.type - 'movie', 'series', or 'anime'
 * @param {string} content.name - The name/title of the content
 * @param {string|number} [content.season] - Season number (for series/anime)
 * @param {string|number} [content.episode] - Episode number (for series/anime)
 * @returns {string} - A unique contentid
 */
function generateContentId({ type, name, season, episode }) {
  let base = `${type}:${name}`;
  if (type === 'series' || type === 'anime') {
    base += `:S${season || 1}:E${episode || 1}`;
  }
  return crypto.createHash('md5').update(base.toLowerCase().trim()).digest('hex');
}

module.exports = generateContentId; 