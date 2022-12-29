import { Request, Response } from "express";
import knex from "../database/conn";
import Items from "../interfaces/Item";

export class ItemsController {
  async index (req: Request, res: Response) {
    const items: Items[] =  await knex('items').select('*');

    const serializedItems = items.map(item => {
      return {
        ...item,
        image: `http://localhost:3333/uploads/${item.image}`
      }
    });

    return res.json(serializedItems);

  }
}