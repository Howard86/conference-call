import type { User } from '@/server/user';
export interface GenericResponse {
  success: boolean;
}

export interface GetUserByUIDResponse extends GenericResponse {
  user: User;
}

export interface IssueTokenResponse extends GenericResponse {
  token: string;
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

export const deleteLocal = async <R = GenericResponse>(
  endpoint: string,
): Promise<R> => {
  const response = await fetch(`/api/${endpoint}`, {
    method: 'DELETE',
  });

  return response.json();
};
