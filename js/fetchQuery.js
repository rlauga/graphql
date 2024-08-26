async function fetchQuery(query) {
  const url = "https://01.kood.tech/api/graphql-engine/v1/graphql";
  const token = localStorage.getItem("jwt");

  if (!token) {
    throw new Error("JWT token not found in localStorage");
  }

  const config = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  };

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error || `Error: ${response.status} ${response.statusText}`
      );
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Fetch query failed:", error);
    throw error; // Rethrow the error after logging it
  }
}
