import { ShortenerForm } from "../models/Form";

interface RequestType {
  method: string;
  headers?: Headers | string[][] | Record<string, string>;
  body?: string;
}

async function createShortener(data: ShortenerForm) {
  let body = {
    real_link: data.URL,
  };
  if (data.custom) {
    body["desired_link"] = data.custom;
  }
  const API_URL = process.env.NEXT_PUBLIC_APP_URI + "/api/short/create";
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

export { createShortener };
