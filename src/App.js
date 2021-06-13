import React, { Component } from 'react';
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
    this.handleSync = this.handleSync.bind(this);
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
      throw Error('Invalid URL')
    }
  }

  handleSync(event) {
    this.getQueue()
    this.setState({ URIs: localStorage.getItem('queue').split(',') })
    event.preventDefault();
  }

  getAccessToken() {
    fetch('http://localhost:8888/accessToken')
      .then(response => response.json())
      .then(response => {
        // Do something with response.
        localStorage.setItem('token', response.access_token);
        return response.access_token
      });
  }

  getQueue() {
    fetch('http://localhost:8888/queue')
      .then(response => response.json())
      .then(response => {
        // Do something with response.
        console.log(response.queue)
        localStorage.setItem('queue', response.queue);
        return response.queue
      });
  }

  popPlayed(currentTrack) {
    fetch('http://localhost:8888/popPlayed?currentTrack=' + currentTrack, {
      method: 'POST'
    })
  }

  handleCallback = ({ ...playerState }) => {
    const self = this
    console.log(playerState);
    var currentTrack = playerState.track.uri
    console.log(currentTrack)
    this.popPlayed(currentTrack)
    this.getQueue()
    ///Args when song completes
    if (playerState.isPlaying === false && playerState.isActive === true && playerState.isInitializing === false) {
      this.getQueue()
      var queue = localStorage.getItem('queue').split(',')
      self.state.URIs = queue
      console.log("Inside callback" + self.state.URIs)
      self.setState({})
    }
  }

  //Add tracks to queue via share url which converts to URI
  render() {

    return (
      <div className="App">
        <div>
          <a href='http://localhost:8888' > Login to Spotify </a>
        </div>
        <label>
          Loaded Tracks:
          <br></br>
          <br></br>
          {this.state.URIs}
        </label>
        <div>
          <label>Click "Sync" to start</label>
          <button onClick={this.handleSync}>
            Sync
          </button>
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
