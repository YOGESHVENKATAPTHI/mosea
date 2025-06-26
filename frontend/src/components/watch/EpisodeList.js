import React from 'react';
import styled from 'styled-components';

const Tabs = styled.div`
  display: flex;
  gap: 2rem;
  margin-bottom: 1rem;
`;

const Tab = styled.button`
  background: none;
  border: none;
  color: ${({ active }) => (active ? '#e50914' : '#fff')};
  font-size: 1.2rem;
  font-weight: ${({ active }) => (active ? 700 : 400)};
  border-bottom: ${({ active }) => (active ? '2px solid #e50914' : 'none')};
  cursor: pointer;
  padding: 0.5rem 1rem;
`;

const EpisodeCard = styled.div`
  display: flex;
  gap: 1.5rem;
  align-items: flex-start;
  background: #181c24;
  border-radius: 12px;
  margin-bottom: 1.5rem;
  padding: 1rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  cursor: pointer;
  border: 2px solid transparent;
  &:hover, &.current { background: #232323; border-color: #e50914; }
`;

const EpisodeImg = styled.img`
  width: 120px; height: 70px; object-fit: cover; border-radius: 8px;
`;

const EpisodeInfo = styled.div`
  flex: 1;
`;

const EpisodeTitle = styled.div`
  font-size: 1.1rem;
  font-weight: 700;
  color: #fff;
`;

const EpisodeMeta = styled.div`
  color: #aaa;
  font-size: 0.95rem;
  margin-bottom: 0.3rem;
`;

const EpisodeDesc = styled.div`
  color: #ccc;
  font-size: 0.98rem;
`;

export default function EpisodeList({ seasons, selectedSeason, selectedEpisode, onSelect }) {
  // Normalize season/episode numbers
  const normalizedSeasons = seasons.map(s => ({
    ...s,
    season: Number(s.season),
    episodes: (s.episodes || []).map(ep => ({
      ...ep,
      episode: Number(ep.episode)
    }))
  }));

  const selectedSeasonObj = normalizedSeasons.find(s => s.season === Number(selectedSeason)) || normalizedSeasons[0];

  return (
    <div>
      <Tabs>
        {normalizedSeasons.map(s => (
          <Tab
            key={s.season}
            active={Number(selectedSeason) === s.season}
            onClick={() => onSelect(s.season, s.episodes[0]?.episode || 1)}
          >
            Season {s.season}
          </Tab>
        ))}
      </Tabs>
      {selectedSeasonObj?.episodes?.map(ep => (
        <EpisodeCard
          key={ep.episode}
          className={Number(selectedEpisode) === ep.episode ? "current" : ""}
          onClick={() => onSelect(selectedSeasonObj.season, ep.episode)}
        >
          <EpisodeImg src={ep.episodeimageurl || ep.imageurl} alt={ep.episodename || ep.title || ep.name} />
          <EpisodeInfo>
            <EpisodeTitle>{ep.episodename || ep.title || ep.name}</EpisodeTitle>
            <EpisodeMeta>
              S{selectedSeasonObj.season} E{ep.episode}
            </EpisodeMeta>
            <EpisodeDesc>{ep.description || ep.script || ""}</EpisodeDesc>
          </EpisodeInfo>
        </EpisodeCard>
      ))}
    </div>
  );
}
