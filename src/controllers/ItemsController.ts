import { Request, Response } from 'express';
import knex from '../database/connection';

class ItemsController {

    async index(req: Request, res: Response) {
        const items = await knex('items').select('*');

        const serializedItems = items.map(item => {
            return {
                id: item.id,
                title: item.title,
                image_url: `${req.protocol}://${req.get('host')}/uploads/${item.image}`,
            }
        });

        return res.json(serializedItems);
    }

    async create(req: Request, res: Response) {
        res.status(501).json({ message: 'Not implemented' });
    }

    async update(req: Request, res: Response) {
        res.status(501).json({ message: 'Not implemented' });
    }

    async delete(req: Request, res: Response) {
        res.status(501).json({ message: 'Not implemented' });
    }
}

export default ItemsController;