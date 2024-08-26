function createPieChart(data) {
  const svg = document.getElementById("pieChart");
  const width = svg.getAttribute("width");
  const height = svg.getAttribute("height");
  const radius = Math.min(width, height) / 2;
  const centerX = width / 2;
  const centerY = height / 2 + 80; // Lower the pie chart to make space for the legend above

  // Define colors and labels for legend
  const colorsArray = ["#d5e91e", "#a1b800", "#6e8900", "#415d00", "#273200"];

  // Calculate the total value to ensure slices sum to 100%
  const totalValue = data.reduce((sum, slice) => sum + slice.amount, 0);

  let cumulativeAngle = 0;

  data.forEach((slice, index) => {
    const sliceValue = slice.amount;
    const sliceAngle = (sliceValue / totalValue) * 2 * Math.PI;

    // Calculate slice's end position
    const x1 = centerX + radius * Math.cos(cumulativeAngle);
    const y1 = centerY + radius * Math.sin(cumulativeAngle);
    const x2 = centerX + radius * Math.cos(cumulativeAngle + sliceAngle);
    const y2 = centerY + radius * Math.sin(cumulativeAngle + sliceAngle);

    // Determine if the arc should be large or small
    const largeArcFlag = sliceAngle > Math.PI ? 1 : 0;

    // Create path element for the slice
    const pathData = `
      M ${centerX} ${centerY} 
      L ${x1} ${y1} 
      A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} 
      Z`;

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", pathData);
    path.setAttribute("fill", colorsArray[index % colorsArray.length]);

    // Append the slice to the SVG element
    svg.appendChild(path);

    // Calculate the position for the percentage label
    const midAngle = cumulativeAngle + sliceAngle / 2;
    const labelX = centerX + (radius / 2) * Math.cos(midAngle);
    const labelY = centerY + (radius / 2) * Math.sin(midAngle);
    const percentage = ((sliceValue / totalValue) * 100).toFixed(0) + "%";

    // Create text element for percentage
    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("x", labelX);
    text.setAttribute("y", labelY);
    text.setAttribute("text-anchor", "middle");
    text.setAttribute("dominant-baseline", "middle");
    text.setAttribute("fill", "#fff"); // White color for better visibility
    text.textContent = percentage;

    svg.appendChild(text);

    // Update cumulative angle for the next slice
    cumulativeAngle += sliceAngle;
  });

  // Add legend above the pie chart
  const legendX = centerX;
  let legendY = 0; // Start position for the legend at the top
  data.forEach((slice, index) => {
    const legendColorBox = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "rect"
    );
    legendColorBox.setAttribute("x", legendX - 40);
    legendColorBox.setAttribute("y", legendY + 5);
    legendColorBox.setAttribute("width", 20);
    legendColorBox.setAttribute("height", 20);
    legendColorBox.setAttribute(
      "fill",
      colorsArray[index % colorsArray.length]
    );

    const legendText = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "text"
    );
    legendText.setAttribute("x", legendX - 10);
    legendText.setAttribute("y", legendY + 20);
    legendText.setAttribute("fill", "#ffffff");
    legendText.textContent = slice.type;

    svg.appendChild(legendColorBox);
    svg.appendChild(legendText);

    legendY += 30; // Adjust vertical spacing between legend items
  });
}
