import React from 'react';
import { Link } from 'react-router';
import SearchBarStore from '../stores/SearchBarStore';
import SearchBarActions from '../actions/SearchBarActions';

class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = SearchBarStore.getState();
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    SearchBarStore.listen(this.onChange);
  }

  componentWillUnmount() {
    SearchBarStore.unlisten(this.onChange);
  }

  onChange(state) {
    this.setState(state);
  }

  handleSubmit(event) {
    event.preventDefault();

    let searchQuery = this.state.searchQuery.trim();

    if (searchQuery) {
      SearchBarActions.findPlayer({
        searchQuery: searchQuery,
        searchForm: this.refs.searchForm,
        history: this.props.history
      });
    }
  }

  render() {
    return (
      <nav className='search-bar search-bar-default search-bar-static-top'>
        <div className='search-bar-header'>
          <button type='button' className='search-bar-toggle collapsed' data-toggle='collapse' data-target='#search-bar'>
            <span className='sr-only'>Toggle navigation</span>
            <span className='icon-bar'></span>
            <span className='icon-bar'></span>
            <span className='icon-bar'></span>
          </button>
        </div>
        <div id='search-bar' className='search-bar-collapse collapse'>
          <form ref='searchForm' className='search-bar-form search-bar-left animated' onSubmit={this.handleSubmit.bind(this)}>
            <div className='input-group'>
              <input type='text' className='form-control' value={this.state.searchQuery} onChange={search-barActions.updateSearchQuery} />
              <span className='input-group-btn'>
                <button className='btn btn-default' onClick={this.handleSubmit.bind(this)}><span className='glyphicon glyphicon-search'></span></button>
              </span>
            </div>
          </form>
        </div>
      </nav>
    );
  }
}

export default SearchBar;