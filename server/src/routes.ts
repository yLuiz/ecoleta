import express from 'express';
import { ItemsController } from './controllers/ItemsController';
import { PointsController } from './controllers/PointsController';

const routes = express.Router();
const pointsController = new PointsController();
const itemsController = new ItemsController();

routes.get('/items', itemsController.index);

routes.post('/points', pointsController.create);
routes.get('/points', pointsController.index);
routes.get('/points/:id', pointsController.show);
routes.delete('/points/:id', pointsController.delete);


// Padrão de metódos da comunidade.
// index -  Para listar tudo.
// show - Para listar apenas um.
// create, update, delete

export default routes;