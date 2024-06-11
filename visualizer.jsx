import React, { useState, useEffect, useContext, createContext } from 'react';
import ReactDOM from 'react-dom';
import './styles.css';

// Custom hook for generating unique IDs
const useUniqueId = () => {
  const [id, setId] = useState(0);
  return () => {
    setId(id + 1);
    return `component-${id}`;
  };
};

// Custom hook for handling theme context
const ThemeContext = createContext('light');
const useTheme = () => useContext(ThemeContext);

// Higher-order component for error boundaries
const withErrorBoundary = (WrappedComponent) => {
  class ErrorBoundary extends React.Component {
    state = { hasError: false };

    static getDerivedStateFromError(error) {
      return { hasError: true };
    }

    render() {
      if (this.state.hasError) {
        return <div>Something went wrong.</div>;
      }
      return <WrappedComponent {...this.props} />;
    }
  }

  return ErrorBoundary;
};

// Component for rendering individual components
const Component = ({ id, updateComponent, removeComponent }) => {
  const [count, setCount] = useState(0);
  const theme = useTheme();

  useEffect(() => {
    console.log(`Component ${id} mounted`);
    return () => {
      console.log(`Component ${id} unmounted`);
    };
  }, [id]);

  return (
    <div className={`component ${theme}`}>
      <div>Component {id}</div>
      <div>Count: {count}</div>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <button onClick={() => updateComponent(id)}>Update</button>
      <button onClick={() => removeComponent(id)}>Remove</button>
    </div>
  );
};

// Main application component
const App = () => {
  const [components, setComponents] = useState([]);
  const [theme, setTheme] = useState('light');
  const generateId = useUniqueId();

  const addComponent = () => {
    const newId = generateId();
    setComponents([...components, newId]);
  };

  const updateComponent = (id) => {
    console.log(`Updating component ${id}`);
  };

  const removeComponent = (id) => {
    setComponents(components.filter((compId) => compId !== id));
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={theme}>
      <div className={`app ${theme}`}>
        <h1>React Context and Hooks Visualizer</h1>
        <button onClick={addComponent}>Add Component</button>
        <button onClick={toggleTheme}>Toggle Theme</button>
        <div className="component-tree">
          {components.map((id) => (
            <Component
              key={id}
              id={id}
              updateComponent={updateComponent}
              removeComponent={removeComponent}
            />
          ))}
        </div>
      </div>
    </ThemeContext.Provider>
  );
};

const AppWithErrorBoundary = withErrorBoundary(App);

ReactDOM.render(<AppWithErrorBoundary />, document.getElementById('root'));
