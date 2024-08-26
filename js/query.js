function getUserData() {
  displayMainPage();

  let functions = [displayProfile, displayXps, displayLevel, displayTopSkills]; //displayXps, displayGrades, displayAudit
  functions.forEach((func) => {
    func().catch((err) => {
      console.error(`function ${func.name}: ${err.message}`);
    });
  });
}

// ----------------------------------
async function displayProfile() {
  let userObject = `{
    user{
    login
    attrs
    id
    auditRatio
    totalUp
    totalDown
    }
}`;

  const qry = await fetchQuery(userObject);
  const userData = qry.data.user[0];
  const attrs = userData.attrs;
  const login = userData.login;

  const {
    email,
    tel,
    lastName,
    firstName,
    personalIdentificationCode,
    addressStreet,
    addressCity,
    addressCountry,
  } = attrs;

  document.getElementById(
    "navBarWelcomeName"
  ).innerHTML = `Welcome ${firstName} ${lastName}!`;

  document.getElementById(
    "userData"
  ).innerHTML = `<div class="boxData">${login}</div>
  <div class="boxData">${personalIdentificationCode}</div>
  <div class="boxData">${email}</div>
  <div class="boxData">${tel}</div>
  <div class="boxData">${addressStreet}, ${addressCity}, ${addressCountry}</div>`;

  const auditRatio = userData.auditRatio.toFixed(1);
  const totalUp = (userData.totalUp / 1000000).toFixed(2);
  const totalDown = (userData.totalDown / 1000000).toFixed(2);
  // Calculate totalUp and totalDown percentage relative to the sum of both
  const totalBar = userData.totalUp + userData.totalDown;
  const totalUpPercentage = (userData.totalUp / totalBar) * 100;
  const totalDownPercentage = 100 - totalUpPercentage;

  document.getElementById("auditRatio").innerHTML = `
  <div class="auditDiv">
    <div class="auditTitle">Audit Ratio</div>
    <div class="auditRatio">${auditRatio}</div>
  </div>
    <div class="barContainer">
      <div class="bar barUp" style="width: ${totalUpPercentage}%;">${totalUpPercentage.toFixed(
    2
  )}%</div>
      <div class="bar barDown" style="width: ${totalDownPercentage}%;">${totalDownPercentage.toFixed(
    2
  )}%</div>
    </div>
    <div class="auditLastRow">
      <div class="auditData upCls">↑Done ${totalUp} MB</div>
      <div class="auditData downCls">↓Received ${totalDown} MB</div>
    </div>`;
}

// ------------------END-------------------

// ----------------------------------

async function displayXps() {
  // querying data from the transaction table
  // Filter transactions where the type field is equal to "xp" & filter transaction where object has type "project"
  // _eq = equal to | _neq = not equal to | _lt = less than | _gt = greater than | _in = in array .etc
  let xpsData = `{
    transaction(where: {type: {_eq:"xp"}, object: {type: {_eq:"project"}}}) {
    amount
    object {
      name
    }
    }
}`;

  const data = await fetchQuery(xpsData);
  // Lets store Xps with each project name into an array
  // userXps -> data -> transaction -> amount + object.name
  // Processing data
  const xpData = data.data.transaction.map((item) => ({
    name: item.object.name,
    amount: (item.amount / 1000).toFixed(0), // Convert amount to kilobytes
  }));
  // Sort object names based on amount of xp gained -> largest to smallest
  xpData.sort((a, b) => b.amount - a.amount);
  // Display in chart
  displayXpChart(xpData);
  // console for errors
  //console.log("XP DATA:", xpData);
  //console.log("Total XP Amount:", totalXpGained);
}

async function displayLevel() {
  // Fetch user ID to get level
  const userIdQuery = `
    {
      user {
        id
      }
    }
  `;

  try {
    const userIdResponse = await fetchQuery(userIdQuery);
    const users = userIdResponse.data.user;

    if (users.length === 0) {
      //console.error("No users found");
      return;
    }
    const userId = users[0].id;

    // Fetch user level transaction using the userId
    const userLevelQuery = `
      {
        transaction(
          where: {
            userId: {_eq: ${userId}}, 
            type: {_eq: "level"}, 
            object: {type: {_regex: "project"}}
          },
          order_by: {amount: desc},
          limit: 1
        ) {
          amount
        }
      }
    `;

    const userLevelResponse = await fetchQuery(userLevelQuery);
    const userLevelTransaction = userLevelResponse.data.transaction;

    if (userLevelTransaction.length === 0) {
      console.error("No level transactions found for user");
      return;
    }

    const userLevel = userLevelTransaction[0].amount;
    //console.log(`User Level: ${userLevel}`);

    // Fetch and process XP data
    const xpsData = `
      {
        transaction(where: {type: {_eq:"xp"}, object: {type: {_eq:"project"}}}) {
          amount
          object {
            name
          }
        }
      }
    `;

    const data = await fetchQuery(xpsData);
    // Process XP data
    const xpData = data.data.transaction.map((item) => ({
      name: item.object.name,
      amount: (item.amount / 1000).toFixed(0), // Convert amount to kilobytes
    }));

    // Calculate total XP gained
    let totalXpGained = 0;
    xpData.forEach((item) => {
      const xpAmount = Number(item.amount);
      if (xpAmount >= 1000) {
        // Convert to MB if amount is over 1000 Kb
        totalXpGained += xpAmount / 1000;
      } else {
        totalXpGained += xpAmount;
      }
    });

    // Sort object names based on amount of XP gained -> largest to smallest
    xpData.sort((a, b) => b.amount - a.amount);

    // Display Total Kilobyte and Student level on xpAndLevel
    const xpAndLevelDiv = document.getElementById("xpAndLevel");
    if (xpAndLevelDiv) {
      if (totalXpGained >= 1000) {
        totalXpGained = `${totalXpGained.toFixed(1) / 1000} MB`;
      } else {
        totalXpGained = `${totalXpGained} Kb`;
      }

      xpAndLevelDiv.innerHTML = `

     <div class="boxDataCenter">
            <div class="label">Total XP</div>
            <div class="value">${totalXpGained}</div>
        </div>
             <div class="boxDataCenter">
            <div class="label">Rank</div>
            <div class="value">${getRank(userLevel)} Developer</div>
        </div>
        <div class="boxDataCenter">
            <div class="label">Level</div>
            <div class="value">${userLevel}</div>
        </div>

`;
    } else {
      console.error("Div with xpAndLevel not found!");
    }
    /*document.getElementById(
      "xpAndLevel"
    ).innerHTML = `<div class="boxData">Total Xp: ${totalXpGained}</div>
    <div class="boxData">Level: ${userLevel}</div>`;
*/
    // Log for debugging
    //console.log("Kilobytes:", xpData);
    //console.log("Total XP Gained:", totalXpGained);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

async function displayTopSkills() {
  let topSkillsQuery = `
    {  
        transaction(
            where: {type: {_ilike: "%skill%"}},
            order_by: {amount: desc}
        ) {
            type
            amount
        }
    }`;

  const data = await fetchQuery(topSkillsQuery);
  const cleanData = cleanTopSkillDublicates(data);
  // After removing cleanData from qraphql data we received, now we can make chart and display our top skills in there by looping each skill
  createPieChart(transformSkillTypes(cleanData));
}
