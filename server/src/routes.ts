import express from 'express';
import multer from 'multer';

import multerConfig from './config/multer';

import { ItemsController } from './controllers/ItemsController';
import { PointsController } from './controllers/PointsController';

const routes = express.Router();
const upload = multer(multerConfig);

const pointsController = new PointsController();
const itemsController = new ItemsController();

routes.get('/items', itemsController.index);

routes.get('/points', pointsController.index);
routes.get('/points/:id', pointsController.show);

routes.post('/points', upload.single('image'), pointsController.create);
routes.delete('/points/:id', pointsController.delete);


// Padrão de metódos da comunidade.
// index -  Para listar tudo.
// show - Para listar apenas um.
// create, update, delete

export default routes;