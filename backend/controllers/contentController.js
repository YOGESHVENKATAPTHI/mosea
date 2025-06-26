const {
  getApiKey,
  getWorkspaceId,
  listBases,
  listRecords,
  upsertRecord
} = require('../services/airtableService');
const axios = require('axios');
const generateContentId = require('../utils/generateContentId');
const { sanitizeHistoryPayload } = require('./airtableController');

// Helper to ensure contentid is set
async function ensureContentId(apiKey, baseId, record) {
  const type = record.fields.type || 'movie';
  const name = record.fields.name || record.fields.title || '';
  const season = record.fields.season;
  const episode = record.fields.episode;
  const generatedId = generateContentId({ type, name, season, episode });
  if (!record.fields.contentid || record.fields.contentid !== generatedId) {
    await axios.patch(
      `https://api.airtable.com/v0/${baseId}/Table 1/${record.id}`,
      { fields: { contentid: generatedId } },
      { headers: { Authorization: `Bearer ${apiKey}` } }
    );
    record.fields.contentid = generatedId;
  }
}

// Helper to get all records from all bases in a workspace
async function fetchAllFromWorkspace(type) {
  const apiKey = getApiKey(type);
  const workspaceId = getWorkspaceId(type);
  const allRecords = [];
  const bases = await listBases(apiKey, workspaceId);
  for (const base of bases) {
    const records = await listRecords(apiKey, base.id, 'Table 1');
    allRecords.push(...records.map(r => ({ ...r.fields, id: r.id })));
  }
  return allRecords;
}

// Fetch all content (movies, series, and anime)
exports.getAllContent = async (req, res, next) => {
  try {
    const [movies, series, anime] = await Promise.all([
      fetchAllFromWorkspace('movies'),
      fetchAllFromWorkspace('series'),
      fetchAllFromWorkspace('anime')
    ]);
    res.status(200).json({
      message: 'Content fetched successfully.',
      data: {
        recommended: movies,
        originals: series,
        trending: [],
        anime
      }
    });
  } catch (err) {
    next(err);
  }
};

// Fetch all movies
exports.getMovies = async (req, res, next) => {
  try {
    const movies = await fetchAllFromWorkspace('movies');
    res.status(200).json({
      message: 'Movies fetched successfully.',
      data: movies
    });
  } catch (err) {
    next(err);
  }
};

// Fetch all series
exports.getSeries = async (req, res, next) => {
  try {
    const series = await fetchAllFromWorkspace('series');
    res.status(200).json({
      message: 'Series fetched successfully.',
      data: series
    });
  } catch (err) {
    next(err);
  }
};

// Fetch all anime
exports.getAnime = async (req, res, next) => {
  try {
    const anime = await fetchAllFromWorkspace('anime');
    res.status(200).json({
      message: 'Anime fetched successfully.',
      data: anime
    });
  } catch (err) {
    next(err);
  }
};

// Fetch movie by Airtable record ID, ensure contentid is set
exports.getMovieById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const apiKey = getApiKey('movies');
    const workspaceId = getWorkspaceId('movies');
    const bases = await listBases(apiKey, workspaceId);
    for (const base of bases) {
      const records = await listRecords(apiKey, base.id, 'Table 1');
      const found = records.find(r => r.id === id);
      if (found) {
        await ensureContentId(apiKey, base.id, found);
        return res.json({ ...found.fields, id: found.id });
      }
    }
    res.status(404).json({ error: 'Movie not found' });
  } catch (err) {
    next(err);
  }
};

