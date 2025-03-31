import React, { useState } from 'react';
import '../../styles/Home.css';

function Home() {
  const [shrunkFruits, setShrunkFruits] = useState({});

  const handleFruitClick = (index) => {
    setShrunkFruits(prev => ({
      ...prev,
      [index]: true
    }));

    setTimeout(() => {
      setShrunkFruits(prev => ({
        ...prev,
        [index]: false
      }));
    }, 5000);
  };

  const fruits = ['🍎', '🍊', '🍇', '🍓', '🍐', '🍑', '🍍', '🥭'];

  return (
    <>
      <div className="content">
        <h1>Cursor Koetelma</h1>
        <p>Tästä lähtee!</p>
      </div>
      <div className="fruit-animation">
        {fruits.map((fruit, index) => (
          <div
            key={index}
            className={`fruit fruit-${index + 1} ${shrunkFruits[index] ? 'shrunk' : ''}`}
            onClick={() => handleFruitClick(index)}
          >
            {fruit}
          </div>
        ))}
      </div>
    </>
  );
}

export default Home; 