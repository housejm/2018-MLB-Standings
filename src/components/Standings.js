import React, {Component} from 'react';
import {getStandingsData} from '../api/api';
import '../../node_modules/bootstrap/dist/css/bootstrap.css';
import './standings.css';

/** TeamDetail component. 
**  This builds the table row for each team's statistics to be displayed.
**  Used in the printDivisionStandings function
*/
const TeamDetail = props => (
    <tr>
        <td>{props.standing}</td>
        <td>{props.team}</td>
        <td>{props.wins}</td>
        <td>{props.losses}</td>
        <td>{props.ratio.toPrecision(3)}</td>
    </tr>
)

/** Standings Component Class        
**
**  The component for retrieving team standings as JSON and displaying
**  the data in a more readable format. 
*/
class Standings extends Component{
    
    constructor(props) {
        super(props);

        // Initializing the state into two objects, one for each league.
        // Each league object contains 3 arrays, one for each division.
        // I formatted the data this way to help make it more human readable
        // as well as being able to handle each data set independently if needed.
        this.state = {
            americanLeague: {
                east: [],
                west: [],
                central: []
            },
            nationalLeague: {
                east: [],
                west: [],
                central: []
            }
        }
    }

    /** Retrieve and organize data from an API endpoint         
    **
    ** The function runs when the Standings component is mounted.
    ** It calls the getStandingsData function from api.js with the API URL.
    ** If valid data is received the JSON object is sent to be sorted.
    */
    async componentDidMount(){
        const apiUrl = 'https://api.mobileqa.mlbinfra.com/api/interview/v1/records';
        try{
            // Retrieve the JSON data from the API
            const standingsData = await getStandingsData(apiUrl);

            // Check that the standingsData is defined
            // The object can be undefined if there was an error retrieving from the API
            if(standingsData)
            {
                // Pass the json data object to be organized by league, division and rank
                this.organizeStandingsData(standingsData);
            }
            else
            {
                throw new Error('There was an error with the data retrieved from the API at' + apiUrl + '. Please check settings.');
            }
        }
        catch(error)
        {
            console.log(error);
        }
    }

    /** Compare ratio of two teams to allow for sorting       
    **
    ** @param   [Object] a  Team a 
    ** @param   [Object] b  Team b
    ** @returns [Number]    If < 0, b moves up in order. 
    **                      If > 0, a moves up in order. 
    **                      If == 0, no change in order.    
    ** 
    ** This particular compare method is used to compare the win/loss ratio of each team in an array. 
    ** The array is left in order of first to last place. 
    ** For example, alWest[0] = first place team and alWest[4] = last place team.
    ** 
    ** The Array.sort() function has this method passed to it. 
    */
    compareRatios(a,b)
    {
        return b.ratio - a.ratio;
    }

    /** Organize standings data into League, Division and in order by Win/Loss ratio
    **
    ** @param   [Object] standings          JSON object of team standings stats
    **
    ** The function takes in the JSON object of standings data. It then iterates
    ** through the data, sorting each team into arrays based on division.
    ** The division arrays are then sorted based on the win/loss ratio of each team. 
    ** The division arrays are then stored in the application state objects for
    ** each league.
    */
    organizeStandingsData(standings){
        
        // Arrays for each division
        const alEast = [];
        const alCentral = [];
        const alWest = [];
        const nlEast = [];
        const nlCentral = [];
        const nlWest = [];

        // Loop through the standings data and organize each team into their respective League and Division
        standings.forEach(
            function(team)
            {
                // The win/loss ratio is calculated and stored in each team object
                team.ratio = team.wins / team.losses;

                // This logic assumes there is only AL and NL options for the league property
                if(team.league === 'AL')
                {   
                    switch(team.division)
                    {
                        case 'East':
                            alEast.push(team);
                            break;
                        case 'Central':
                            alCentral.push(team);
                            break;
                        case 'West':
                            alWest.push(team);
                            break;
                        default:
                            // Again the logic here assumes only the 3 valid options above
                            // We could throw an error here about invalid data.
                            break;
                    }
                }
                // If not AL then check if NL
                else if(team.league === 'NL') {
                    switch(team.division)
                    {
                        case 'East':
                            nlEast.push(team);
                            break;
                        case 'Central':
                            nlCentral.push(team);
                            break;
                        case 'West':
                            nlWest.push(team);
                            break;
                        default:
                            // Again the logic here assumes only the 3 valid options above
                            // We could throw an error here about invalid data.
                            break;
                    }
                }
            }
        );

        // sort each array in order of win/loss ratio
        alEast.sort(this.compareRatios);
        alCentral.sort(this.compareRatios);
        alWest.sort(this.compareRatios);
        nlEast.sort(this.compareRatios);
        nlCentral.sort(this.compareRatios);
        nlWest.sort(this.compareRatios);

        // store each division in its respective league in the application state
        this.setState({
            americanLeague: {east: alEast, west: alWest, central: alCentral},
            nationalLeague: {east: nlEast, west: nlWest, central: nlCentral}
        });
        
    }

