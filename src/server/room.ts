import { nanoid } from '@reduxjs/toolkit';

export interface Room extends AddRoomDTO {
  id: string;
  createdAt: number;
}

export interface AddRoomDTO {
  inviteCode: string;
  channelName: string;
  hostname: string;
  limit: number;
}

const roomTable = new Map<string, Room>();

export const getAllRooms = (): Room[] => {
  return Array.from(roomTable.values());
};

export const addRoom = (roomDto: AddRoomDTO): Room => {
  const id = nanoid();
  const room: Room = { ...roomDto, id, createdAt: Date.now() };
  roomTable.set(id, room);
  return room;
};

export const getRoomByUID = (uid: string): Room => {
  return roomTable.get(uid);
};

export const deleteRoom = (uid: string): boolean => {
  return roomTable.delete(uid);
};
