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
    this.state = { value: '', URIs: [] };
    this.getAccessToken();
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  toURI(url) {
    //spotify:track:1OGDBmK8pztbZTgGKc69is
    //https://open.spotify.com/track/1OGDBmK8pztbZTgGKc69is?si=Kgz2reVSSmOcHsslc-7n0Q
    if (url.split('/')[3] !== undefined && url.split('/')[4] !== undefined) {
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
      // this.trackQueue.push(URI);
      // // this.setState({ queue: this.trackQueue })
      // var prevState = this.state.URIs
      // var newState = prevState.push(URI)
      this.state.URIs.push(URI)
      this.setState({ URI })
      console.log(this.state.URIs);
      alert('Your track was added to the queue');
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

  player() {
    this.setState()
    return <SpotifyPlayer
      token={localStorage.getItem('token')}
      uris={this.state.URIs} />

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
            {this.player()}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
