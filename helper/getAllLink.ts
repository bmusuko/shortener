interface RequestType {
  method: string;
  headers?: Headers | string[][] | Record<string, string>;
  body?: string;
}

async function getAllLink() {
  const API_URL = process.env.NEXT_PUBLIC_APP_URI + "/api/short/all";
  const request: RequestType = {
    method: "GET",
    headers: { "Content-type": "application/json" },
  };
  try {
    const response = await fetch(API_URL, request);
    return Promise.resolve(response.json());
  } catch {
    Promise.reject({});
  }
}

export { getAllLink };
