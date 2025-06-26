const Airtable = require('airtable');
const axios = require('axios');
require('dotenv').config();
const path = require('path');
const generateContentId = require(path.resolve(__dirname, '../backend/utils/generateContentId'));

// CONFIG: Fill in your actual API keys, workspace IDs, and table names
const configs = [
  {
    type: 'movie',
    apiKey: process.env.MOVIES_API_KEY,
    workspaceId: process.env.MOVIES_WORKSPACE_ID,
    tables: ['Table 1'] // Add more table names if needed
  },
  {
    type: 'series',
    apiKey: process.env.SERIES_API_KEY,
    workspaceId: process.env.SERIES_WORKSPACE_ID,
    tables: ['Table 1']
  },
  {
    type: 'anime',
    apiKey: process.env.ANIME_API_KEY,
    workspaceId: process.env.ANIME_WORKSPACE_ID,
    tables: ['Table 1']
  }
];

// Helper to list all bases in a workspace using the Meta API
async function listBases(apiKey, workspaceId) {
  const url = `https://api.airtable.com/v0/meta/bases?workspaceId=${workspaceId}`;
  const resp = await axios.get(url, {
    headers: { Authorization: `Bearer ${apiKey}` }
  });
  return resp.data.bases;
}

async function migrate() {
  for (const { type, apiKey, workspaceId, tables } of configs) {
    console.log(`\n--- Processing type: ${type} ---`);
    let bases;
    try {
      console.log(`Listing all bases in workspaceId=${workspaceId}...`);
      bases = await listBases(apiKey, workspaceId);
      console.log(`Found ${bases.length} bases in workspace.`);
    } catch (err) {
      console.error(`Failed to list bases for ${type}:`, err.message || err);
      continue;
    }
    for (const baseInfo of bases) {
      const baseId = baseInfo.id;
      const baseName = baseInfo.name;
      const base = new Airtable({ apiKey }).base(baseId);
      for (const table of tables) {
        console.log(`\nProcessing base: ${baseName} (${baseId}), table: ${table}`);
        let records;
        try {
          records = await base(table).select().all();
          console.log(`Fetched ${records.length} records from ${baseName} (${baseId}), table: ${table}.`);
        } catch (err) {
          console.error(`Failed to fetch records for base ${baseName} (${baseId}), table ${table}:`, err.message || err);
          if (err.statusCode) {
            console.error(`Status code: ${err.statusCode}`);
          }
          if (err.response && err.response.body) {
            console.error('Airtable error body:', err.response.body);
          }
          continue;
        }
        for (const record of records) {
          const fields = record.fields;
          const name = fields.name || fields.title || '';
          const season = fields.season;
          const episode = fields.episode;
          const contentid = generateContentId({ type, name, season, episode });
          if (fields.contentid !== contentid) {
            try {
              console.log(`Updating record ${record.id} (name: ${name}, season: ${season}, episode: ${episode}) with contentid: ${contentid}`);
              await base(table).update(record.id, { contentid });
              console.log(`Updated ${type} record ${record.id} with contentid ${contentid}`);
            } catch (err) {
              console.error(`Failed to update record ${record.id}:`, err.message || err);
              if (err.statusCode) {
                console.error(`Status code: ${err.statusCode}`);
              }
              if (err.response && err.response.body) {
                console.error('Airtable error body:', err.response.body);
              }
            }
          } else {
            console.log(`Record ${record.id} already has correct contentid.`);
          }
        }
      }
    }
  }
  console.log('Migration complete!');
}

migrate().catch(err => {
  console.error('Migration failed:', err.message || err);
});