// Fetch series by Airtable record ID, ensure contentid is set, and return all seasons/episodes
exports.getSeriesById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const apiKey = getApiKey('series');
    const workspaceId = getWorkspaceId('series');
    const bases = await listBases(apiKey, workspaceId);
    for (const base of bases) {
      const records = await listRecords(apiKey, base.id, 'Table 1');
      const found = records.find(r => r.id === id);
      if (found) {
        await ensureContentId(apiKey, base.id, found);
        // Fetch all episodes/seasons for this series
        const allEpisodes = records.filter(r => r.fields.name === found.fields.name);
        // Group by season
        const seasons = {};
        allEpisodes.forEach(ep => {
          const seasonNum = ep.fields.season || 1;
          if (!seasons[seasonNum]) seasons[seasonNum] = [];
          seasons[seasonNum].push({
            id: ep.id,
            episode: ep.fields.episode,
            name: ep.fields.name,
            imageurl: ep.fields.imageurl,
            episodename: ep.fields.episodename || ep.fields.title || '',
            episodeimageurl: ep.fields.episodeimageurl || ep.fields.imageurl || '',
            '4k': ep.fields['4k'],
            '1080p': ep.fields['1080p'],
            '720p': ep.fields['720p'],
            '480p': ep.fields['480p'],
            script: ep.fields.script,
            category: ep.fields.category,
          });
        });
        return res.json({
          ...found.fields,
          id: found.id,
          seasons: Object.entries(seasons).map(([season, episodes]) => ({
            season,
            episodes: episodes.sort((a, b) => a.episode - b.episode)
          }))
        });
      }
    }
    res.status(404).json({ error: 'Series not found' });
  } catch (err) {
    next(err);
  }
};

// Fetch anime by Airtable record ID, ensure contentid is set, and return all seasons/episodes
exports.getAnimeById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const apiKey = getApiKey('anime');
    const workspaceId = getWorkspaceId('anime');
    const bases = await listBases(apiKey, workspaceId);
    for (const base of bases) {
      const records = await listRecords(apiKey, base.id, 'Table 1');
      const found = records.find(r => r.id === id);
      if (found) {
        await ensureContentId(apiKey, base.id, found);
        // Fetch all episodes/seasons for this anime
        const allEpisodes = records.filter(r => r.fields.name === found.fields.name);
        // Group by season
        const seasons = {};
        allEpisodes.forEach(ep => {
          const seasonNum = ep.fields.season || 1;
          if (!seasons[seasonNum]) seasons[seasonNum] = [];
          seasons[seasonNum].push({
            id: ep.id,
            episode: ep.fields.episode,
            name: ep.fields.name,
            imageurl: ep.fields.imageurl,
            episodename: ep.fields.episodename || ep.fields.title || '',
            episodeimageurl: ep.fields.episodeimageurl || ep.fields.imageurl || '',
            '4k': ep.fields['4k'],
            '1080p': ep.fields['1080p'],
            '720p': ep.fields['720p'],
            '480p': ep.fields['480p'],
            script: ep.fields.script,
            category: ep.fields.category,
          });
        });
        return res.json({
          ...found.fields,
          id: found.id,
          seasons: Object.entries(seasons).map(([season, episodes]) => ({
            season,
            episodes: episodes.sort((a, b) => a.episode - b.episode)
          }))
        });
      }
    }
    res.status(404).json({ error: 'Anime not found' });
  } catch (err) {
    next(err);
  }
};

// Fetch content by contentid (searches all bases)
exports.getContentByContentId = async (req, res, next) => {
  const { contentid } = req.params;
  const types = ['movies', 'series', 'anime'];
  for (const type of types) {
    const apiKey = getApiKey(type);
    const workspaceId = getWorkspaceId(type);
    const bases = await listBases(apiKey, workspaceId);
    for (const base of bases) {
      const records = await listRecords(apiKey, base.id, 'Table 1');
      const found = records.find(r => r.fields.contentid === contentid);
      if (found) {
        return res.json({ ...found.fields, id: found.id, type });
      }
    }
  }
  res.status(404).json({ error: 'Content not found' });
};

// GET /api/content/series-episodes/:seriesName
exports.getAllEpisodesBySeriesName = async (req, res, next) => {
  try {
    const { seriesName } = req.params;
    const apiKey = getApiKey('series');
    const workspaceId = getWorkspaceId('series');
    const bases = await listBases(apiKey, workspaceId);
    let allEpisodes = [];
    for (const base of bases) {
      const records = await listRecords(apiKey, base.id, 'Table 1');
      // Match by name (case-insensitive)
      const episodes = records.filter(r =>
        r.fields.name && r.fields.name.toLowerCase() === seriesName.toLowerCase()
      );
      allEpisodes.push(...episodes.map(r => ({ ...r.fields, id: r.id })));
    }
    res.json({ episodes: allEpisodes });
  } catch (err) {
    next(err);
  }
};

