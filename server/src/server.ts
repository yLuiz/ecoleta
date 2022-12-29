import cors from 'cors';
import express, { urlencoded } from 'express';
import path from 'path';
import routes from './routes';
import '../src/database/conn';

const app = express();

app.use(cors({
  origin: "*"
}));
app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')));
app.use(express.json());
app.use(urlencoded({
  extended: true,
}));

const users = [
  'Diego',
  'Luiz',
  'Robson',
  'Daniel',
  'Cleiton'
]
app.use('/', routes);

app.listen(3333, () => {
  console.log('🚀 Sever is running ! 🚀');
});