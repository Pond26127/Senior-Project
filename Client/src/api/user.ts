import { instance } from '.';

export const getAllUsers = () => {
    return instance.get(`/users`)
}
export const createUser = async (userName: string) => {
    return instance.post(`/users`, {name: userName})
}

export const deleteUser = async (UID?: number) => {
    return instance.delete(`/users/${UID}`)
}

export const getUser = async (UID?: number) => {
    return instance.get(`/users/${UID}`)
}

export const getMe = () => {
    return instance.get(`/users/me`)
}