// List of table names to search in each base (customize as needed)
const TABLE_NAMES = ['Table 1'];

// GET /api/content/history-content/:username/:contentid
exports.getHistoryContent = async (req, res, next) => {
  try {
    const { username, contentid } = req.params;
    console.log(`[getHistoryContent] Received request for username='${username}', contentid='${contentid}'`);
    const apiKey = getApiKey('history');
    const workspaceId = getWorkspaceId('history');
    const bases = await listBases(apiKey, workspaceId);
    const userBase = bases.find(b => b.name === username);
    if (!userBase) return res.status(404).json({ error: 'No history found' });

    // Find the history record by contentid
    let records = await listRecords(apiKey, userBase.id, 'Table 1');
    let historyRecord = records.find(r => r.fields.contentid === contentid);

    // If not found, create a new record from the main content base
    if (!historyRecord) {
      // Search all content types for the contentid
      const types = ['movies', 'series', 'anime'];
      let found = null, foundType = null;
      for (const type of types) {
        const mainApiKey = getApiKey(type);
        const mainWorkspaceId = getWorkspaceId(type);
        const mainBases = await listBases(mainApiKey, mainWorkspaceId);
        for (const base of mainBases) {
          for (const tableName of TABLE_NAMES) {
            let mainRecords = [];
            try {
              mainRecords = await listRecords(mainApiKey, base.id, tableName);
            } catch (err) {
              continue;
            }
            const rec = mainRecords.find(r => r.fields.contentid === contentid);
            if (rec) {
              found = rec.fields;
              foundType = type;
              break;
            }
          }
          if (found) break;
        }
        if (found) break;
      }
      if (!found) return res.status(404).json({ error: 'Content not found' });
      // Copy all fields from the main record
      let newFields = { ...found };
      // Always set contentid, type, and lastWatched
      newFields.contentid = contentid;
      newFields.type = foundType;
      newFields.lastWatched = new Date().toISOString();
      // Sanitize for Airtable
      // newFields = sanitizeHistoryPayload(newFields);
      await upsertRecord(apiKey, userBase.id, 'Table 1', 'contentid', contentid, newFields);
      // Re-fetch the record to get the Airtable id
      records = await listRecords(apiKey, userBase.id, 'Table 1');
      historyRecord = records.find(r => r.fields.contentid === contentid);
      // If it's a movie, return as-is
      if (foundType === 'movie') {
        return res.json({ ...historyRecord.fields, id: historyRecord.id });
      }
      // For series/anime, fetch all episodes/seasons by name from ALL bases in the series/anime workspace
      const seriesType = foundType; // 'series' or 'anime'
      const seriesName = found.name;
      const seriesApiKey = getApiKey(seriesType);
      const seriesWorkspaceId = getWorkspaceId(seriesType);
      const seriesBases = await listBases(seriesApiKey, seriesWorkspaceId);

      let allEpisodes = [];
      for (const base of seriesBases) {
        for (const tableName of TABLE_NAMES) {
          let eps = [];
          try {
            eps = await listRecords(seriesApiKey, base.id, tableName);
            console.log(`[DEBUG][getHistoryContent] Base: ${base.name}, Records fetched: ${eps.length}`);
          } catch (err) {
            continue;
          }
          eps.forEach(r => {
            console.log(`[DEBUG][getHistoryContent] Record name: '${r.fields.name}'`);
          });
          console.log(`[DEBUG][getHistoryContent] Looking for seriesName: '${seriesName}'`);
          // Match by name (case-insensitive)
          const filtered = eps.filter(r =>
            r.fields.name && r.fields.name.toLowerCase() === seriesName.toLowerCase()
          );
          console.log(`[DEBUG][getHistoryContent] Base: ${base.name}, Filtered episodes for seriesName='${seriesName}': ${filtered.length}`);
          allEpisodes.push(...filtered.map(r => ({ ...r.fields, id: r.id })));
        }
      }
      // Group by season for series/anime
      const seasons = {};
      allEpisodes.forEach(ep => {
        const seasonNum = ep.season || 1;
        if (!seasons[seasonNum]) seasons[seasonNum] = [];
        seasons[seasonNum].push({
          ...ep,
          episodename: ep.episodename || ep.title || '',
          episodeimageurl: ep.episodeimageurl || ep.imageurl || ''
        });
      });
      console.log('[DEBUG][getHistoryContent] Grouped seasons (new record):', JSON.stringify(seasons, null, 2));
      return res.json({
        ...historyRecord.fields,
        id: historyRecord.id,
        seasons: Object.entries(seasons).map(([season, episodes]) => ({
          season,
          episodes: episodes.sort((a, b) => (a.episode || 0) - (b.episode || 0))
        }))
      });
    }

    // If it's a movie, return as-is
    if (historyRecord.fields.type === 'movie') {
      return res.json({ ...historyRecord.fields, id: historyRecord.id });
    }

    // For series or anime, fetch all episodes/seasons by name from ALL bases in the series/anime workspace
    const seriesType = historyRecord.fields.type; // 'series' or 'anime'
    const seriesName = historyRecord.fields.name;
    const seriesApiKey = getApiKey(seriesType);
    const seriesWorkspaceId = getWorkspaceId(seriesType);
    const seriesBases = await listBases(seriesApiKey, seriesWorkspaceId);

    let allEpisodes = [];
    for (const base of seriesBases) {
      for (const tableName of TABLE_NAMES) {
        let eps = [];
        try {
          eps = await listRecords(seriesApiKey, base.id, tableName);
          console.log(`[DEBUG][getHistoryContent] Base: ${base.name}, Records fetched: ${eps.length}`);
        } catch (err) {
          continue;
        }
        eps.forEach(r => {
          console.log(`[DEBUG][getHistoryContent] Record name: '${r.fields.name}'`);
        });
        console.log(`[DEBUG][getHistoryContent] Looking for seriesName: '${seriesName}'`);
        // Match by name (case-insensitive)
        const filtered = eps.filter(r =>
          r.fields.name && r.fields.name.toLowerCase() === seriesName.toLowerCase()
        );
        console.log(`[DEBUG][getHistoryContent] Base: ${base.name}, Filtered episodes for seriesName='${seriesName}': ${filtered.length}`);
        allEpisodes.push(...filtered.map(r => ({ ...r.fields, id: r.id })));
      }
    }
    // Group by season for series/anime
    const seasons = {};
    allEpisodes.forEach(ep => {
      const seasonNum = ep.season || 1;
      if (!seasons[seasonNum]) seasons[seasonNum] = [];
      seasons[seasonNum].push({
        ...ep,
        episodename: ep.episodename || ep.title || '',
        episodeimageurl: ep.episodeimageurl || ep.imageurl || ''
      });
    });
    console.log('[DEBUG][getHistoryContent] Grouped seasons (existing record, all bases):', JSON.stringify(seasons, null, 2));
    return res.json({
      ...historyRecord.fields,
      id: historyRecord.id,
      seasons: Object.entries(seasons).map(([season, episodes]) => ({
        season,
        episodes: episodes.sort((a, b) => (a.episode || 0) - (b.episode || 0))
      }))
    });
  } catch (err) {
    next(err);
  }
};

