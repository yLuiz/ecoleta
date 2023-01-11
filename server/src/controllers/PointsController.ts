import { json, Request, Response } from "express";
import knex from "../database/conn";
import IPoint from "../interfaces/Point";

interface IPointRequest {
  name: string; 
  email: string;
  whatsapp: string;
  latitude: number;
  longitude: number;
  city: string;
  uf: string;
  items: string;
}

export class PointsController {

  async index(req: Request, res: Response) {

    const { city, uf, items } = req.query;
    const parsedItems = String(items)
      .split(',')
      .map(item => Number(item.trim()));

    const points = await knex('points')
      .join('point_items', 'points.id', '=', 'point_items.point_id')
      .whereIn('point_items.item_id', parsedItems)
      .where('city', String(city))
      .where('uf', String(uf))
      .distinct()
      .select('points.*')

      const serializedPoints = points.map(point => {
        return {
          ...points,
          image_url: `http://localhost:3333/uploads/${point.image}`
        }
      });
  

    return res.json(serializedPoints);
  }

  async create(req: Request, res: Response) {
    const {
      name, 
      email, 
      whatsapp,
      latitude,
      longitude,
      city,
      uf,
      items
    } = req.body as IPointRequest;

    const image = req.file?.filename;

    if (!image) {
      return res.status(400).json({ message: 'Invalid image' });
    }
  
    const trx = await knex.transaction();

    const point: IPoint = {
      image,
      name, 
      email, 
      whatsapp,
      latitude,
      longitude,
      city,
      uf
    }
  
    const insertIds = await trx('points')
      .insert(point)

    const point_id = insertIds[0];

    const itemsArray = items.split(',').map((item) => Number(item.trim()));
    
    const pointItems = itemsArray.map((item_id: number) => {
      return {
        point_id, 
        item_id
      }
    })
  
    await trx('point_items')
      .insert(pointItems)

    await trx.commit();
  
    return res.json({
      id: point_id,
      ...point
    });
  }

  async show(req: Request, res: Response) {
    const { id } = req.params
    const point = await knex('points').select('*').where({ id }).first();

    if (!point) 
      return res.status(404).json({ message: 'Point not found'});

    const items = await knex('items').select('*')
      .join('point_items', 'items.id', '=', 'point_items.item_id')
      .where('point_items.point_id', id);

    const serializedPoint = {
      ...point,
      image_url: `http://localhost:3333/uploads/${point.image}` 
    };

    const itemsTitle = items.map(item => {
      return { title: item.title }
    })

    return res.json({
      point: serializedPoint,
      items: itemsTitle
    });
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params

    const trx = await knex.transaction();

    await trx('points').delete().where({ id });

    await trx('point_items').delete().where({ point_id: id });

    await trx.commit();

    return res.json({ message: 'Points deleted successfully' });
  }
}