import React, { Component } from 'react';
// loader image
import loader from './images/loader.svg'
import Gif from './Gif'
import clearButton from './images/close-icon.svg'

const randomChoice = arr => {
  const randIndex = Math.floor(Math.random() * arr.length)
  return arr[randIndex]
}


const Header = ({ clearSearch, hasResults }) => (
  <div className="header grid">
    {hasResults ? (
      <button onClick={clearSearch}>
        <img src={clearButton} />
      </button>
    ) : (
        <h1 className="title">Jiffy</h1>
      )}
  </div>
)

const Userhint = ({ loading, hintText }) => (
  <div className="user-hint" > {loading ?
    <img className="block mx-auto" src={loader} alt="spinning loader" /> :
    hintText}
  </div>
)

const myApiKey = '73XO5BTttJWaB4wKnqhDiayu0x4GPOeJ'

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      searchTerm: '',
      gifs: []
    }
  }

  // modern promise chain syntax uses keyword 'await'
  searchGiphy = async searchTerm => {

    this.setState({
      loading: true
    })

    try {

      const response = await fetch(
        `https://api.giphy.com/v1/gifs/search?api_key=${myApiKey}&q=${searchTerm}&limit=25&offset=0&rating=PG&lang=en`
      )
      // "{data}" is similar to writing data.data (to access what's returned in json)
      const { data } = await response.json()

      if (!data.length) {
        throw `Nothing found for ${searchTerm}`
      }

      const randomGif = randomChoice(data)

      this.setState((prevState, props) => ({
        ...prevState,
        gifs: [...prevState.gifs, randomGif],
        loading: false,
        hintText: `Hit enter to see more ${searchTerm}`
      }))

    } catch (error) {
      this.setState((prevState, props) => ({
        ...prevState,
        hintText: error,
        loading: false
      }))
      console.log(error)
    }
  }

  // with create react app we can write our methods as arrow functions,
  // meaning we dont need the constructor and bind
  handleChange = event => {
    // same as const value = event.target.value
    const { value } = event.target
    this.setState((prevState, props) => ({
      ...prevState,
      searchTerm: value,
      hintText: value.length > 2 ? `Hit enter to search ${value}` : ''

    }))
  }

  handleKeyPress = event => {
    const { value } = event.target
    if (value.length > 2 && event.key === 'Enter') {
      this.searchGiphy(value)
    }
  }

  clearSearch = () => {
    this.setState((prevState, props) => ({
      ...prevState,
      searchTerm: '',
      hintText: '',
      gifs: []
    }))
    this.textInput.focus()
  }

  render() {
    const { searchTerm, gifs } = this.state
    const hasResults = gifs.length

    return (
      <div className="page">
        <Header clearSearch={this.clearSearch} hasResults={hasResults} />
        <div className="search grid" >

          {this.state.gifs.map(gif => (
            <Gif {...gif} />
          ))}

          <input
            className="input grid-item"
            placeholder="Type something"
            onChange={this.handleChange}
            onKeyPress={this.handleKeyPress}
            value={searchTerm}
            // essentially binding a reference name (similar to an id) to the input in order to select it elsewhere (such as in our 'clearSearch' function)
            ref={input => {
              this.textInput = input;
            }}
          />
        </div>
        <Userhint {... this.state} />
      </div>
    );
  }
}

export default App;
