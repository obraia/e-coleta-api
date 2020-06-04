import express from 'express';
import PointsController from './controllers/PointsController';
import ItemsController from './controllers/ItemsController';

const routes = express.Router();

const pointsController = new PointsController();
const itemsController = new ItemsController();


routes.get('/points', pointsController.index);
routes.get('/points/:id', pointsController.show);
routes.post('/points', pointsController.create);
routes.put('/points', pointsController.update);
routes.delete('/points/:id', pointsController.delete);

routes.get('/items', itemsController.index);
routes.post('/items', itemsController.create);
routes.put('/items', itemsController.update);
routes.delete('/items/:id', itemsController.delete);

export default routes;