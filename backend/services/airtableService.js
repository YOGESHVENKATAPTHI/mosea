const axios = require('axios');
const Airtable = require('airtable');

const getApiKey = (type) => {
  if (type === 'movies') return process.env.MOVIES_API_KEY;
  if (type === 'series') return process.env.SERIES_API_KEY;
  if (type === 'anime') return process.env.ANIME_API_KEY;
  if (type === 'history') return process.env.HISTORY_API_KEY;
  return '';
};
const getWorkspaceId = (type) => {
  if (type === 'movies') return process.env.MOVIES_WORKSPACE_ID;
  if (type === 'series') return process.env.SERIES_WORKSPACE_ID;
  if (type === 'anime') return process.env.ANIME_WORKSPACE_ID;
  if (type === 'history') return process.env.HISTORY_WORKSPACE_ID;
  return '';
};

/**
 * List all bases in a workspace using the Airtable Meta API.
 */
async function listBases(apiKey, workspaceId) {
  if (!apiKey || !workspaceId) {
    throw new Error('Missing Airtable API key or workspaceId');
  }
  console.log(`[AIRTABLE SERVICE] listBases() workspaceId=${workspaceId}`);
  const url = `https://api.airtable.com/v0/meta/bases?workspaceId=${workspaceId}`;
  console.log('[Airtable] listBases:');
  console.log('  URL:', url);
  console.log('  API Key (masked):', apiKey.slice(0, 6) + '...' + apiKey.slice(-4));
  try {
    const resp = await axios.get(url, {
      headers: { Authorization: `Bearer ${apiKey}` }
    });
    console.log('  Bases fetched:', resp.data.bases.map(b => b.name));
    return resp.data.bases;
  } catch (err) {
    if (err.response) {
      console.error('[Airtable] listBases ERROR:', err.response.status, err.response.statusText);
      console.error('  Headers:', err.response.headers);
      console.error('  Data:', err.response.data);
    } else {
      console.error('[Airtable] listBases ERROR:', err.message);
    }
    throw err;
  }
}

/**
 * List all records from a base/table using the Airtable Data API.
 */
async function listRecords(apiKey, baseId, tableName = 'Table 1') {
  if (!apiKey || !baseId) {
    throw new Error('Missing Airtable API key or baseId');
  }
  console.log(`[AIRTABLE SERVICE] listRecords() baseId=${baseId}, table=${tableName}`);
  const url = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}`;
  console.log('[Airtable] listRecords:');
  console.log('  URL:', url);
  console.log('  API Key (masked):', apiKey.slice(0, 6) + '...' + apiKey.slice(-4));
  try {
    const resp = await axios.get(url, {
      headers: { Authorization: `Bearer ${apiKey}` }
    });
    console.log('  Records fetched:', resp.data.records.length);
    return resp.data.records;
  } catch (err) {
    if (err.response) {
      console.error('[Airtable] listRecords ERROR:', err.response.status, err.response.statusText);
      console.error('  Headers:', err.response.headers);
      console.error('  Data:', err.response.data);
    } else {
      console.error('[Airtable] listRecords ERROR:', err.message);
    }
    throw err;
  }
}

/**
 * Create a record in a base/table using the Airtable Data API.
 */
async function createRecord(apiKey, baseId, tableName = 'Table 1', fields) {
  console.log(`[AIRTABLE SERVICE] createRecord() baseId=${baseId}, table=${tableName}`);
  const url = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}`;
  const resp = await axios.post(
    url,
    { fields },
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    }
  );
  console.log('[AIRTABLE SERVICE] record created id=', resp.data.id);
  return resp.data;
}

/**
 * Create a new base in a workspace using the Airtable Meta API.
 * Note: We now use "fields" in the table definition (instead of "columns").
 * Also, we include "typecast": true.
 */
async function createBase(apiKey, workspaceId, baseName, tables) {
  console.log(`[AIRTABLE SERVICE] createBase() baseName=${baseName}`);
  const payload = {
    name: baseName,
    workspaceId,
    tables: tables.map(tbl => ({
      name: tbl.name,
      fields: tbl.fields  // <--- Use "fields" here!
    }))
  };
  // Log the full payload for detailed debugging
  console.log('[AIRTABLE SERVICE] createBase payload:', JSON.stringify(payload, null, 2));
  
  const url = 'https://api.airtable.com/v0/meta/bases';
  try {
    const resp = await axios.post(url, payload, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });
    console.log('[AIRTABLE SERVICE] base created id=', resp.data.id);
    return resp.data;
  } catch (error) {
    console.error('[AIRTABLE SERVICE] Error creating base. Response data:', 
      error.response ? JSON.stringify(error.response.data, null, 2) : error.message);
    throw error;
  }
}

