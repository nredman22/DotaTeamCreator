import React, { Component } from 'react';
import './selected.css';
import Player from '../player/player.js';



class SelectedList extends Component {

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

export default SelectedList;
