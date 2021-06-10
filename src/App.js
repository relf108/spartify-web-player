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
        this.setState({ URI })
      }
      else {
        //make queue request
        this.queueUpdates.push(URI)
      }
      console.log(this.state.URIs);
      //console.log(this.queueUpdates);

      //alert('Your track was added to the queue');
    }
    catch (err) {
      alert(err)
      alert('Invalid URL');
    }
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
  
  arrayRemove(arr, value) {

    return arr.filter(function (ele) {

      return ele != value;
    });
  }

  handleCallback = ({ ...playerState }) => {
    const self = this
    console.log(playerState);
    this.getQueue()
    ///Args when song completes
    if (playerState.isPlaying === false && playerState.isActive === true && playerState.isInitializing === false) {
      var currentTrack = playerState.track.uri
      var noToRemove = 0
      var queue = localStorage.getItem('queue').split(',')
      console.log(queue)
      queue.forEach((track) => {
        if (track === currentTrack) {
          queue = queue.splice(0, noToRemove)
        }
        else {
          noToRemove++
        }
      })
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
