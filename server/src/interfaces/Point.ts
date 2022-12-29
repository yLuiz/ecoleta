import Items from "./Item";

export default interface IPoint {
  id: number,
  image: string,
  name: string,
  email: string,
  whatsapp: string,
  latitude: number,
  longitude: number,
  city: string,
  uf: string,
  items?: Items[]
}