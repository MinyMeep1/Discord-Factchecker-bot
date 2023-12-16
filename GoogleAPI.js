require('dotenv').config();

async function FactChecker(query) {

  const encodedQueryString = encodeURIComponent(query);

  const url = `https://factchecktools.googleapis.com/v1alpha1/claims:search?query=${encodedQueryString}&key=${process.env.FACT_CHECK_TOOLS_CREDS}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(' An error occured during transport. ${response.status}')
    }

    const data = await response.json();
    return data;
    
  } catch (error) {
    console.error('Error: ', error);
    return null;
  }
}

module.exports.FactChecker = FactChecker;


/**
 * .then(response => {
      if (response.ok) {
        return response.json(); // Convert the response body to JSON
        console.log("Did we get past here")
      } else {
        console.log(response);
        throw new Error('API request failed');
      }
    })
    .then(parsedObj => {
      let falseClaims = parsedObj.claims.filter(claim => claim.textualRating === "False");
      return falseClaims.length > 0 ? falseClaims : null;
    })
    .catch(error => {
      console.error('Error:', error);
    });
 */
