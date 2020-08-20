import { PasswordForm } from "../models/Form";

interface RequestType {
  method: string;
  headers?: Headers | string[][] | Record<string, string>;
  body?: string;
}

async function getProtectedLink(data: PasswordForm) {
  let body = {
    desired_link: data.token,
    password: data.password,
  };
  const API_URL = process.env.NEXT_PUBLIC_APP_URI + "/api/short/protected";
  const request: RequestType = {
    method: "POST",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify(body),
  };
  try {
    const response = await fetch(API_URL, request);
    return Promise.resolve(response.json());
  } catch {
    Promise.reject({});
  }
}

export { getProtectedLink };
