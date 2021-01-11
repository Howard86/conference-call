interface GenericResponse {
  success: boolean;
}

export const getLocal = async <R = GenericResponse>(
  endpoint: string,
): Promise<R> => {
  const response = await fetch(`/api/${endpoint}`);
  return response.json();
};

export const postLocal = async <R = GenericResponse, B = unknown>(
  endpoint: string,
  body: B,
): Promise<R> => {
  const response = await fetch(`/api/${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  return response.json();
};
