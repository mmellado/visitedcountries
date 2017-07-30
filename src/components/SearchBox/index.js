import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { updateUserCountries } from '../../actions/users';

class SearchBox extends Component {
  static propTypes = {
    user: PropTypes.object.isRequired,
    updateUserCountries: PropTypes.func.isRequired,
  };

  maxTypeaheadResults = 10;

  state = {
    searchBoxVal: '',
    typeAheadOptions: null,
    isSearchVisible: false,
  };

  enableSearch = () => {
    this.setState({
      isSearchVisible: !this.state.isSearchVisible,
      typeAheadOptions: null,
      searchBoxVal: '',
    });
  }

  searchForCountry = (e) => {
    e.persist();
    this.setState({
      searchBoxVal: e.target.value,
    }, () => {
      const { searchBoxVal } = this.state;
      if (searchBoxVal.length >= 3) {
        this.showTypeAhead(searchBoxVal);
      } else {
        this.setState({
          typeAheadOptions: null,
        });
      }
    });
  };

  showTypeAhead = (searchBoxVal) => {
    const { nonVisitedCountries } = this.props.user;
    let foundOptions = 0;
    const typeAheadOptions = [];

    Object.keys(nonVisitedCountries).forEach(key => {
      if (foundOptions >= this.maxTypeaheadResults) {
        return false;
      }
      if (nonVisitedCountries[key].toLowerCase().includes(searchBoxVal.toLowerCase())) {
        foundOptions++;
        typeAheadOptions.push( [key, nonVisitedCountries[key]])
      }
    });

    this.setState({ typeAheadOptions });
  }

  clearTypeahead = (e) => {
    // if escape was pressed hide typeahead
    if (e.nativeEvent.keyCode === 27) {
      this.setState({
        typeAheadOptions: null,
        isSearchVisible: false,
        searchBoxValue: '',
      });
    }
  }

  addCountry = country => {
    const dirtyCountries = this.props.user.countries;
    dirtyCountries.push(country);
    this.props.updateUserCountries(dirtyCountries);
    this.setState({
      searchBoxVal: '',
      typeAheadOptions: null,
      isSearchVisible: false,
    })
  }

  render() {
    const { searchBoxVal, typeAheadOptions, isSearchVisible } = this.state;

    return (
      <div className="search-box">
        {
          isSearchVisible
          ?
            <div>
              <input
                type="text"
                ref={el => this.searchbox = el}
                value={searchBoxVal}
                onChange={this.searchForCountry}
                onKeyDown={this.clearTypeahead}
                autoFocus
              />
              <button className="close" onClick={this.enableSearch}>
                <svg viewBox="0 0 12 12" version="1.1" xmlns="http://www.w3.org/2000/svg" className="close-icon">
                    <line x1="1" y1="11" x2="11" y2="1" stroke="black" strokeWidth="2"/>
                    <line x1="1" y1="1" x2="11" y2="11" stroke="black" strokeWidth="2"/>
                </svg>
              </button>
              <ul>
                {
                  typeAheadOptions
                  ?
                    typeAheadOptions.map(el => {
                      return (
                        <li key={el[0]}>
                          <a
                            href="javascript:void(0)"
                            onClick={() => this.addCountry(el[0])}
                          >
                            {el[1]}
                          </a>
                        </li>
                      )
                    })
                  :
                    null
                }
              </ul>
            </div>
          :
            <button className="open" onClick={this.enableSearch}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 310.42 310.42" className="search-icon">
                <path d="M273.587 214.965c49.11-49.11 49.11-129.02 0-178.132-49.11-49.11-129.02-49.11-178.13 0C53.793 78.497 47.483 140.463 76.51 188.85c0 0 2.085 3.498-.73 6.312-16.066 16.064-64.264 64.263-64.264 64.263-12.79 12.79-15.836 30.675-4.493 42.02l1.953 1.95c11.343 11.346 29.23 8.302 42.02-4.49l64.127-64.127c2.95-2.95 6.448-.866 6.448-.866 48.39 29.026 110.356 22.717 152.02-18.947zM118.71 191.71c-36.287-36.288-36.286-95.332.002-131.62 36.288-36.287 95.332-36.288 131.62 0 36.287 36.287 36.287 95.332 0 131.62-36.29 36.286-95.332 36.286-131.62 0z"/>
                <path d="M126.75 118.424c-1.69 0-3.406-.332-5.06-1.03-6.612-2.8-9.705-10.427-6.907-17.04 17.586-41.558 65.703-61.06 107.26-43.475 6.612 2.794 9.705 10.422 6.907 17.034-2.8 6.612-10.425 9.703-17.04 6.906-28.353-11.997-61.185 1.31-73.182 29.664-2.1 4.96-6.913 7.938-11.978 7.938z"/>
              </svg>
              <div>You can click a country or search for it here</div>
            </button>
        }
      </div>
    );
  }
}

function mapStateToProps({ users }) {
  return {
    user: users,
  }
}

export default connect(mapStateToProps, {
  updateUserCountries,
})(SearchBox);