// Add to user history (always include episodename and episodeimageurl for series/anime)
exports.addToUserHistory = async (req, res, next) => {
  try {
    const { username } = req.params;
    // Destructure only the fields you want to rename or use directly
    const {
      name, title, season, episode, type,
      category, script, quality, totalseason, languages,
      '4k': fourk, '1080p': hd1080, '720p': hd720, '480p': sd480,
      imageurl, imageUrl, episodename, episodeimageurl,
      lastWatched, leaving
    } = req.body;

    // Use the same logic as migrateContentIds.js
    const contentName = name || title || '';
    const contentid = generateContentId({ type, name: contentName, season, episode });

    // Build the history record using the same schema as in airtableController.js
    const historyData = {
      name: contentName,
      imageurl: imageurl || imageUrl || '',
      '4k': fourk,
      '4kta': req.body['4kta'],
      '4kte': req.body['4kte'],
      '4kma': req.body['4kma'],
      '4ken': req.body['4ken'],
      '1080p': hd1080,
      '1080pta': req.body['1080pta'],
      '1080pte': req.body['1080pte'],
      '1080pma': req.body['1080pma'],
      '1080pen': req.body['1080pen'],
      '720p': hd720,
      '720pta': req.body['720pta'],
      '720pte': req.body['720pte'],
      '720pma': req.body['720pma'],
      '720pen': req.body['720pen'],
      '480p': sd480,
      '480pta': req.body['480pta'],
      '480pte': req.body['480pte'],
      '480pma': req.body['480pma'],
      '480pen': req.body['480pen'],
      script: script ? script.substring(0, 1000) : '',
      category,
      type,
      totalseason,
      quality,
      lastWatched,
      season,
      episode,
      episodename: episodename || '',
      episodeimageurl: episodeimageurl || '',
      contentid,
      leaving: typeof leaving === 'number' ? leaving : 0,
      languages
    };

    // Upsert logic: only update leaving if record exists, else create full record
    const apiKey = getApiKey('history');
    const workspaceId = getWorkspaceId('history');
    const bases = await listBases(apiKey, workspaceId);
    let userBase = bases.find(b => b.name === username);

    if (!userBase) {
      return res.status(404).json({ error: 'User history base not found' });
    }

    await upsertRecord(apiKey, userBase.id, 'Table 1', 'contentid', contentid, historyData);
    res.json({ message: 'History updated' });
  } catch (err) {
    next(err);
  }
};

