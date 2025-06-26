const {
  listBases,
  listRecords,
  createRecord,
  createBase
} = require('../services/airtableService');

const {
  ACCOUNT_API_KEY,
  ACCOUNT_WORKSPACE_ID,
  HISTORY_API_KEY,
  HISTORY_WORKSPACE_ID
} = process.env;

// Field definitions for the account base
const accountFields = [
  { name: 'username', type: 'singleLineText' },
  { name: 'password', type: 'singleLineText' }
];

// Updated field definitions for the history base
// Renamed columns (e.g., 'res4k' instead of '4k') and using "multilineText" for long text.
const historyFields = [
  { name: 'name', type: 'singleLineText' },
  { name: 'imageUrl', type: 'singleLineText' },
  { name: '4k', type: 'url' },
  { name: '4kta', type: 'url' },
  { name: '4kte', type: 'url' },
  { name: '4kma', type: 'url' },
  { name: '4ken', type: 'url' },
  { name: '1080pta', type: 'url' },
  { name: '1080pte', type: 'url' },
  { name: '1080pma', type: 'url' },
  { name: '1080pen', type: 'url' },
  { name: '720pta', type: 'url' },
  { name: '720pte', type: 'url' },
  { name: '720pma', type: 'url' },
  { name: '720pen', type: 'url' },
  { name: '480pta', type: 'url' },
  { name: '480pte', type: 'url' },
  { name: '480pma', type: 'url' },
  { name: '480pen', type: 'url' },
  { name: 'script', type: 'multilineText' },
  { name: 'category', type: 'singleLineText' },
  { name: 'type', type: 'singleLineText' },
  { name: 'totalseason', type: 'singleLineText' },
  { name: 'quality', type: 'singleLineText' },
  {
    name: "lastWatched",
    type: "date",
    options: {
      dateFormat: { name: "iso" }
    }
  },
  { name: 'season', type: 'number', options: { precision: 1 } },
  { name: 'episode', type: 'number', options: { precision: 1 } },
  { name: 'episodename', type: 'singleLineText' },
  { name: 'episodeimageurl', type: 'url' },
  { name: 'contentid', type: 'singleLineText' },
  { name: 'leaving', type: 'number', options: { precision: 1 } },
  { name: 'languages', type: 'singleLineText' }
];

const allowedFields = [
  'name', 'imageurl', '4kta', '4kte', '4kma', '4ken',
  '1080pta', '1080pte', '1080pma', '1080pen',
  '720pta', '720pte', '720pma', '720pen',
  '480pta', '480pte', '480pma', '480pen',
  'script', 'category', 'type', 'totalseason', 'quality',
  'lastWatched', 'season', 'episode', 'episodename', 'episodeimageurl',
  'contentid', 'leaving', 'languages'
];

/**
 * Get all "account" bases from the Account workspace.
 */
async function getAccountBases() {
  console.log('[AIRTABLE CTRL] getAccountBases()');
  const bases = await listBases(ACCOUNT_API_KEY, ACCOUNT_WORKSPACE_ID);
  return bases.filter(b => b.name.toLowerCase().includes('account'));
}

/**
 * Get all records from a specified account base.
 */
async function getRecordsFromBase(baseId) {
  console.log('[AIRTABLE CTRL] getRecordsFromBase()', baseId);
  return await listRecords(ACCOUNT_API_KEY, baseId);
}

/**
 * Add a user record (username and password) to an account base.
 */
async function addUserRecord(baseId, username, password) {
  console.log('[AIRTABLE CTRL] addUserRecord()', baseId, username);
  return await createRecord(ACCOUNT_API_KEY, baseId, 'Table 1', { username, password });
}

/**
 * Create a new account base when no existing bases have capacity.
 */
async function createNewAccountBase() {
  const baseName = `account-${Date.now()}`;
  console.log('[AIRTABLE CTRL] createNewAccountBase()', baseName);
  return await createBase(
    ACCOUNT_API_KEY,
    ACCOUNT_WORKSPACE_ID,
    baseName,
    [{ name: 'Table 1', fields: accountFields }]
  );
}

/**
 * Create a history base for a user.
 */
async function createHistoryBase(username) {
  console.log('[AIRTABLE CTRL] createHistoryBase() for username:', username);
  return await createBase(
    HISTORY_API_KEY,
    HISTORY_WORKSPACE_ID,
    username,
    [{ name: 'Table 1', fields: historyFields }]
  );
}



module.exports = {
  getAccountBases,
  getRecordsFromBase,
  addUserRecord,
  createNewAccountBase,
  createHistoryBase,

};
