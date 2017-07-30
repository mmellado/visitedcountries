import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import FacebookLogin from 'react-facebook-login';
import { ReactSVGPanZoom } from 'react-svg-pan-zoom';

import setActivePage from '../../actions/navigation';
import { getUserData, updateUserCountries } from '../../actions/users';
import worldMap from '../../constants/map';
import countriesList from '../../constants/countries';
import SearchBox from '../../components/SearchBox';

class Home extends Component {
  static propTypes = {
    setActivePage: PropTypes.func.isRequired,
    getUserData: PropTypes.func.isRequired,
    updateUserCountries: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired
  };

  videoFiles = [
    'Boats_Maze',
    'Falling-Leaf',
    'Perfect_Hour',
    'Winterfell',
  ];

  videoRoute = './static/videos';
  imgRoute = './static/img';
  videoExtension = '.mp4';
  imgExtension = '.jpg';
  imgIndex = 0;
  interval = null;

  state = {
    hoveredCountry: '',
    video: `${this.videoRoute}/${this.videoFiles[this.imgIndex]}${this.videoExtension}`,
    fallbackImg: `${this.imgRoute}/${this.videoFiles[this.imgIndex]}${this.imgExtension}`,
  };

  constructor(props) {
    super(props);

    if (!this.props.user.isLoggedIn) {
      this.interval = setInterval(() => {
        if (this.imgIndex === this.videoFiles.length - 1) {
          this.imgIndex = 0;
        } else {
          this.imgIndex = this.imgIndex + 1;
        }
        const video = `${this.videoRoute}/${this.videoFiles[this.imgIndex]}${this.videoExtension}`;
        const fallbackImg = `${this.imgRoute}/${this.videoFiles[this.imgIndex]}${this.imgExtension}`;

        this.setState({ video, fallbackImg });
      }, 5000);
    }
  }

  componentWillMount() {
    this.props.setActivePage('Visited Countries Tracker', 'home');

    this.checkAndSetLoginStatus();
    this.paintSelectedCountries(this.props.user.countries);
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.user.isLoggedIn && nextProps.user.isLoggedIn && this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  componentDidUpdate() {
    const paths = document.getElementsByClassName('land');
    Array.prototype.forEach.call(paths, el => {
      el.classList.remove('visited');
    });
    this.paintSelectedCountries(this.props.user.countries);
  }

  paintSelectedCountries(countries) {
    countries.map(c => {
      const el = document.getElementById(c);
      if (el) {
        el.classList.add('visited');
      }
    });
  }

  checkAndSetLoginStatus = () => {
    this.props.getUserData();
  }

  getClickedCountry = (e) => {
    const countryId = e.target.getAttribute('id');
    const countries = this.props.user.countries;

    if (countryId) {
      if (countries.includes(countryId)) {
        const idx = countries.indexOf(countryId);
        countries.splice(idx, 1);
      } else {
        countries.push(countryId);
      }

      this.props.updateUserCountries(countries);
    }

  }

  getHoveredCountry = (e) => {
    const countryId = e.target.getAttribute('id');
    const country = e.target.getAttribute('title');

    if (countryId) {
      this.setState({
        hoveredCountry: country,
      });
    } else {
      this.setState({
        hoveredCountry: '',
      });
    }
  }

  render() {
    const { isFetching } = this.props.user;

    return isFetching
      ?
      <div className="is-loading">
        <div className="loader">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
              <path fill="none" d="M24.3,30C11.4,30,5,43.3,5,50s6.4,20,19.3,20c19.3,0,32.1-40,51.4-40 C88.6,30,95,43.3,95,50s-6.4,20-19.3,20C56.4,70,43.6,30,24.3,30z" strokeWidth="5" strokeDasharray="153.95335693359377 102.63557128906248">
                <animate attributeName="stroke-dashoffset" calcMode="linear" values="0;256.58892822265625" keyTimes="0;1" dur="3" begin="0s" repeatCount="indefinite"></animate>
              </path>
            </svg>
            Loading
          </div>
        </div>
      :
        this._getViewContent();
  }

  _getViewContent = () => (
    <div className="home">
      {
        this.props.user.isLoggedIn
          ?
          this._loggedInContent()
          :
          this._loggedOutContent()
      }

    </div>
  );

  _loggedOutContent = () => {
    const videoSrc = this.state.video;
    const imgSrc = this.state.fallbackImg;

    return (
      <div className="home-wrapper">
        <div className="logged-out">
         <div className="video-container">
            <div className="filter"></div>
            <video autoPlay loop className="fillWidth" src={videoSrc}></video>
            <div className="poster hidden">
              <img src={imgSrc} />
            </div>
            <div className="poster-text">
              <h1>Keep track of the countries you have visited</h1>
              <p>Just login with Facebook to get started</p>
              <FacebookLogin
                  appappId="1639130619470630"
                  autoLoad={true}
                  fields="public_profile,email"
                  callback={this.checkAndSetLoginStatus}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  _loggedInContent = () => {
    let sublineText = 'Select the countries you have visited.';
    const { countries } = this.props.user;
    const numOfCountries = Object.keys(countriesList).length;
    const numVisitedCountries = countries.length;

    if (numVisitedCountries === 1) {
      sublineText = `You have visited 1 country out of ${numOfCountries} in this map.`
    } else if (numVisitedCountries > 1) {
      sublineText = `You have visited ${numVisitedCountries} countries out of ${numOfCountries} in this map.`
    }

    return (
      <div className="home-wrapper">
        <div className="page-header">
          <div className="page-wrapper">
            <h1>Welcome {this.props.user.userName}!</h1>
            <p>{sublineText}</p>
          </div>
        </div>
        <div
          className="map-wrapper"
          onClick={this.getClickedCountry}
          onMouseOver={this.getHoveredCountry}
        >
          <SearchBox />
          <ReactSVGPanZoom
            width={1010}
            height={660}
            toolbarPosition="right"
            miniaturePosition="none"
            className="world-map"
            background="#81d6ff"
          >
            {worldMap}
          </ReactSVGPanZoom>
          <h3>{this.state.hoveredCountry}</h3>
        </div>
        <div className="page-wrapper">
          {this._getListOfSelectedCountries()}
        </div>
      </div>
    );
  }

  _getListOfSelectedCountries = () => {
    const { countries, nonVisitedCountries } = this.props.user;
    countries.sort();

    return (
      <div className="places-wrapper">
        {
          countries.length
          ?
            <div>
              <h2>Places you have visited</h2>
              <ul className="countries-list">
                {
                  countries.map((key, i) => <li key={i} className="list-el">{countriesList[key]}</li>)
                }
              </ul>
            </div>
          :
              null
        }
        {
          nonVisitedCountries && Object.keys(nonVisitedCountries).length
          ?
            <div>
              <h2>Places left to be visited</h2>
              <ul className="countries-list">
                {
                  Object.keys(nonVisitedCountries).map((key, i) => <li key={i} className="list-el">{nonVisitedCountries[key]}</li>)
                }
              </ul>
            </div>
          :
            null
        }
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.users
  }
}

export default connect(mapStateToProps, {
  setActivePage,
  getUserData,
  updateUserCountries,
})(Home)