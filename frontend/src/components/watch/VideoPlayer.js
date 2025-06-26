import React, { useRef, useEffect, useContext } from 'react';
import styled from 'styled-components';
import { AuthContext } from '../../contexts/AuthContext';
import api from "../../api";

const PlayerWrapper = styled.div`
  background: #181c24;
  border-radius: 1.2rem;
  padding: 2rem;
  margin: 2rem auto 1.5rem auto;
  max-width: 900px;
  box-shadow: 0 2px 16px #0005;
`;

const Video = styled.video`
  width: 100%;
  border-radius: 1rem;
  background: #000;
`;

const QualitySelect = styled.select`
  margin-top: 1rem;
  padding: 0.4rem 1rem;
  border-radius: 0.5rem;
  border: none;
  background: #232a3a;
  color: #fff;
  font-size: 1rem;
`;

export default function VideoPlayer({
  videoUrls, // { '4k': url, '1080p': url, ... } for the selected language
  qualities,
  contentId,
  contentType,
  name,
  imageUrl,
  season,
  episode,
  leaving,
  category,
  script,
  content,
  selectedLanguage
}) {
  const { user } = useContext(AuthContext);
  const videoRef = useRef();
  const [quality, setQuality] = React.useState('480p');
  const [currentTime, setCurrentTime] = React.useState(leaving || 0);
  const updateInterval = 10; // seconds

  // Helper to upsert history
  const upsertHistory = async (leavePos) => {
    if (!user?.username) return;
    const payload = {
      ...content,
      contentid: contentId,
      type: contentType,
      season,
      episode,
      leaving: leavePos,
      lastWatched: new Date().toISOString(),
      quality,
      selectedLanguage,
      ...videoUrls
    };
    try {
      await api.post(`/content/history/${user.username}/${contentId}`, payload);
      console.log('[VideoPlayer] History upserted:', payload);
    } catch (err) {
      console.error('[VideoPlayer] Error upserting history:', err);
    }
  };

  // On mount: upsert with leaving: 0 (if not already present)
  useEffect(() => {
    upsertHistory(0);
    // eslint-disable-next-line
  }, [user, contentId]);

  // Set video to last watched position
  useEffect(() => {
    if (videoRef.current && leaving && leaving > 0) {
      videoRef.current.currentTime = leaving;
    }
  }, [leaving]);

  // Save progress on pause, seek, or unload
  useEffect(() => {
    const saveProgress = () => {
      const pos = videoRef.current?.currentTime || 0;
      upsertHistory(pos);
    };

    const video = videoRef.current;
    if (video) {
      video.addEventListener('pause', saveProgress);
      video.addEventListener('seeked', saveProgress);
      window.addEventListener('beforeunload', saveProgress);
    }
    return () => {
      if (video) {
        video.removeEventListener('pause', saveProgress);
        video.removeEventListener('seeked', saveProgress);
        window.removeEventListener('beforeunload', saveProgress);
      }
    };
    // eslint-disable-next-line
  }, [user, contentId, quality, season, episode, selectedLanguage]);

  // Change quality
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.src = videoUrls[quality];
      videoRef.current.load();
      if (currentTime) {
        videoRef.current.currentTime = currentTime;
      }
    }
    // eslint-disable-next-line
  }, [quality, videoUrls]);

  // Periodically update progress
  useEffect(() => {
    if (!user?.username || !contentId) return;
    let interval;
    function sendProgress() {
      const currentTime = videoRef.current?.currentTime || 0;
      const payload = {
        name,
        contentid: contentId,
        type: contentType,
        season,
        episode,
        leaving: Math.floor(currentTime),
        lastWatched: new Date().toISOString(),
        imageurl: imageUrl,
        category,
        script,
      };
      api.post(`/content/history/${user.username}/${contentId}`, payload)
        .then(res => {
          // Optionally log success
        })
        .catch(err => {
          // Optionally log error
        });
    }
    interval = setInterval(sendProgress, 10000); // every 10 seconds
    // On unmount, send one last update
    return () => {
      sendProgress();
      clearInterval(interval);
    };
    // eslint-disable-next-line
  }, [user, contentId, contentType, season, episode, name, imageUrl, category, script]);

  // If no qualities available, show a message
  if (!videoUrls || Object.keys(videoUrls).length === 0) {
    return <div style={{ color: '#fff', background: '#232323', padding: '2rem', borderRadius: '1rem', textAlign: 'center' }}>No video available for the selected language.</div>;
  }

  // Choose the best available quality
  const src =
    (qualities && qualities.includes("4k") && videoUrls["4k"]) ||
    (qualities && qualities.includes("1080p") && videoUrls["1080p"]) ||
    (qualities && qualities.includes("720p") && videoUrls["720p"]) ||
    (qualities && qualities.includes("480p") && videoUrls["480p"]) ||
    "";

  return (
    <PlayerWrapper>
      <Video
        ref={videoRef}
        controls
        poster={imageUrl}
        onTimeUpdate={e => setCurrentTime(e.target.currentTime)}
      >
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </Video>
      <div style={{ marginTop: '1rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <div>
          <label htmlFor="quality">Quality: </label>
          <QualitySelect
            id="quality"
            value={quality}
            onChange={e => setQuality(e.target.value)}
          >
            {Object.keys(videoUrls).map(q => (
              <option key={q} value={q}>{q}</option>
            ))}
          </QualitySelect>
        </div>
        {selectedLanguage && (
          <div style={{ fontSize: '1.05rem', color: '#bbb' }}>
            <span style={{ fontWeight: 600, color: '#fff' }}>Language:</span> {selectedLanguage.toUpperCase()}
          </div>
        )}
      </div>
    </PlayerWrapper>
  );
}
