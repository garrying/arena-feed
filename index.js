/**
 * Fetches data from Are.na feed API
 * @param {string} bearerToken - The Bearer token for authentication
 * @param {number} [offset=0] - The offset parameter for pagination
 * @returns {Promise<Object>} - The API response data
 */
const getArenaFeed = async (bearerToken, offset = 0) => {
  if (!bearerToken) {
    throw new Error("Bearer token is required");
  }

  const url = new URL("https://api.are.na/v2/feed");
  url.searchParams.set("offset", offset);

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${bearerToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(`Failed to fetch Are.na feed: ${error.message}`);
  }
};

export default getArenaFeed;
