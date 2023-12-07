require('dotenv').config();

function FactChecker(query) {

  // Encode the query string to ensure it's safe to include in a URL
  const encodedQueryString = encodeURIComponent(query);

  // Construct the URL with the query parameter
  const url = `https://factchecktools.googleapis.com/v1alpha1/claims:search?query=${encodedQueryString}&key=${process.env.FACT_CHECK_TOOLS_CREDS}`;


  fetch(url) 
  .then(response => { 
    if (response.ok) { 
      return response.json(); // Parse the response data as JSON 
    } else { 
        console.log(response)
      throw new Error('API request failed'); 
    } 
  }) 
  .then(data => { 
    // Process the response data here 
    console.log(data); // Example: Logging the data to the console 
  }) 
  .catch(error => { 
    // Handle any errors here 
    console.error(error); // Example: Logging the error to the console 
  });
}

module.exports.FactChecker = FactChecker;