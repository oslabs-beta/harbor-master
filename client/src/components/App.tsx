import React, { useEffect, useState } from 'react';

function App() {
  const [backendData, setBackendData] = useState([{}]);
  useEffect(() => {
    fetch('/api')
      .then((response) => response.json())
      .then((data) => {
        setBackendData(data);
        console.log(backendData);
      });
  }, []);
  return <div>Hello from App.js</div>;
}

export default App;
