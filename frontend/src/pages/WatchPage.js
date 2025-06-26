import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import VideoPlayer from "../components/watch/VideoPlayer";
import api from "../api";
import { AuthContext } from "../contexts/AuthContext";
import SeasonEpisodeSection from "../components/watch/SeasonEpisodeSection";

const Container = styled.div`
  background: #181818;
  min-height: 100vh;
`;

const ContentBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem 0;
`;

const Title = styled.h1`
  color: #fff;
  margin-bottom: 1rem;
`;

const Description = styled.p`
  color: #bbb;
  max-width: 700px;
  text-align: center;
  margin-bottom: 2rem;
`;

const LANGUAGE_LABELS = {
  ta: "Tamil",
  te: "Telugu",
  ma: "Malayalam",
  en: "English"
};
const LANGUAGE_SUFFIXES = ["ta", "te", "ma", "en"];
const QUALITY_LEVELS = ["4k", "1080p", "720p", "480p"];

const WatchPage = () => {
  const { type, id } = useParams(); // id is contentid (hash)
  const { user } = useContext(AuthContext);
  const [content, setContent] = useState(null);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [selectedEpisode, setSelectedEpisode] = useState(1);
  const [loading, setLoading] = useState(true);
  const [leaving, setLeaving] = useState(0);
  const [error, setError] = useState(null);
  const [allSeasons, setAllSeasons] = useState([]);
  const navigate = useNavigate();
  const [selectedLanguage, setSelectedLanguage] = useState("ta"); // default to Tamil

  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      setError(null);

      if (!user?.username) {
        setError("User not authenticated.");
        setLoading(false);
        return;
      }

      try {
        console.log(`[WatchPage] Requesting user history for contentid=${id} (series/anime search)`);
        const histResp = await api.get(`/content/history-content/${user.username}/${id}`);
        const record = histResp.data;

        if (record) {
          console.log(`[WatchPage] Searching for series/anime: name='${record.name}', type='${record.type}', contentid='${id}'`);
        }

        console.log("[WatchPage] Raw record:", record);

        if (!record) {
          setError("Content not found in history and could not be created.");
          setLoading(false);
          return;
        }

        setContent(record);
        setLeaving(record.leaving || 0);

        if ((record.type === "series" || record.type === "anime") && Array.isArray(record.seasons)) {
          setAllSeasons(record.seasons);
          console.log("[WatchPage] record.seasons:", record.seasons);
          setSelectedSeason(Number(record.seasons[0]?.season) || 1);
          setSelectedEpisode(Number(record.seasons[0]?.episodes[0]?.episode) || 1);
        } else {
          setAllSeasons([]);
        }

        setLoading(false);
        console.log("[WatchPage] Content loaded:", record);
      } catch (err) {
        console.error("[WatchPage] Error fetching/creating content in history:", err);
        setContent(null);
        setError("Failed to load or create content in history. Please try again.");
        setLoading(false);
      }
    };

    fetchContent();
    // eslint-disable-next-line
  }, [id, user, navigate]);

  useEffect(() => {
    console.log("[WatchPage] allSeasons state:", allSeasons);
    console.log("[WatchPage] selectedSeason:", selectedSeason, "selectedEpisode:", selectedEpisode);
  }, [allSeasons, selectedSeason, selectedEpisode]);

  // Parse available languages
  const availableLanguages = content?.languages
    ? (Array.isArray(content.languages)
        ? content.languages
        : content.languages.split(",").map(l => l.trim()))
        .filter(l => LANGUAGE_SUFFIXES.includes(l))
    : [];

  // Set default language if not set
  useEffect(() => {
    if (availableLanguages.length > 0 && !availableLanguages.includes(selectedLanguage)) {
      setSelectedLanguage(availableLanguages[0]);
    }
    // eslint-disable-next-line
  }, [content]);

  // Build videoUrls for the selected language
  const videoUrls = {};
  QUALITY_LEVELS.forEach(q => {
    const field = `${q}${selectedLanguage}`;
    if (content && content[field]) {
      videoUrls[q] = content[field];
    }
  });
  const availableQualities = Object.keys(videoUrls);

  if (loading) return <Container><ContentBox>Loading...</ContentBox></Container>;
  if (error) return <Container><ContentBox style={{color: 'red'}}>{error}</ContentBox></Container>;
  if (!content) return null;

  return (
    <Container>
      <ContentBox>
        <Title>{content.title || content.name}</Title>
        <Description>{content.description || content.script}</Description>
        {/* Language Selector */}
        {availableLanguages.length > 1 && (
          <div style={{ marginBottom: "1rem", color: "#fff" }}>
            <label htmlFor="language">Language: </label>
            <select
              id="language"
              value={selectedLanguage}
              onChange={e => setSelectedLanguage(e.target.value)}
              style={{
                background: "#232a3a",
                color: "#fff",
                borderRadius: "0.5rem",
                padding: "0.4rem 1rem",
                border: "none",
                fontSize: "1rem"
              }}
            >
              {availableLanguages.map(lang => (
                <option key={lang} value={lang}>
                  {LANGUAGE_LABELS[lang] || lang}
                </option>
              ))}
            </select>
          </div>
        )}
        <VideoPlayer
          videoUrls={videoUrls}
          qualities={availableQualities}
          contentId={content.contentid || content.id}
          contentType={content.type}
          name={content.name}
          imageUrl={content.imageurl}
          season={content.season}
          episode={content.episode}
          leaving={leaving}
          category={content.type}
          script={content.script || content.description}
          content={content}
          selectedLanguage={selectedLanguage}
        />
        {(content.type === "series" || content.type === "anime") && allSeasons.length > 0 && (
          <SeasonEpisodeSection
            seasons={allSeasons}
            selectedSeason={selectedSeason}
            selectedEpisode={selectedEpisode}
            onSelect={(season, episode) => {
              setSelectedSeason(season);
              setSelectedEpisode(episode);
            }}
          />
        )}
      </ContentBox>
    </Container>
  );
};

export default WatchPage;
