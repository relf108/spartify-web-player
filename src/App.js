import React, { Component, useCallback } from 'react';
import './App.css';
import SpotifyPlayer from 'react-spotify-web-playback';



//   function queue() {
//   const [URIs, setURI] = useState([]);
//   setURI(URI => [URIs, URI]);

// }
class App extends Component {
  constructor() {
    super();
    this.first = true
    this.state = { value: '', URIs: [] };
    this.queueUpdates = []
    this.getAccessToken();
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  toURI(url) {
    //spotify:track:1OGDBmK8pztbZTgGKc69is
    //https://open.spotify.com/track/1OGDBmK8pztbZTgGKc69is?si=Kgz2reVSSmOcHsslc-7n0Q
    if (url.split('/')[3] !== undefined && url.split('/')[4] !== undefined) {
      url = url.split('?')[0];
      var linkType = url.split('/')[3];
      var code = url.split('/')[4];
      return 'spotify:' + linkType + ':' + code;
    }
    else {
      throw 'Invalid URL'
    }
  }
  handleChange(event) {
    this.setState({ value: event.target.value });
  }
  handleSubmit(event) {
    var URI = '';
    try {
      URI = this.toURI(this.state.value);
      if (this.first) {
        this.first = false
        this.state.URIs.push(URI)
      }
      else {
        this.queueUpdates.push(URI)
      }
      this.setState({ URI })
      console.log(this.state.URIs);
      console.log(this.queueUpdates);

      alert('Your track was added to the queue');
    }
    catch (err) {
      alert(err)
      alert('Invalid URL');
    }
    event.preventDefault();
  }

  getAccessToken() {
    fetch('http://172.28.194.250:8888/accessToken')
      .then(response => response.json())
      .then(response => {
        // Do something with response.
        localStorage.setItem('token', response.access_token);
        return response.access_token
      });
  }

  handleCallback = ({ ...playerState }) => {
    const self = this
    console.log(playerState);
    if (playerState.isPlaying === false || playerState.isActive === false) {
      var currentTrack = playerState.track.uri
      var noToRemove = 0
      self.state.URIs.forEach((track) => {
        console.log(track + ' : ' + currentTrack)
        if (track === currentTrack) {
          self.state.URIs = self.state.URIs.splice(0, noToRemove)
          self.state.URIs.concat(this.queueUpdates)
          console.log(self.state.URIs)
          return
        }
        else {
          noToRemove++;
          console.log(noToRemove)
        }
        self.state.URIs = self.state.URIs.splice(0, noToRemove)
        self.state.URIs.concat(this.queueUpdates)

      })
    }
  }

  //Add tracks to queue via share url which converts to URI
  render() {

    return (
      <div className="App">
        <div>
          <a href='http://172.28.194.250:8888' > Login to Spotify </a>
        </div>
        <div>
          {localStorage.getItem('token')}
        </div>
        <div>
          <form onSubmit={this.handleSubmit}>        <label>
            Track url:
          <input type="text" value={this.state.value} onChange={this.handleChange} />        </label>
            <input type="submit" value="Submit" />
          </form>
          <div>
            <SpotifyPlayer
              token={localStorage.getItem('token')}
              callback={this.handleCallback}
              uris={this.state.URIs}
              key={this.state.URIs}
              autoPlay={true}
            />
          </div >
        </div>
      </div>
    );
  }
}

export default App;