const moviesBase = new Airtable({ apiKey: 'patzJ5869VcEoCFke.06d8b427cd85add9a0bacad51d7521a1464123051ed6ad3c7b65f474a8fbcaa9' }).base('wspxGE3TpEp972Kp7');
const seriesBase = new Airtable({ apiKey: 'patls1jwWkI6T58sA.673c0fdf745081e7679849c7bcb396a23187cc0c3ad052ae7969bca8404cc201' }).base('wspUoL9GQt5IRE0vQ');
const animeBase = new Airtable({ apiKey: 'patJ0Z4sI0shIBccn.9b9fe6f91404b5fc47d908214f3f149ad560008d86d8cfb74551f0f25279d096' }).base('wspGAcRSvZ9h5UaXN');

const fetchRecords = async (base, table) => {
  const records = await base(table).select().all();
  return records.map(record => record.fields);
};

exports.getMovies = async () => fetchRecords(moviesBase, 'Movies');
exports.getSeries = async () => fetchRecords(seriesBase, 'Series');
exports.getAnime = async () => fetchRecords(animeBase, 'Anime');
exports.getUserHistory = async (userId) => fetchRecords(moviesBase, `History_${userId}`);

const moviesApiKey = 'patzJ5869VcEoCFke.d905ae568a4553b0b407c073780b51186ac0cac7f351bd5229f40ac4efa24e74';
const seriesApiKey = 'patls1jwWkI6T58sA.3f751a537be7a9889e0ef16aaa84ae2982e95af5947a7991f9f0c12c97d97120';
const animeApiKey = 'patJ0Z4sI0shIBccn.d6fa52e0c67d6e0869995a617abbfdec8c5cf2510790df634ea0f0efee89d430';

const moviesWorkspaceId = 'wspxGE3TpEp972Kp7';
const seriesWorkspaceId = 'wspUoL9GQt5IRE0vQ';
const animeWorkspaceId = 'wspGAcRSvZ9h5UaXN';

/**
 * Fetches all records from all bases within a given workspace.
 */
const fetchAllFromWorkspace = async (apiKey, workspaceId) => {
  const allRecords = [];
  const bases = await listBases(apiKey, workspaceId);
  for (const base of bases) {
    console.log('[Airtable] Fetching records from base:', base.name, 'ID:', base.id);
    const records = await listRecords(apiKey, base.id, 'Table 1');
    allRecords.push(...records.map(r => ({ ...r.fields, id: r.id })));
  }
  return allRecords;
};

const getMovies = () => fetchAllFromWorkspace(moviesApiKey, moviesWorkspaceId);
const getSeries = () => fetchAllFromWorkspace(seriesApiKey, seriesWorkspaceId);
const getAnime = () => fetchAllFromWorkspace(animeApiKey, animeWorkspaceId);

// You would need a way to get the user's history base ID
const getUserHistory = async (userId, username) => {
  // This is a placeholder. The logic to find the correct history base for a user
  // needs to be implemented, since history bases are named after usernames.
  // For now, it will not work as intended.
  console.log(`Fetching history for user ${username} (ID: ${userId})`);
  // This requires locating the history base first.
  // const historyBases = await listBases(process.env.HISTORY_API_KEY, process.env.HISTORY_WORKSPACE_ID);
  // const userHistoryBase = historyBases.find(b => b.name === username);
  // if (userHistoryBase) {
  //   return await listRecords(process.env.HISTORY_API_KEY, userHistoryBase.id, 'Table 1');
  // }
  return [];
};

/**
 * Upsert a record in Airtable by unique field.
 * If the record exists, only update leaving and lastWatched.
 * If not, create a new record with all fields.
 */
async function upsertRecord(apiKey, baseId, tableName, uniqueField, uniqueValue, fields) {
  const records = await listRecords(apiKey, baseId, tableName);
  const existing = records.find(r => r.fields[uniqueField] === uniqueValue);

  if (existing) {
    // Only update leaving (Number) and lastWatched (if present)
    const updateFields = {};
    if ('leaving' in fields) updateFields.leaving = fields.leaving;
    if ('lastWatched' in fields) updateFields.lastWatched = fields.lastWatched;

    await axios.patch(
      `https://api.airtable.com/v0/${baseId}/${tableName}/${existing.id}`,
      { fields: updateFields },
      { headers: { Authorization: `Bearer ${apiKey}` } }
    );
  } else {
    await axios.post(
      `https://api.airtable.com/v0/${baseId}/${tableName}`,
      { fields },
      { headers: { Authorization: `Bearer ${apiKey}` } }
    );
  }
}

module.exports = {
  getApiKey,
  getWorkspaceId,
  listBases,
  listRecords,
  createRecord,
  createBase,
  getMovies,
  getSeries,
  getAnime,
  getUserHistory,
  upsertRecord,
};