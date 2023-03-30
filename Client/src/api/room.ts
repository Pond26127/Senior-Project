import { instance } from ".";

export const getAllRoom = () => {
  return instance.get(`/rooms`);
};

export const getRoom = async (UID?: number) => {
  return instance.get(`/rooms/${UID}`);
};

export const createRoom = async (roomName: string) => {
  return instance.post(`/rooms`, { name: roomName });
};

// need name and private
export const editRoom = async (body: any) => {
  return instance.patch(`/rooms`, body, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const deleteRoom = async (UID?: number) => {
    return instance.delete(`/rooms/${UID}`)
}

export const getHoroscope = () => {
  return instance.get(`/features/random-word`);
}

export const createToken = async (code : any) => {
  return instance.post(`/calendars/create-tokens`);
}