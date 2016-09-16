import React from 'react';
import SearchBar from './SearchBar';

class App extends React.Component {
  render() {
    return (
      <div>
        <SearchBar />
        {this.props.children}
      </div>
    );
  }
}

export default App;