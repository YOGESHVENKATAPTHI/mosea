import React from 'react';
import styled from 'styled-components';
import { FaFilm, FaTv, FaDragon, FaStar } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const categories = [
  { name: 'Movies', icon: <FaFilm /> },
  { name: 'Series', icon: <FaTv /> },
  { name: 'Anime', icon: <FaDragon /> },
  { name: 'Originals', icon: <FaStar /> },
];

const Row = styled.div`
  display: flex;
  justify-content: center;
  gap: 2.5rem;
  margin: 2.5rem 0 1.5rem 0;
  flex-wrap: wrap;
`;

const CatCard = styled.div`
  background: #181c24;
  border-radius: 1.2rem;
  padding: 1.2rem 2.2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 2px 12px #0003;
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
  &:hover {
    transform: translateY(-6px) scale(1.05);
    box-shadow: 0 6px 24px #0005;
    background: #232a3a;
  }
`;

const CatIcon = styled.div`
  font-size: 2.5rem;
  color: #e50914;
  margin-bottom: 0.7rem;
`;

const CatName = styled.div`
  font-size: 1.1rem;
  font-weight: 600;
  color: #fff;
`;

const WatchBtn = styled.button`
  background: #e50914;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 0.5rem 1.2rem;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 2px 8px #e5091440;
  transition: background 0.2s;
  &:hover {
    background: #b0060f;
  }
`;

const CategoryIconsRow = () => {
  const navigate = useNavigate();
  return (
    <Row>
      {categories.map((cat) => (
        <CatCard key={cat.name}>
          <CatIcon>{cat.icon}</CatIcon>
          <CatName>{cat.name}</CatName>
          <WatchBtn onClick={() => navigate(`/#${cat.name.toLowerCase()}`)}>
            Watch
          </WatchBtn>
        </CatCard>
      ))}
    </Row>
  );
};

export default CategoryIconsRow;
