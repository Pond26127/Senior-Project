import { instance } from '.';

export const getSession = () => {
    return instance.get(`/sessions`)
}