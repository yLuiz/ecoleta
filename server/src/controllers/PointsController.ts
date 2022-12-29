import { json, Request, Response } from "express";
import knex from "../database/conn";

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
    return res.json(points);
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
    } = req.body;
  
    const trx = await knex.transaction();

    const point = {
      image: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=60',
      name, 
      email, 
      whatsapp,
      latitude,
      longitude,
      city,
      uf,
    }
  
    const insertIds = await trx('points')
      .insert(point)

    const point_id = insertIds[0];

    const pointItems = items.map((item_id: number) => {
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

    const itemsTitle = items.map(item => {
      return { title: item.title }
    })

    return res.json({
      point,
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