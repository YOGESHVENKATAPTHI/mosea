import React, { useState } from "react";
import styled from "styled-components";
import { FaChevronLeft, FaChevronRight, FaPlay, FaFilm, FaTv, FaDragon, FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const categoryIcons = {
  movie: <FaFilm />,
  series: <FaTv />,
  anime: <FaDragon />,
  originals: <FaStar />,
};

const SliderWrapper = styled.div`
  position: relative;
  width: 100vw;
  max-width: 100%;
  height: 380px;
  margin: 0 -10vw 2.5rem -10vw;
  overflow: hidden;
  background: linear-gradient(120deg, #181818 60%, #232526 100%);
  @media (max-width: 900px) {
    height: 260px;
    margin: 0 -4vw 2rem -4vw;
  }
`;

const Slides = styled.div`
  display: flex;
  transition: transform 0.6s cubic-bezier(0.4,0,0.2,1);
  transform: translateX(${p => -p.active * 80}vw);
`;

const Slide = styled.div`
  min-width: 80vw;
  height: 370px;
  margin: 0 1vw;
  background: url(${p => p.$bg}) center/cover no-repeat;
  border-radius: 2rem;
  box-shadow: 0 8px 32px 0 #0007;
  display: flex;
  align-items: flex-end;
  position: relative;
  overflow: hidden;
  @media (max-width: 900px) {
    min-width: 96vw;
    height: 250px;
    border-radius: 1.2rem;
  }
`;

const Glass = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, #181818e0 40%, #18181800 100%);
  backdrop-filter: blur(6px) saturate(1.2);
  z-index: 1;
`;

const SlideContent = styled.div`
  position: relative;
  z-index: 2;
  padding: 2.5rem 2.5rem 2.5rem 3.5rem;
  color: #fff;
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
  @media (max-width: 900px) {
    padding: 1.2rem 1.2rem 1.2rem 1.7rem;
  }
`;

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1.1rem;
`;

const CatIcon = styled.div`
  font-size: 2.2rem;
  color: #e50914;
  filter: drop-shadow(0 2px 8px #e5091440);
`;

const Title = styled.h2`
  font-size: 2.3rem;
  font-weight: bold;
  margin: 0;
  letter-spacing: 0.5px;
  @media (max-width: 900px) {
    font-size: 1.3rem;
  }
`;

const Desc = styled.p`
  font-size: 1.15rem;
  color: #eee;
  max-width: 60%;
  margin: 0.5rem 0 0 0;
  @media (max-width: 900px) {
    font-size: 0.95rem;
    max-width: 90%;
  }
`;

const WatchBtn = styled.button`
  margin-top: 1.2rem;
  background: linear-gradient(90deg, #e50914 60%, #b0060f 100%);
  color: #fff;
  border: none;
  border-radius: 1.2rem;
  padding: 0.8rem 2.2rem;
  font-size: 1.15rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 0.7rem;
  cursor: pointer;
  box-shadow: 0 2px 12px #e5091440;
  transition: background 0.2s, transform 0.2s;
  &:hover {
    background: #b0060f;
    transform: scale(1.04);
  }
`;

const ArrowBtn = styled.button`
  position: absolute;
  top: 50%;
  ${p => (p.left ? "left: 1vw;" : "right: 1vw;")}
  transform: translateY(-50%);
  background: #232526cc;
  border: none;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  color: #fff;
  font-size: 1.7rem;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  cursor: pointer;
  transition: background 0.2s, box-shadow 0.2s;
  box-shadow: 0 2px 8px #18181860;
  &:hover {
    background: #e50914;
    color: #fff;
  }
  @media (max-width: 900px) {
    width: 36px;
    height: 36px;
    font-size: 1.2rem;
  }
`;

const HeroSlider = ({ items }) => {
  const [active, setActive] = useState(0);
  const navigate = useNavigate();

  const next = () => setActive(a => Math.min(a + 1, items.length - 1));
  const prev = () => setActive(a => Math.max(a - 1, 0));

  if (!items || items.length === 0) return null;
  return (
    <SliderWrapper>
      <ArrowBtn left onClick={prev} disabled={active === 0}><FaChevronLeft /></ArrowBtn>
      <ArrowBtn onClick={next} disabled={active === items.length - 1}><FaChevronRight /></ArrowBtn>
      <Slides active={active}>
        {items.map((item, idx) => {
          // Determine type for icon
          let type = (item.category || '').toLowerCase();
          if (type.includes('movie')) type = 'movie';
          else if (type.includes('series')) type = 'series';
          else if (type.includes('anime')) type = 'anime';
          else if (type.includes('original')) type = 'originals';
          else type = 'movie';
          return (
            <Slide key={item.contentid || idx} $bg={item.imageUrl || item.imageurl || "/default-hero.jpg"}>
              <Glass />
              <SlideContent>
                <TitleRow>
                  <CatIcon>{categoryIcons[type]}</CatIcon>
                  <Title>{item.name || item.title || 'Untitled'}</Title>
                </TitleRow>
                <Desc>{item.script || item.description || 'No description available.'}</Desc>
                <WatchBtn onClick={() => navigate(`/watch/${type}/${item.contentid}`)}>
                  <FaPlay /> Watch Now
                </WatchBtn>
              </SlideContent>
            </Slide>
          );
        })}
      </Slides>
    </SliderWrapper>
  );
};

export default HeroSlider; 