import React, { useState } from 'react';

function AppSimple() {
  console.log('Simple App component rendering...');
  
  const [count, setCount] = useState(0);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>FOUNDIT - Test Page</h1>
      <p>If you can see this, the basic React app is working!</p>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
      <p>This is a simple test to verify the app can render without Firebase dependencies.</p>
    </div>
  );
}

export default AppSimple;