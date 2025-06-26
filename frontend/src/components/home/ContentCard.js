import React from 'react';
import styled from 'styled-components';
import { FaPlayCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Card = styled.div`
  background: #181c24;
  border-radius: 1.2rem;
  overflow: hidden;
  box-shadow: 0 2px 12px #0003;
  position: relative;
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
  min-width: 180px;
  max-width: 220px;
  margin: 0 auto;
  &:hover {
    transform: translateY(-8px) scale(1.04);
    box-shadow: 0 8px 32px #0006;
  }
`;

const Poster = styled.img`
  width: 100%;
  height: 270px;
  object-fit: cover;
  display: block;
`;

const CardFooter = styled.div`
  padding: 1rem 0.7rem 0.7rem 0.7rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const Title = styled.div`
  font-size: 1.1rem;
  font-weight: 600;
  color: #fff;
  margin-bottom: 0.5rem;
`;

const WatchBtn = styled.button`
  background: #e50914;
  color: #fff;
  border: none;
  border-radius: 0.7rem;
  padding: 0.5rem 1.2rem;
  font-size: 1rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  margin-top: 0.3rem;
  transition: background 0.2s;
  &:hover {
    background: #b0060f;
  }
`;

export default function ContentCard({ content, type }) {
  const navigate = useNavigate();

  // Determine type from content if not provided
  let contentType = type;
  if (!contentType) {
    if (content.category) {
      const cat = content.category.toLowerCase();
      if (cat.includes('movie')) contentType = 'movie';
      else if (cat.includes('series')) contentType = 'series';
      else if (cat.includes('anime')) contentType = 'anime';
      else contentType = 'movie';
    } else if (content.type) {
      contentType = content.type.toLowerCase();
    } else {
      contentType = 'movie';
    }
  }

  return (
    <Card>
      <Poster src={content.imageUrl} alt={content.name} />
      <CardFooter>
        <Title>{content.name}</Title>
        <WatchBtn
          onClick={() => navigate(`/watch/${contentType}/${content.contentid}`)}
        >
          <FaPlayCircle /> Watch
        </WatchBtn>
      </CardFooter>
    </Card>
  );
} 