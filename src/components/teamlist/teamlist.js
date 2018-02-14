import React, { Component } from 'react';
import './teamlist.css';
import Player from '../player/player.js';



class TeamList extends Component {

    constructor(props){
        super(props);
        this.calculateAverage = this.calculateAverage.bind(this);
    }

    calculateAverage() {
        let sum = 0;
        this.props.players.map(player => sum = sum + player.partyMMR);
        let averageMMR = sum / this.props.players.length;
        if (isNaN(averageMMR)){
            return 0;
        }
        return Math.round(averageMMR);
    }


    render() {
       return(
           <div className="aa">
               {
                   this.props.players.map(player => <Player player={player} changePlayer={this.props.changePlayer} key={player.id} />)
               }
               <p>Average MMR: {this.calculateAverage()} </p>
           </div>
       );
     }
}

export default TeamList;
