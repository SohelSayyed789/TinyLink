const API_URL = "https://tinylink-urct.onrender.com";

export async function getLinks() {
  return fetch(`${API_URL}/api/links`).then(res => res.json());
}

export async function createLink(data) {
  return fetch(`${API_URL}/api/links`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function deleteLink(code) {
  return fetch(`${API_URL}/api/links/${code}`, {
    method: "DELETE",
  });
}

export async function getStats(code) {
  return fetch(`${API_URL}/api/links/${code}`).then(res => res.json());
}
