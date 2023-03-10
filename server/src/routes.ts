import express from 'express';
import multer from 'multer';

import multerConfig from './config/multer';

import { ItemsController } from './controllers/ItemsController';
import { PointsController } from './controllers/PointsController';
import { celebrate, Joi } from 'celebrate';

const routes = express.Router();
const upload = multer(multerConfig);

const pointsController = new PointsController();
const itemsController = new ItemsController();

routes.get('/items', itemsController.index);

routes.get('/points', pointsController.index);
routes.get('/points/:id', pointsController.show);

routes.post('/points', 
  upload.single('image'),
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required(),
      email: Joi.string().required().email(),
      whatsapp: Joi.string().required(),
      latitude: Joi.number().required(),
      longitude: Joi.number().required(),
      city: Joi.string().required(),
      uf: Joi.string().required().max(2),
      items: Joi.string().required(), // Usar regex para validar a separação por vírgula.
    })
  },
  {
    abortEarly: false
  }),
  pointsController.create
);
routes.delete('/points/:id', pointsController.delete);


// Padrão de metódos da comunidade.
// index -  Para listar tudo.
// show - Para listar apenas um.
// create, update, delete

export default routes;