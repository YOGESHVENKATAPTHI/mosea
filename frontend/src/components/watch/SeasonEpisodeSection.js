import React, { useState } from "react";
import styled from "styled-components";
import { MdPlayArrow } from "react-icons/md";
import { FaRegDotCircle } from "react-icons/fa";

const SectionWrapper = styled.div`
  width: 100%;
  max-width: 900px;
  margin: 2rem auto 0 auto;
  background: #181818;
  border-radius: 1.2rem;
  box-shadow: 0 2px 16px #0005;
  padding: 2rem 1.5rem 2.5rem 1.5rem;
`;

const TopNav = styled.div`
  display: flex;
  gap: 2.5rem;
  border-bottom: 1px solid #232323;
  margin-bottom: 1.5rem;
`;

const TopNavItem = styled.button`
  background: none;
  border: none;
  color: ${({ active }) => (active ? "#fff" : "#888")};
  font-size: 1.15rem;
  font-weight: ${({ active }) => (active ? 700 : 500)};
  border-bottom: ${({ active }) => (active ? "3px solid #e50914" : "none")};
  padding: 0.7rem 0.5rem 0.7rem 0.5rem;
  cursor: pointer;
  transition: color 0.2s;
  &:hover {
    color: #e50914;
  }
`;

const SeasonTabs = styled.div`
  display: flex;
  gap: 1.2rem;
  margin-bottom: 2rem;
`;

const SeasonTab = styled.button`
  background: ${({ active }) => (active ? "#232323" : "none")};
  border: none;
  color: ${({ active }) => (active ? "#e50914" : "#fff")};
  font-size: 1.1rem;
  font-weight: ${({ active }) => (active ? 700 : 500)};
  border-radius: 8px 8px 0 0;
  border-bottom: ${({ active }) => (active ? "3px solid #e50914" : "none")};
  padding: 0.6rem 1.2rem;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
  &:hover {
    color: #e50914;
    background: #232323;
  }
`;

const EpisodeList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const EpisodeCard = styled.div`
  display: flex;
  gap: 2.2rem;
  align-items: flex-start;
  background: ${({ active }) => (active ? "#232323" : "#181c24")};
  border-radius: 18px;
  padding: 1.5rem 2rem;
  box-shadow: 0 4px 16px rgba(0,0,0,0.25);
  cursor: pointer;
  border: 3px solid ${({ active }) => (active ? "#e50914" : "transparent")};
  transition: background 0.2s, border 0.2s;
  min-height: 160px;
  &:hover {
    background: #232323;
    border-color: #e50914;
  }
`;

const EpisodeImgWrapper = styled.div`
  position: relative;
  width: 220px;
  height: 124px;
  min-width: 220px;
  min-height: 124px;
  border-radius: 12px;
  overflow: hidden;
  background: #111;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const EpisodeImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 12px;
`;

const PlayIcon = styled.span`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  color: #fff;
  background: rgba(0,0,0,0.55);
  border-radius: 50%;
  padding: 0.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const EpisodeInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const EpisodeTitle = styled.div`
  font-size: 1.35rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 0.3rem;
`;

const EpisodeMeta = styled.div`
  color: #aaa;
  font-size: 1.08rem;
  margin-bottom: 0.4rem;
  display: flex;
  align-items: center;
  gap: 0.7rem;
`;

const EpisodeDesc = styled.div`
  color: #ccc;
  font-size: 1.08rem;
  margin-top: 0.3rem;
`;

const NoEpisodes = styled.div`
  color: #888;
  text-align: center;
  margin: 2rem 0;
`;

const navTabs = [
  { key: "episodes", label: "Episodes" },
  { key: "more", label: "More Like This" },
  { key: "trailers", label: "Trailers & More" }
];

export default function SeasonEpisodeSection({
  seasons = [],
  selectedSeason = 1,
  selectedEpisode = 1,
  onSelect
}) {
  const [activeTab, setActiveTab] = useState("episodes");

  // Normalize season/episode numbers
  const normalizedSeasons = seasons.map(s => ({
    ...s,
    season: Number(s.season),
    episodes: (s.episodes || []).map(ep => ({
      ...ep,
      episode: Number(ep.episode)
    }))
  }));

  const selectedSeasonObj =
    normalizedSeasons.find(s => s.season === Number(selectedSeason)) ||
    normalizedSeasons[0];

  return (
    <SectionWrapper>
      {/* Top Navigation */}
      <TopNav>
        {navTabs.map(tab => (
          <TopNavItem
            key={tab.key}
            active={activeTab === tab.key}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </TopNavItem>
        ))}
      </TopNav>

      {/* Only show episodes for now */}
      {activeTab === "episodes" && (
        <>
          {/* Season Tabs */}
          <SeasonTabs>
            {normalizedSeasons.map(s => (
              <SeasonTab
                key={s.season}
                active={Number(selectedSeason) === s.season}
                onClick={() =>
                  onSelect(s.season, s.episodes[0]?.episode || 1)
                }
              >
                Season {s.season}
              </SeasonTab>
            ))}
          </SeasonTabs>

          {/* Episode List */}
          <EpisodeList>
            {selectedSeasonObj?.episodes?.length ? (
              selectedSeasonObj.episodes.map(ep => (
                <EpisodeCard
                  key={ep.episode}
                  active={Number(selectedEpisode) === ep.episode}
                  onClick={() =>
                    onSelect(selectedSeasonObj.season, ep.episode)
                  }
                >
                  <EpisodeImgWrapper>
                    <EpisodeImg
                      src={ep.episodeimageurl || ep.imageurl}
                      alt={ep.episodename || ep.title || ep.name}
                    />
                    <PlayIcon>
                      <MdPlayArrow size={32} />
                    </PlayIcon>
                  </EpisodeImgWrapper>
                  <EpisodeInfo>
                    <EpisodeTitle>
                      {ep.episodename || ep.title || ep.name}
                    </EpisodeTitle>
                    <EpisodeMeta>
                      <span>
                        S{selectedSeasonObj.season} E{ep.episode}
                      </span>
                      {ep.releaseDate && (
                        <>
                          <FaRegDotCircle size={10} />
                          <span>{ep.releaseDate}</span>
                        </>
                      )}
                      {ep.duration && (
                        <>
                          <FaRegDotCircle size={10} />
                          <span>{ep.duration}</span>
                        </>
                      )}
                    </EpisodeMeta>
                    <EpisodeDesc>
                      {ep.description || ep.script || ""}
                    </EpisodeDesc>
                  </EpisodeInfo>
                </EpisodeCard>
              ))
            ) : (
              <NoEpisodes>No episodes found for this season.</NoEpisodes>
            )}
          </EpisodeList>
        </>
      )}

      {/* Placeholder for other tabs */}
      {activeTab !== "episodes" && (
        <NoEpisodes>
          {activeTab === "more"
            ? "More Like This coming soon!"
            : "Trailers & More coming soon!"}
        </NoEpisodes>
      )}
    </SectionWrapper>
  );
}
