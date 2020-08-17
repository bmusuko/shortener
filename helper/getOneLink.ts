interface RequestType {
  method: string;
  headers?: Headers | string[][] | Record<string, string>;
  body?: string;
}

async function getOneLink(token: string) {
  const API_URL = `${process.env.APP_URI}/api/short/?link=${token}`;
  const request: RequestType = {
    method: "GET",
    headers: { "Content-type": "application/json" },
  };
  try {
    return Promise.resolve((await fetch(API_URL, request)).json());
  } catch {
    Promise.reject({});
  }
}

export { getOneLink };
