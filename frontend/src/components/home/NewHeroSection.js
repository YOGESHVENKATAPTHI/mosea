import React from "react";
import styled, { keyframes } from "styled-components";
import { FaPlay, FaStar, FaCalendarAlt, FaFilm, FaTv, FaDragon } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const fadeIn = keyframes`
  from { opacity: 0; transform: scale(1.04);}
  to { opacity: 1; transform: scale(1);}
`;

const HeroWrapper = styled.div`
  position: relative;
  width: 100vw;
  max-width: 100%;
  height: 420px;
  margin: 0 -10vw 2.5rem -10vw;
  overflow: hidden;
  background: linear-gradient(120deg, #181818 60%, #232526 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${fadeIn} 0.8s cubic-bezier(0.4,0,0.2,1);
  @media (max-width: 900px) {
    height: 260px;
    margin: 0 -4vw 2rem -4vw;
  }
`;

const HeroImage = styled.img`
  width: 420px;
  height: 100%;
  object-fit: cover;
  border-radius: 2rem;
  box-shadow: 0 8px 32px 0 #0007;
  @media (max-width: 900px) {
    width: 220px;
    border-radius: 1.2rem;
  }
`;

const HeroContent = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-10%, -50%);
  z-index: 2;
  color: #fff;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  max-width: 600px;
  @media (max-width: 900px) {
    left: 60%;
    max-width: 90vw;
    gap: 0.7rem;
  }
`;

const Badge = styled.div`
  background: linear-gradient(90deg, #e50914 60%, #b0060f 100%);
  color: #fff;
  font-weight: bold;
  font-size: 1.1rem;
  padding: 0.3rem 1.2rem;
  border-radius: 1rem;
  display: inline-block;
  margin-bottom: 0.2rem;
  letter-spacing: 1px;
`;

const Title = styled.h1`
  font-size: 2.7rem;
  font-weight: bold;
  margin: 0;
  letter-spacing: 1px;
  text-shadow: 0 2px 12px #000a;
  @media (max-width: 900px) {
    font-size: 1.5rem;
  }
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1.2rem;
  font-size: 1.1rem;
  color: #ffd700;
`;

const Desc = styled.p`
  font-size: 1.15rem;
  color: #eee;
  margin: 0.5rem 0 0 0;
  text-shadow: 0 2px 8px #000a;
  @media (max-width: 900px) {
    font-size: 0.95rem;
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

const categoryIcons = {
  movie: <FaFilm />,
  series: <FaTv />,
  anime: <FaDragon />,
};

export default function NewHeroSection({ item }) {
  const navigate = useNavigate();
  if (!item) return null;
  const type = (item.category || '').toLowerCase();
  return (
    <HeroWrapper>
      <HeroImage src={item.imageUrl || item.imageurl || "/default-hero.jpg"} alt={item.name || item.title} />
      <HeroContent>
        <Badge>Top Pick</Badge>
        <Title>
          {categoryIcons[type] || <FaFilm />} {item.name || item.title}
        </Title>
        <InfoRow>
          <span><FaStar /> 8.7</span>
          <span><FaCalendarAlt /> 2023</span>
          <span style={{ color: "#e50914" }}>{type.charAt(0).toUpperCase() + type.slice(1)}</span>
        </InfoRow>
        <Desc>{item.script || item.description || "No description available."}</Desc>
        <WatchBtn onClick={() => navigate(`/watch/${type}/${item.contentid}`)}>
          <FaPlay /> Watch Now
        </WatchBtn>
      </HeroContent>
    </HeroWrapper>
  );
}
