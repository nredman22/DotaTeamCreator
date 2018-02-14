import React, { Component } from 'react';
import './playerlist.css';
import Player from '../player/player.js';



class PlayerList extends Component {

    constructor(props){
        super(props);
    }


    render() {
       return(
           <div className="playerlist">
               {
                   this.props.players.map(player => <Player player={player} changePlayer={this.props.changePlayer} key={player.id} />)
               }
           </div>
       );
     }
}

export default PlayerList;