    /** Iterates through the teams and returns an array of TeamDetail components
    **
    ** @param   [Array] division   Array of team JSON objects
    ** @returns [Array]            Array of TeamDetail components containing a table row of teams stats
    **
    */
    printDivisionStandings(division){

        // Extract the values in the  division. This returns an array of teams.
        const teams = Object.values(division);

        // Map returns an array of TeamDetail components to display each team's stats
        return teams.map((team,i) => {
            return <TeamDetail standing={i+1} team={team.team} wins={team.wins} losses={team.losses} ratio={team.ratio} key={team.team} />

        });

    }

    // Render the markup to be displayed on the page
    render() {
        return (
            <div className='container'>
                <div className='table-responsive'>
                    <div className='jumbotron text-center'>
                        <h2>2018 MLB Standings</h2>
                    </div>

                    <table className='table table-striped'>
                        <thead className='mlb-red'>
                            <tr className='text-center'>
                                <th colSpan='5' scope='col' className='mlb-red'>American League</th>
                            </tr>
                            
                        </thead>
                        <tbody>
                            <tr>
                                <th scope='col'></th>
                                <th scope='col'>Team</th>
                                <th scope='col'>Wins</th>
                                <th scope='col'>Losses</th>
                                <th scope='col'>W/L Ratio</th>
                            </tr>
                            <tr className='mlb-blue'>
                                <td colSpan='5'>AL East</td>
                            </tr>
                           
                            {/* Call printDivisionStandings to retrieve the array of TeamDetail component rows */}
                            { this.printDivisionStandings(this.state.americanLeague.east) }
                            <tr className='mlb-blue'>
                                <td colSpan='5'>AL Central</td>
                            </tr>
                           
                            { this.printDivisionStandings(this.state.americanLeague.central) }
                            <tr className='mlb-blue'>
                                <td colSpan='5'>AL West</td>
                            </tr>
                            
                            { this.printDivisionStandings(this.state.americanLeague.west) }
                        </tbody>
                    </table>

                    <table className='table table-striped'>
                        <thead className='mlb-red'>
                            <tr className='text-center'>
                                <th colSpan='5' scope='col'>National League</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <th scope='col'></th>
                                <th scope='col'>Team</th>
                                <th scope='col'>Wins</th>
                                <th scope='col'>Losses</th>
                                <th scope='col'>W/L Ratio</th>
                            </tr>
                            <tr className='mlb-blue'>
                                <td colSpan='5'>NL East</td>
                            </tr>
                            { this.printDivisionStandings(this.state.nationalLeague.east) }
                            <tr className='mlb-blue'>
                                <td colSpan='5'>NL Central</td>
                            </tr>
                            { this.printDivisionStandings(this.state.nationalLeague.central) }
                            <tr className='mlb-blue'>
                                <td colSpan='5'>NL West</td>
                            </tr>
                            { this.printDivisionStandings(this.state.nationalLeague.west) }
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

}

export default Standings