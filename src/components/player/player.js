import React, { Component } from 'react';
import './player.css';



class Player extends Component {
    constructor(props) {
        super(props);
        this.movePlayer = this.movePlayer.bind(this);
    }

    movePlayer(event){
        this.props.changePlayer(this.props.player);
        event.preventDefault();
    }

  render() {
    return (
        <button className="btn btn-primary" onClick={this.movePlayer}>
        <div className="row">
            <div className="col">
                <p className="name">{this.props.player.name}</p>
            </div>
            <div className="col">
                <p className="mmr">{this.props.player.partyMMR}</p>
            </div>
            </div>
            </button>
    );
  }
}

export default Player;
