
/** Retrieve JSON data from an API endpoint
**
** @param   [String] url                The url of the API endpoint
** @returns [Object] standingsDataJson  The JSON object returned from the API
**
** The function takes one parameter, the url of the API endpoint. It then calls
** the fetch() method, passing on the url. The response is evaluated for valid 
** status code and throws an error if an invalid response is found. Otherwise it 
** calls the json() method to retrieve the JSON content from the response. 
** 
*/
async function getStandingsData(url)
{
    try {
        // fetch the response data from the api url
        const standingsData = await fetch(url);

        // If the HTTP response is not OK (200), throw an error detailing the problem
        if(!standingsData.ok)
        {
            throw new Error('There was an error retrieving data from the API at ' + url + '. Response code: ' + standingsData.status + ' ' + standingsData.statusText); 
        }
        else{
             // extract the JSON data from the response
            const standingsDataJson = await standingsData.json();
            return standingsDataJson;
        }
    }
    catch(error)
    {
        // Log the error message to the console
        console.log(error);
    }
    
}

export {getStandingsData}
