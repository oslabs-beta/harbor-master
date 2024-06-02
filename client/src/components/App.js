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
    return React.createElement("div", null, "Hello from App.js");
}
export default App;
//# sourceMappingURL=App.js.map