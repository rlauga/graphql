// Function to log out the user
function logOut() {
    // Display the login page
    document.querySelector(".loginPage").style.display = "flex";
    // Hide the main page
    document.querySelector(".mainPage").style.display = "none";
    // Clear any error message displayed on the page
    document.querySelector(".errorMsg").textContent = "";
    // Remove JWT token from local storage to log the user out
    localStorage.removeItem("jwt");
  }
  