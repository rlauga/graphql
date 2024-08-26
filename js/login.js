// Function to handle the login process
function loginPage() {
  // Get the username/email and password from input fields
  const user = document.querySelector(".usernameOrEmail").value;
  const pw = document.querySelector(".password").value;

  // Call the login function asynchronously
  login(user, pw)
    .then(() => {
      // If login is successful:
      // Fetch user data
      getUserData();
      // Clear input fields after successful login
      document.querySelector(".usernameOrEmail").value = "";
      document.querySelector(".password").value = "";
    })
    .catch((error) => {
      // If login fails:
      // Log the error to the console for debugging
      console.log(error);
      // Display the error message on the page for the user
      document.querySelector(".errorMsg").textContent = error.message;
    });
}

// Function to display the main page and hide the login page
function displayMainPage() {
  // Hide the login page
  document.querySelector(".loginPage").style.display = "none";
  // Display the main page
  document.querySelector(".mainPage").style.display = "block";
}