// Get user history (list)
exports.getUserHistory = async (req, res, next) => {
  try {
    const { username } = req.params;
    const { contentid } = req.query; // support ?contentid=... for direct search
    const apiKey = getApiKey('history');
    const workspaceId = getWorkspaceId('history');
    const bases = await listBases(apiKey, workspaceId);
    const userBase = bases.find(b => b.name === username);
    if (!userBase) return res.status(404).json({ error: 'No history found' });
    let records = await listRecords(apiKey, userBase.id, 'Table 1');
    if (contentid) {
      let record = records.find(r => r.fields.contentid === contentid);
      if (!record) {
        // Search all content types for the contentid
        const types = ['movies', 'series', 'anime'];
        let found = null, foundType = null;
        for (const type of types) {
          const mainApiKey = getApiKey(type);
          const mainWorkspaceId = getWorkspaceId(type);
          const mainBases = await listBases(mainApiKey, mainWorkspaceId);
          for (const base of mainBases) {
            try {
              const mainRecords = await listRecords(mainApiKey, base.id, 'Table 1');
              const rec = mainRecords.find(r => r.fields.contentid === contentid);
              if (rec) {
                found = rec.fields;
                foundType = type;
                break;
              }
            } catch (err) { continue; }
          }
          if (found) break;
        }
        if (!found) return res.status(404).json({ error: 'Content not found' });
        // Prepare fields for history
        const imageurl = found.imageurl || found.imageUrl || '';
        const isMovie = foundType === 'movie';
        const seasonNum = found.season ? Number(found.season) : 1;
        const episodeNum = found.episode ? Number(found.episode) : 1;
        const {
          name, category, script, type, quality,
          '4k': fourk, '1080p': hd1080, '720p': hd720, '480p': sd480,
          episodename, episodeimageurl, title
        } = found;
        let newFields = {
          name,
          imageurl,
          category,
          script: script ? script.substring(0, 1000) : '',
          contentid,
          type: foundType,
          quality: quality || '',
          leaving: 0,
          lastWatched: new Date().toISOString(),
          '4k': fourk,
          '1080p': hd1080,
          '720p': hd720,
          '480p': sd480,
          episodename: episodename || title || '',
          episodeimageurl: episodeimageurl || imageurl || ''
        };
        if (!isMovie) {
          newFields = {
            ...newFields,
            season: seasonNum,
            episode: episodeNum,
            totalseason: found.totalseason || ''
          };
        }
        await upsertRecord(apiKey, userBase.id, 'Table 1', 'contentid', contentid, newFields);
        // Re-fetch
        records = await listRecords(apiKey, userBase.id, 'Table 1');
        record = records.find(r => r.fields.contentid === contentid);
      }
      return res.json({ data: [ { ...record.fields, id: record.id } ] });
    }
    res.json({ data: records.map(r => ({ ...r.fields, id: r.id })) });
  } catch (err) {
    next(err);
  }
};
