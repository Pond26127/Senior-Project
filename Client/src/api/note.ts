import { instance } from ".";

export const getNote = async (UID?: number) => {
    return instance.get(`/notes/${UID}`);
  };
  
export const createNote = async (RID?: number) => {
    return instance.post(`/notes`, {room_id: RID})
}

export const editNote = async (body: any) => {
    return instance.patch(`/notes`, body, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  };