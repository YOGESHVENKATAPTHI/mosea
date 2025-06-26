import React from 'react';
import styled from 'styled-components';
import ContentCard from './ContentCard';

const Section = styled.section`
  margin-bottom: 2.5rem;
`;

const Title = styled.h2`
  font-size: 1.4rem;
  font-weight: 700;
  margin-bottom: 1.2rem;
  color: #fff;
`;

const Carousel = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1.5rem;
`;

const Empty = styled.div`
  color: #aaa;
  font-size: 1.1rem;
  margin: 1.5rem 0 2rem 0;
  text-align: center;
  background: #181c24;
  border-radius: 1rem;
  padding: 2rem 0;
`;

export default function ContentCarousel({ title, contents, type }) {
  return (
    <Section>
      <Title>{title}</Title>
      {contents && contents.length > 0 ? (
        <Carousel>
          {contents.map((item) => (
            <ContentCard key={item.contentid} content={item} type={type} />
          ))}
        </Carousel>
      ) : (
        <Empty>
          No content found.<br />
          <button
            style={{
              marginTop: '1rem',
              background: '#e50914',
              color: '#fff',
              border: 'none',
              borderRadius: '0.7rem',
              padding: '0.7rem 1.5rem',
              fontSize: '1.1rem',
              fontWeight: 500,
              cursor: 'pointer',
              boxShadow: '0 2px 8px #0003'
            }}
            onClick={() => window.location.href = '/'}
          >
            <span style={{ marginRight: 8 }}>Browse All</span> <span role="img" aria-label="play">▶️</span>
          </button>
        </Empty>
      )}
    </Section>
  );
} 