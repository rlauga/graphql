// Asynchronous functon to handle user login
async function login(usernameOrEmail, pw) {
  // String with user credentials
  const credentials = `${usernameOrEmail}:${pw}`;
  // Encode the credential to Base64
  const encodedCredentials = btoa(credentials);
  // Making a POST request to the login API with encoded credentials
  const response = await fetch("https://01.kood.tech/api/auth/signin", {
    method: "POST",
    headers: {
      Authorization: `Basic ${encodedCredentials}`,
      "Content-Type": "application/json",
    },
  });
  // Checking if the response is not OK
  if (!response.ok) {
    // Parse the response as JSON to get the error details
    const error = await response.json();
    // Throw an error with the message from the response
    throw new Error(error.error || "Unknown error occured authentication.js");
  }

  // Parsing the successful response as JSON
  const data = await response.json();
  // Log the responbse data for debugging purposes
  console.log(data);
  // Assuming the entire response is the JWT token
  const jwt = data;
  // Store the JWT token in localStorage
  localStorage.setItem("jwt", jwt);
  // Return the JWT token
  return jwt;
}

// Async function that if jwt exist then automaticly log in, if session haven't expired
async function ifSessionExistLogIn() {
  // Check if there is a jwt token stored in localstorage
  if (localStorage.getItem("jwt") || localStorage.getItem("hasura-jwt-token")) {
    // If a token is found, call the function to get user data
    getUserData();
  }
}

// Call the ifSessionExistLogin function immediately when localStorage have JWT Token already
// so user dont need to sign in every time page is reloaded
ifSessionExistLogIn();

// Add an event listener to the login form to handle form submission
document.getElementById("login").addEventListener("submit", function (e) {
  e.preventDefault(); // Prevent the default form submission behavior
  // Call the login function
  loginPage();
});
