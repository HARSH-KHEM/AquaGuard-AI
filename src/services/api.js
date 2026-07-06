const API_BASE_URL = 'http://127.0.0.1:8080';

/**
 * Send a chat message to the Hydra AI Assistant backend.
 * @param {string} message - The user's message text.
 * @param {string|null} localityId - Optional locality ID for context.
 * @returns {Promise<{reply: string}>} The assistant's response.
 */
export async function sendChatMessage(message, localityId = null) {
  const body = { message };
  if (localityId) {
    body.locality_id = localityId;
  }

  const response = await fetch(`${API_BASE_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`Chat API error: ${response.status}`);
  }

  return response.json();
}

/**
 * Fetch all locality summaries from the backend.
 * Each locality includes: id, name, risk_score, risk_level,
 * primary_disease_risk, population, lat, lng.
 * @returns {Promise<Array>} List of locality summary objects.
 */
export async function getLocalities() {
  const response = await fetch(`${API_BASE_URL}/api/localities`);

  if (!response.ok) {
    throw new Error(`Localities API error: ${response.status}`);
  }

  return response.json();
}
