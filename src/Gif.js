import React, { Component } from 'react';

class Gif extends Component {

    constructor(props) {
        super(props)
        this.state = {
            loaded: false
        }
    }



    render() {
        const { loaded } = this.state
        const { images } = this.props
        return (
            <video
                // strange 'if' syntax 
                className={`grid-item video ${loaded && 'loaded'}`}
                autoPlay
                loop
                src={images.original.mp4}
                onLoadedData={() => this.setState({ loaded: true })}
            />
        )
    }
}

export default Gif