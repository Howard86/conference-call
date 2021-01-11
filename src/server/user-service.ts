export interface User {
  uid: string;
  username: string;
  createdAt: number;
}

const userTable = new Map<string, User>();

export const getAllUsers = (): User[] => {
  return Array.from(userTable).map(([_, value]) => value);
};

export const addUser = (user: User): User => {
  userTable.set(user.uid, user);
  return user;
};

export const getUserByUID = (uid: string): User => {
  return userTable.get(uid);
};

export const deleteUser = (uid: string): boolean => {
  return userTable.delete(uid);
};
