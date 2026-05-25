const normalizeBaseUrl = (value) => value.replace(/\/+$/, '');

const getApiBaseUrl = () => {
  const envBaseUrl = import.meta.env.VITE_API_URL;

  if (envBaseUrl) {
    return normalizeBaseUrl(envBaseUrl);
  }

  if (import.meta.env.DEV) {
    return 'http://localhost:5000';
  }

  return '';
};

export const buildApiUrl = (path) => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${getApiBaseUrl()}${normalizedPath}`;
};

export const apiRequest = async (path, options = {}) => {
  let response;

  try {
    response = await fetch(buildApiUrl(path), options);
  } catch (error) {
    throw new Error('Unable to reach the server. Make sure the backend is running on port 5000 and try again.', {
      cause: error,
    });
  }

  const contentType = response.headers.get('content-type') || '';
  const payload = contentType.includes('application/json')
    ? await response.json()
    : { message: await response.text() };

  if (!response.ok) {
    throw new Error(payload.message || `Request failed with status ${response.status}`);
  }

  return payload;
};
