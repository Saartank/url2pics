export const queryUrl = async (url, token) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/query`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ url }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  return await response.json();
};

export const deleteQuery = async (id, token) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/query/${id}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  if (response.status !== 204) {
    return await response.json();
  } else {
    return null;
  }
};

export const getAllQueries = async (token) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/query/all`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  return await response.json();
};

export const getQuery = async (id, token) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/query/${id}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  return await response.json();
};
