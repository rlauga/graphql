function displayXpChart(xpData) {
  const chartContainer = document.getElementById("userXp");
  chartContainer.innerHTML = "";
  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");
  const barWidth = 45; // Width of each bar
  const spaceBetweenChar = 25; // Space between bars
  const maxAmount = Math.max(...xpData.map((item) => item.amount));
  const chartHeight = 250; // Fixed height for the chart area
  svg.setAttribute("width", xpData.length * (barWidth + spaceBetweenChar));
  svg.setAttribute("height", 400); // Adjust height to include space for project names
  xpData.forEach((item, index) => {
    const barHeight = (item.amount / maxAmount) * chartHeight * 0.6; // Scale bar height to chart height
    const xPos = index * (barWidth + spaceBetweenChar);
    const yPos = chartHeight - barHeight; // Position bars from the top down
    const bar = document.createElementNS(svgNS, "rect");
    bar.setAttribute("x", xPos);
    bar.setAttribute("y", yPos);
    bar.setAttribute("width", barWidth);
    bar.setAttribute("height", barHeight);
    bar.style.fill = changeColorBasedOnKb(item.amount);
    const grayBar = document.createElementNS(svgNS, "rect");
    grayBar.setAttribute("x", xPos);
    grayBar.setAttribute("y", 0);
    grayBar.setAttribute("width", barWidth);
    grayBar.setAttribute("height", yPos); // Full bar height
    grayBar.style.fill = "rgb(106 115 73 / 55%)";
    const showXpAmount = document.createElementNS(svgNS, "text");
    showXpAmount.setAttribute("x", xPos + barWidth / 2);
    showXpAmount.setAttribute("y", yPos - 5); // Position text above the bar
    showXpAmount.setAttribute("text-anchor", "middle");
    showXpAmount.style.fill = changeColorBasedOnKb(item.amount); //"#d5e91e";
    showXpAmount.textContent = `${item.amount} Kb`;
    const showProjectName = document.createElementNS(svgNS, "text");
    const nameX = xPos + barWidth / 2;
    const nameY = chartHeight; // Position text below the bars
    showProjectName.setAttribute("x", nameX + 10);
    showProjectName.setAttribute("y", chartHeight + 20); // Adjust the y-position as needed
    showProjectName.style.fill = changeColorBasedOnKb(item.amount);
    showProjectName.style.fontSize = "12px"; // Set font size
    showProjectName.textContent = item.name;
    showProjectName.setAttribute("class", "chart-text");
    showProjectName.setAttribute("transform", `rotate(45 ${nameX} ${nameY})`);
    svg.appendChild(bar);
    svg.appendChild(grayBar);
    svg.appendChild(showXpAmount);
    svg.appendChild(showProjectName);
    function changeColorBasedOnKb(xpAmount) {
      const startColor = [247, 205, 21]; // Light Yellow
      const endColor = [179, 216, 30]; // Dark green
      const ratio = Math.min(xpAmount / maxAmount, 1);
      const r = Math.round(
        startColor[0] + ratio * (endColor[0] - startColor[0])
      );
      const g = Math.round(
        startColor[1] + ratio * (endColor[1] - startColor[1])
      );
      const b = Math.round(
        startColor[2] + ratio * (endColor[2] - startColor[2])
      );
      return `rgb(${r},${g},${b})`;
    }
  });
  // Adding title to chart to the bottom right corner
  const chartTitle = document.createElementNS(svgNS, "text");
  chartTitle.setAttribute("x", svg.getAttribute("width") - 10);
  chartTitle.setAttribute("y", svg.getAttribute("height") - 10);
  chartTitle.setAttribute("text-anchor", "end");
  chartTitle.setAttribute("dominant-baseline", "baseline");
  chartTitle.style.fontSize = "20px";
  chartTitle.style.fill = "#d5e91e";
  chartTitle.textContent = "XP Gained by Projects";
  svg.appendChild(chartTitle);
  chartContainer.appendChild(svg);
}
