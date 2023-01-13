import cors from 'cors';
import express, { urlencoded } from 'express';
import path from 'path';
import routes from './routes';
import '../src/database/conn';
import { errors } from 'celebrate';

const app = express();

app.use(cors({
  origin: "*"
}));

app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')));
app.use(express.json());
app.use(urlencoded({
  extended: true,
}));

app.use('/', routes);

app.use(errors());

app.listen(3333, () => {
  console.log('🚀 Sever is running ! 🚀');
});