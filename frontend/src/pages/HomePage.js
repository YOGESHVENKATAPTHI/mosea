import React, { useEffect, useState, useContext } from 'react';
import styled from 'styled-components';
import CategoryIconsRow from '../components/home/CategoryIconsRow';
import ContentCarousel from '../components/home/ContentCarousel';
import HeroSlider from '../components/home/HeroSlider';
import API from '../api';
import { AuthContext } from '../contexts/AuthContext';

const Wrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2.5rem 1vw 3rem 1vw;
`;
const getWatchLink = (item) => `/watch/${item.type}/${item.contentid}`;
export default function HomePage() {
  const [recommended, setRecommended] = useState([]);
  const [originals, setOriginals] = useState([]);
  const [trending, setTrending] = useState([]);
  const [anime, setAnime] = useState([]);
  const [heroItems, setHeroItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    async function fetchContent() {
      setLoading(true);
      try {
        console.log('[HomePage] Fetching all content...');
        const { data } = await API.get('/content/all');
        console.log('[HomePage] Content fetched:', data);
        setRecommended(data.data.recommended || []);
        setOriginals(data.data.originals || []);
        setTrending(data.data.trending || []);
        setAnime(data.data.anime || []);
      } catch (err) {
        console.error('[HomePage] Error fetching content:', err);
        setRecommended([]);
        setOriginals([]);
        setTrending([]);
        setAnime([]);
      }
      setLoading(false);
    }
    fetchContent();
  }, []);

  useEffect(() => {
    async function fetchHistory() {
      if (!user || !user.username) return;
      try {
        console.log('[HomePage] Fetching user history for', user.username);
        const { data } = await API.get(`/content/history/${user.username}`);
        const history = data.data || [];
        // Analyze most-watched categories/scripts
        const freq = {};
        history.forEach(item => {
          const key = (item.category || '') + '|' + (item.script || '');
          if (!freq[key]) freq[key] = { ...item, count: 0 };
          freq[key].count++;
        });
        // Sort by frequency (most watched)
        const sorted = Object.values(freq).sort((a, b) => b.count - a.count);
        // Take top 5
        setHeroItems(sorted.slice(0, 5));
        console.log('[HomePage] HeroSlider items:', sorted.slice(0, 5));
      } catch (err) {
        console.error('[HomePage] Error fetching user history:', err);
        setHeroItems([]);
      }
    }
    fetchHistory();
  }, [user]);

  return (
    <Wrapper>
      {heroItems.length > 0 && <HeroSlider items={heroItems} />}
      <CategoryIconsRow />
      <ContentCarousel title="Recommended For You" contents={recommended} type="movie" />
      <ContentCarousel title="Trending" contents={trending} type="movie" />
      <ContentCarousel title="Originals" contents={originals} type="series" />
      <ContentCarousel title="Anime" contents={anime} type="anime" />
    </Wrapper>
  );
}