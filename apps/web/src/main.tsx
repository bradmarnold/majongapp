import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { ADVICE_API_URL } from './config';

const defaultTiles = [
  'char_1.png','char_2.png','char_3.png','char_4.png','char_5.png','char_6.png','char_7.png','char_8.png','char_9.png',
  'bamboo_1.png','bamboo_2.png','bamboo_3.png','bamboo_4.png','bamboo_5.png','bamboo_6.png','bamboo_7.png','bamboo_8.png','bamboo_9.png',
  'dot_1.png','dot_2.png','dot_3.png','dot_4.png','dot_5.png','dot_6.png','dot_7.png','dot_8.png','dot_9.png',
  'wind_e.png','wind_s.png','wind_w.png','wind_n.png',
  'dragon_red.png','dragon_green.png','dragon_white.png',
  'flower_1.png','flower_2.png','flower_3.png','flower_4.png',
  'season_1.png','season_2.png','season_3.png','season_4.png',
  'tile_back.png'
];

function TileImage({ name }: { name: string }) {
  const [src, setSrc] = useState(`/assets/tiles/${name}`);
  const handleError: React.ReactEventHandler<HTMLImageElement> = () => {
    setSrc('');
  };
  return src ? (
    <img src={src} alt={name} style={{ width: 50, height: 72, margin: 2 }} onError={handleError} />
  ) : (
    <div
      style={{ width: 50, height: 72, border: '1px solid #ccc', display: 'inline-block', margin: 2 }}
      aria-label={`Placeholder for ${name}`}
    ></div>
  );
}

function App() {
  return (
    <main>
      <h1>Mahjong App</h1>
      <section aria-label="Tiles">
        {defaultTiles.map((name) => (
          <TileImage key={name} name={name} />
        ))}
      </section>
    </main>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
