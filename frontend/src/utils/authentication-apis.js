export const signupApi = async (name, email, password) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, email, password }),
  });

  if (!response.ok) {
    throw new Error("Failed to sign up");
  }

  return response.json();
};

export const loginApi = async (email, password) => {
  const formData = new FormData();
  formData.append("username", email);
  formData.append("password", password);

  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/login`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to log in");
  }

  const data = await response.json();
  document.cookie = `client_auth_token=${data.access_token}; path=/; SameSite=Strict`;

  return data;
};

export const currentUserApi = async (accessToken) => {
  if (!accessToken) {
    throw new Error("No access token found");
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/current`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch current user");
  }

  return response.json();
};
