import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [message, setMessage] = useState('Loading...');
  const [time, setTime] = useState('');
  const [count, setCount] = useState(0);

  useEffect(() => {
    // Simulate API call to get initial data
    const fetchData = async () => {
      try {
        // In a real app, this would be an actual API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setMessage('Welcome to React + Bun on Railway!');
        setTime(new Date().toLocaleTimeString());
      } catch (error) {
        setMessage('Failed to load data');
        console.error('Error fetching data:', error);
      }
    };

    fetchData();

    // Update time every second
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const features = [
    { icon: '⚡', title: 'Fast Builds', description: 'Lightning-fast builds with Bun' },
    { icon: '🚀', title: 'Railway Deploy', description: 'One-click deployment to Railway' },
    { icon: '⚛️', title: 'React 18', description: 'Latest React with hooks and features' },
    { icon: '🎨', title: 'Modern CSS', description: 'CSS with modern features and animations' },
    { icon: '📱', title: 'Responsive', description: 'Mobile-first responsive design' },
    { icon: '🔧', title: 'Developer Tools', description: 'Built-in development tools' },
  ];

  return (
    <div className="app">
      <header className="header">
        <div className="container">
          <h1 className="title">
            <span className="react-icon">⚛️</span>
            React + Bun
            <span className="bun-icon">🥟</span>
          </h1>
          <p className="subtitle">Powered by Railway</p>
          <div className="live-time">
            Current Time: <span className="time">{time}</span>
          </div>
        </div>
      </header>

      <main className="main">
        <div className="container">
          <section className="hero">
            <div className="hero-content">
              <h2>{message}</h2>
              <p>
                This is a modern React application built with Bun and optimized for Railway deployment.
                Experience the speed of Bun with the power of React.
              </p>
              <div className="hero-buttons">
                <button 
                  className="btn btn-primary"
                  onClick={() => setCount(count + 1)}
                >
                  Count: {count}
                </button>
                <button 
                  className="btn btn-secondary"
                  onClick={() => setCount(0)}
                >
                  Reset
                </button>
              </div>
            </div>
          </section>

          <section className="features">
            <h2>Features</h2>
            <div className="features-grid">
              {features.map((feature, index) => (
                <div key={index} className="feature-card">
                  <div className="feature-icon">{feature.icon}</div>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="tech-stack">
            <h2>Tech Stack</h2>
            <div className="tech-grid">
              <div className="tech-item">
                <span className="tech-icon">⚛️</span>
                <span>React 18</span>
              </div>
              <div className="tech-item">
                <span className="tech-icon">🥟</span>
                <span>Bun</span>
              </div>
              <div className="tech-item">
                <span className="tech-icon">🚂</span>
                <span>TypeScript</span>
              </div>
              <div className="tech-item">
                <span className="tech-icon">🎨</span>
                <span>Tailwind CSS</span>
              </div>
              <div className="tech-item">
                <span className="tech-icon">🚀</span>
                <span>Railway</span>
              </div>
              <div className="tech-item">
                <span className="tech-icon">📦</span>
                <span>Vite</span>
              </div>
            </div>
          </section>

          <section className="deployment">
            <h2>Deployment</h2>
            <div className="deployment-steps">
              <div className="step">
                <div className="step-number">1</div>
                <div className="step-content">
                  <h3>Connect to GitHub</h3>
                  <p>Link your repository to Railway</p>
                </div>
              </div>
              <div className="step">
                <div className="step-number">2</div>
                <div className="step-content">
                  <h3>Auto-Detect</h3>
                  <p>Railway automatically detects your React app</p>
                </div>
              </div>
              <div className="step">
                <div className="step-number">3</div>
                <div className="step-content">
                  <h3>Deploy</h3>
                  <p>Your app is live with automatic SSL and CDN</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      <footer className="footer">
        <div className="container">
          <p>
            Built with <span className="heart">❤️</span> using React, Bun, and Railway
          </p>
          <div className="footer-links">
            <a href="https://react.dev" target="_blank" rel="noopener noreferrer">React</a>
            <a href="https://bun.sh" target="_blank" rel="noopener noreferrer">Bun</a>
            <a href="https://railway.com" target="_blank" rel="noopener noreferrer">Railway</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
