import React, { Component } from 'react';
import './App.css';
import SpotifyPlayer from 'react-spotify-web-playback';
class App extends Component {
  constructor() {
    super()
    this.getAccessToken()
  }
  getAccessToken() {
    fetch('http://localhost:8888/accessToken')
      .then(response => response.json())
      .then(response => {
        // Do something with response.
        console.log(response.access_token)
        localStorage.setItem('token', response.access_token);
        return response.access_token
      });
  }
  //Add tracks to queue via share url which converts to URI
  render() {
    return (
      <div className="App">
        <div>
          <a href='http://localhost:8888' > Login to Spotify </a>
        </div>
        <div>
          {localStorage.getItem('token')}
        </div>
        <div>
          <SpotifyPlayer
            token={localStorage.getItem('token')}
            uris={['spotify:artist:6HQYnRM4OzToCYPpVBInuU']} 
            />
        </div>
      </div>

    );
  }
}

export default App;
