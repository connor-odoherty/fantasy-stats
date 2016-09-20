 import React from 'react';
import {Link} from 'react-router';
import NavbarStore from '../stores/NavbarStore';
import NavbarActions from '../actions/NavbarActions';

class Navbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = NavbarStore.getState();
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    NavbarStore.listen(this.onChange);
  }

  componentWillUnmount() {
    NavbarStore.unlisten(this.onChange);
  }

  onChange(state) {
    this.setState(state);
  }

  handleSubmit(event) {
    event.preventDefault();

    let searchQuery = this.state.searchQuery.trim();

    if (searchQuery) {
      NavbarActions.findPlayer({
        searchQuery: searchQuery,
        searchForm: this.refs.searchForm,
        history: this.props.history
      });
    }
  }

  handleFindPlayer() {
    const player = 'Corey Coleman';
    NavbarActions.findPlayer(player);
  }

  handleLoadFD() {
    NavbarActions.loadFantasyDataADP();
  }

  handleLoadFFN() {
    NavbarActions.loadFFNPlayers();
  }

  handleCollect() {
    NavbarActions.loadCollect();
  }

  render() {
    //console.log("State:", this.state)
    return (
      <nav className='navbar navbar-default navbar-static-top'>
        <div className='navbar-header'>
          <button type='button' className='navbar-toggle collapsed' data-toggle='collapse' data-target='#navbar'>
            <span className='sr-only'>Toggle navigation</span>
            <span className='icon-bar'></span>
            <span className='icon-bar'></span>
            <span className='icon-bar'></span>
          </button>
          <Link to='/' className='navbar-brand'>
            FANTASY STATS
            <span className='badge badge-up badge-danger'>{this.state.onlineUsers}</span>
          </Link>
        </div>
        <div id='navbar' className='navbar-collapse collapse'>
          <form ref='searchForm' className='navbar-form navbar-left animated' onSubmit={this.handleSubmit.bind(this)}>
            <div className='input-group'>
              <input type='text' className='form-control' placeholder={'search'} value={this.state.searchQuery} onChange={NavbarActions.updateSearchQuery} />
              <span className='input-group-btn'>
                <button className='btn btn-default' onClick={ this.handleFindPlayer.bind(this) }><span className='glyphicon glyphicon-search'></span></button>
              </span>
              <span className='input-group-btn'>
                <button className='btn btn-default' onClick={ this.handleLoadFD.bind(this) }><span>LOAD FD</span></button>
              </span>
              <span className='input-group-btn'>
                <button className='btn btn-default' onClick={ this.handleLoadFFN.bind(this) }><span>LOAD FFN</span></button>
              </span>
              <span className='input-group-btn'>
                <button className='btn btn-default' onClick={ this.handleCollect.bind(this) }><span>COLLECT</span></button>
              </span>
            </div>
          </form>
          <ul className='nav navbar-nav'>
            <li><Link to='/'>Home</Link></li>
            <li><Link to='/stats'>Stats</Link></li>
            <li className='dropdown'>
              <a href='#' className='dropdown-toggle' data-toggle='dropdown'>Top 10 <span className='caret'></span></a>
              <ul className='dropdown-menu'>
                <li><Link to='/top'>Top Overall</Link></li>
                <li><Link to='/top/QB'>QB</Link></li>
                <li><Link to='/top/RB'>RB</Link></li>
                <li><Link to='/top/WR'>WR</Link></li>
                <li><Link to='/top/TE'>TE</Link></li>
              </ul>
            </li>
          </ul>
        </div>
      </nav>
    );
  }
}

export default Navbar;