import React, { useEffect } from "react";
import { MdPlayArrow } from "react-icons/md";
import "./EpisodeBrowser.css";

const EpisodeBrowser = ({
  seasons = [],
  currentSeason = 1,
  currentEpisode = 1,
  onEpisodeSelect,
}) => {
  useEffect(() => {
    console.log("[EpisodeBrowser] seasons prop:", seasons);
    console.log("[EpisodeBrowser] currentSeason:", currentSeason, "currentEpisode:", currentEpisode);
  }, [seasons, currentSeason, currentEpisode]);

  // Normalize season numbers to numbers for comparison
  const normalizedSeasons = seasons.map(s => ({
    ...s,
    season: Number(s.season),
    episodes: (s.episodes || []).map(ep => ({
      ...ep,
      episode: Number(ep.episode)
    }))
  }));

  const selectedSeasonObj = normalizedSeasons.find(s => s.season === Number(currentSeason)) || normalizedSeasons[0];

  useEffect(() => {
    console.log("[EpisodeBrowser] normalizedSeasons:", normalizedSeasons);
    console.log("[EpisodeBrowser] selectedSeasonObj:", selectedSeasonObj);
  }, [normalizedSeasons, selectedSeasonObj]);

  return (
    <div className="episode-browser">
      {/* Season Tabs */}
      <div className="season-tabs">
        {normalizedSeasons.map((s) => (
          <button
            key={s.season}
            className={`season-tab${Number(currentSeason) === s.season ? " active" : ""}`}
            onClick={() => {
              const firstEp = s.episodes && s.episodes.length > 0 ? s.episodes[0].episode : 1;
              console.log("[EpisodeBrowser] Season tab clicked:", s.season, "firstEp:", firstEp);
              onEpisodeSelect(s.season, firstEp);
            }}
          >
            Season {s.season}
          </button>
        ))}
      </div>

      {/* Episode List */}
      <div className="episode-list">
        {selectedSeasonObj?.episodes?.map((ep) => (
          <div
            key={ep.episode}
            className={`episode-card${Number(currentEpisode) === ep.episode ? " current" : ""}`}
            onClick={() => {
              console.log("[EpisodeBrowser] Episode card clicked:", selectedSeasonObj.season, ep.episode);
              onEpisodeSelect(selectedSeasonObj.season, ep.episode);
            }}
          >
            <div className="episode-image-wrapper">
              <img src={ep.episodeimageurl || ep.imageurl} alt={ep.episodename || ep.title || ep.name} />
              <span className="play-icon"><MdPlayArrow size={32} /></span>
            </div>
            <div className="episode-info">
              <div className="episode-title">
                S{selectedSeasonObj.season} E{ep.episode} &bull; {ep.episodename || ep.title || ep.name}
              </div>
              <div className="episode-meta">
                {ep.releaseDate || ""} {ep.duration ? `• ${ep.duration}` : ""}
              </div>
              <div className="episode-desc">{ep.description || ep.script || ""}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EpisodeBrowser;
