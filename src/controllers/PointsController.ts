import { Request, Response } from 'express';
import knex from '../database/connection';

class PointsController {

    async index(req: Request, res: Response) {

        const { uf, city, items } = req.query;

        const itemsArray = String(items)
            .split(',')
            .map(item => Number(item.trim()));

        const points = await knex('points')
            .join('point_items', 'points.id', '=', 'point_items.point_id')
            .whereIn('point_items.item_id', itemsArray)
            .where('city', String(city))
            .where('uf', String(uf))
            .distinct()
            .select('points.*');

        return res.json(points);
    }

    async show(req: Request, res: Response) {

        const { id } = req.params;
        const point = await knex('points').where('id', id).first();

        if (!point) return res.status(404).json({ error: 'Point not found' });

        const items = await knex('items')
            .join('point_items', 'items.id', '=', 'point_items.item_id')
            .where('point_items.point_id', id)
            .select('items.id', 'items.title');

        return res.json({ ...point, items });
    }

    async create(req: Request, res: Response) {

        const point = { ...req.body, image: 'fake-image.jpg' };
        const { items } = point;
        delete point.items;

        const trx = await knex.transaction();

        const [point_id] = await trx('points').insert(point);
        const pointItems = items.map((item_id: number) => ({ item_id, point_id }));

        await trx('point_items').insert(pointItems);

        await trx.commit();

        res.status(200).json({ id: point_id, ...point });
    }

    async update(req: Request, res: Response) {

        const point = { ...req.body, image: 'fake-image.jpg' };
        const { items } = point;
        delete point.items;

        /*
        const trx = await knex.transaction();

        const [point_id] = await trx('points').insert(point);
        const pointItems = items.map((item_id: number) => ({ item_id, point_id }));

        await trx('point_items').insert(pointItems);

        await trx.commit();
        */

        res.status(501).json({ message: 'Not implemented' });
    }

    async delete(req: Request, res: Response) {
        const { id } = req.params;

        const point = await knex('points')
            .where('id', id)
            .first();

        if (!point) return res.status(404).json({ error: 'Point not found' });

        const trx = await knex.transaction();

        await trx('points').where('id', id).delete();

        await trx('point_items').where('point_id', id).delete();

        await trx.commit();

        res.status(200).json({ message: 'success' });
    }
}

export default PointsController;