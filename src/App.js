import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import SelectedList from './components/selected/selected.js';
import PlayerList from './components/playerlist/playerlist.js';
import TeamList from './components/teamlist/teamlist.js';

// Used to find the different combinations needed for teams
import CMD from 'js-combinatorics';




class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            players: [],
            selectedPlayers: [],
            team1: [],
            team2: [],
            difference: 0
        }
        this.removeFromSelected = this.removeFromSelected.bind(this);
        this.addToSelected = this.addToSelected.bind(this);
        this.assignTeams = this.assignTeams.bind(this);
        this.switchTeams = this.switchTeams.bind(this);
        this.savePlayers = this.savePlayers.bind(this);
        this.savePlayers();
    }

    addToSelected(player) {
        console.log(player);
        let players = this.state.players;
        let selectedPlayers = this.state.selectedPlayers;
        for (let p of selectedPlayers){
            if (player === p)
                return;
        }
        let index = players.indexOf(player);
        players.splice(index, 1);
        selectedPlayers.push(player);
        this.setState({
            selectedPlayers: selectedPlayers,

        });
    }

    removeFromSelected(player){
        let selectedPlayers = this.state.selectedPlayers;
        let index = selectedPlayers.indexOf(player);
        if (index === -1)
            return;
        selectedPlayers.splice(index, 1);
        let players = this.state.players;
        players.push(player);

        this.setState({
            players: players,
            selectedPlayers: selectedPlayers
        });

    }

    switchTeams(player) {
        let team1 = this.state.team1;
        let team2 = this.state.team2;
        let index = team1.indexOf(player);
        if (index !== -1){
            team1.splice(index, 1);
            team2.push(player);
        }
        else {
            index = team2.indexOf(player);
            team2.splice(index, 1);
            team1.push(player);
        }
        let difference = this.findDifference(team1, team2);
        this.setState(
        {
            team1: team1,
            team2: team2,
            difference: difference
        });

    }

    findDifference(team1, team2) {
        let average1, average2;
        let sum = 0;
        for(let t1 of team1){
            sum += t1.partyMMR;
        }
        average1 = sum / team1.length;
        sum = 0;
        for(let t2 of team2){
            sum += t2.partyMMR;
        }
        average2 = sum / team2.length;
        return Math.abs(average1 - average2);
    }

    assignTeams(){
        let difference, team1, team2, bestTeam1, bestTeam2;
        let bestDifference = 10000;
        let players = this.state.selectedPlayers;
        if (players.length < 1)
            return;
        let size = Math.floor(players.length / 2);
        let combinations = CMD.combination(players, size);

        // Iterate through the team combinations
        while(team1 = combinations.next()){
            team2 = players.filter(player => !team1.includes(player));

            difference = this.findDifference(team1, team2);

            // Keep the teams with the closest average mmr's
            if (difference < bestDifference){
                bestTeam1 = team1;
                bestTeam2 = team2;
                bestDifference = difference;
            }
            console.log(team1, team2, difference );
        }
        this.setState(
        {
            team1: bestTeam1,
            team2: bestTeam2,
            difference: bestDifference
        });
    }

    getPlayers(){
        return fetch('https://spreadsheets.google.com/feeds/list/1gVVBIlffmjGiBX6iObLMTtYjzxN0FUPg6KNHvX1qS_g/od6/public/values?alt=json').then(
            response => { return response.json() }
        ).then(jsonResponse => {
            return jsonResponse.feed.entry.map(entry => ({
                id: parseInt(entry.gsx$id.$t),
                name: entry.gsx$name.$t,
                partyMMR: parseInt(entry.gsx$partymmr.$t)
            }));
        });
    }

    savePlayers() {
        this.getPlayers().then( players => {
            this.setState( { players: players });
        });
    }



  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Dota 2 Team Creator</h1>
        </header>
        <div className="container">
        <div className="row ">
            <div className="col-lg-4">
                <h4>Players</h4>
                <PlayerList players={this.state.players} changePlayer={this.addToSelected} />
            </div>
            <div className="col-lg-4">
                <h4>Selected</h4>
                <SelectedList players={this.state.selectedPlayers} changePlayer={this.removeFromSelected} />
            </div>
        </div>
        <div className="row" id="teams">
            <div className="col-lg-4">
                <h4>Team 1</h4>
                <TeamList players={this.state.team1} changePlayer={this.switchTeams} />
            </div>
            <div className="col-lg-4">
                <h4>Team 2</h4>
                <TeamList players={this.state.team2} changePlayer={this.switchTeams }/>
            </div>
        </div>
        <p>Difference: {Math.round(this.state.difference)}</p>
        <button className="btn btn-success" onClick={this.assignTeams}>Balance Teams</button>
      </div>
      </div>
    );
  }
}

export default App;
