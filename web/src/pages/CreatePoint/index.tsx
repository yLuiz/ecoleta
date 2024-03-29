import axios from "axios";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { FiArrowLeft } from "react-icons/fi";
import { MapContainer, Marker, TileLayer, useMapEvents } from 'react-leaflet';
import { Link, useNavigate } from "react-router-dom";
import './CreatePoint.css';

import Dropzone from "../../components/Dropzone";

import { LeafletMouseEvent } from "leaflet";
import logo from '../../assets/logo.svg';
import api from "../../services/api";

interface Item {
  id: number;
  title: string;
  image: string;
}

interface IFormData {
  name: string;
  email: string;
  whatsapp: string;
}

interface IBGEUFResponse {
  sigla: string;
}

interface IBGECityResponse {
  nome: string;
}
const CreatePoint = () => {

  const navigate = useNavigate();
  const [items, setItems] = useState<Item[]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  const [selectedFile, setSelectedFile] = useState<File>();

  const [UFs, setUFs] = useState<string[]>([]);
  const [selectedUf, setSelectedUf] = useState<string>("0");

  const [formData, setFormData] = useState<IFormData>({
    name: "",
    email: "",
    whatsapp: ""
  });
  
  const [cities, setCities] = useState<string[]>([]);
  const [selectedCity, setSelectedCity] = useState("0");

  const [selectedPosition, setSelectedPosition] = useState<[number, number]>([0, 0]);
  const [initialPosition, setInitialPosition] = useState<[number, number]>([0, 0]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(position => {

      const { latitude, longitude } = position.coords;

      setInitialPosition([ longitude, latitude ]);
    });
  }, []);

  useEffect(() => {
    api.get('/items')
      .then(response => {
        setItems(response.data);        
      })
      .catch(err => console.log(err));
  }, []);

  useEffect(() => {
    axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
      .then(response => {
          const ufInitials = response.data.map(uf => uf.sigla);
          setUFs(ufInitials);
      })
      .catch(err => console.log(err));
  }, [selectedUf]);

  useEffect(() => {

    if (selectedUf === "0") 
      return;

    axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
      .then(response => {
        const cityNames = response.data.map(city => city.nome);
        setCities(cityNames);
      })
      .catch(err => console.log(err));
  }, [selectedUf]);

  function handleSelectUf(event: ChangeEvent<HTMLSelectElement>) {
    const uf = event.target.value;
    setSelectedUf(uf);
  };

  function handleSelectCity(event: ChangeEvent<HTMLSelectElement>) {
    const city = event.target.value;
    setSelectedCity(city);
  }

  function handleMapClick(event: LeafletMouseEvent) {

    const { lat, lng } = event.latlng;

    setSelectedPosition([ lat, lng ]);
  }

  function handleInput(event: ChangeEvent<HTMLInputElement>) {

    const { name: key, value } = event.target
    
    setFormData({
      ...formData, 
      [key]: value,
    })
  }

  function handleSelectItem(itemId: number) {
    const isSelected = selectedItems.includes(itemId);

    if (isSelected) {
      const newSeletedItems = selectedItems.filter(items => items !== itemId)
      setSelectedItems(newSeletedItems);
      return;
    }
    
    setSelectedItems([...selectedItems, itemId]);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const { name, email, whatsapp } = formData;
    const [ latitude, longitude ] = selectedPosition;

    const dataPoint = new FormData();

    dataPoint.append("name", name)
    dataPoint.append("email", email)
    dataPoint.append("whatsapp", whatsapp)
    dataPoint.append("uf", selectedUf)
    dataPoint.append("city", selectedCity)
    dataPoint.append("latitude", String(latitude))
    dataPoint.append("longitude", String(longitude))
    dataPoint.append("items", selectedItems.join(","));
    
    if (selectedFile) {
      dataPoint.append("image", selectedFile);
    }

    await api.post('points', dataPoint);

    // Criar uma tela de mensagem de concluído para retirar o alert.
    alert("Ponto criado!")

    navigate('/');
  }

  function MapEvent() {
    const map = useMapEvents({
      click: (e) => {
        handleMapClick(e);
      }
    });

    return null;
  }

  return (
    <div id="page-create-point">
      <header>
        <img src={logo} alt="Ecoleta" />

        <Link to="/">
          <FiArrowLeft />
          Voltar para home
        </Link>
      </header>

      <form onSubmit={handleSubmit}>
        <h1>Cadastro do ponto<br /> de coleta</h1>
        <fieldset>
          <legend>
            <h2>Dados</h2>
          </legend>

          <div className="field">
            <Dropzone onFileUploaded={setSelectedFile} />
          </div>

          <div className="field">
              <label htmlFor="name">Nome da entidade</label>
              <input
                type="text"
                name="name"
                id="name"
                onChange={handleInput}
              />
          </div>
          <div className="field-group">  
            <div className="field">
              <label htmlFor="email">E-mail</label>
              <input
                type="email"
                name="email"
                id="email"
                onChange={handleInput}
              />
            </div>
            <div className="field">
              <label htmlFor="whatsapp">Whatsapp</label>
              <input
                type="text"
                name="whatsapp"
                id="whatsapp"
                onChange={handleInput}
              />
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <h2>Endereço</h2>
            <span>Selecione o endereço no mapa</span>
          </legend>

          <MapContainer
            center={[-3.112606, -59.9689241]} 
            zoom={13} 
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <MapEvent />
            <Marker position={selectedPosition} />
          </MapContainer>

          <div className="field-group">
            <div className="field">
              <label htmlFor="uf">Estado (UF)</label>
              <select
                name="uf"
                id="uf"
                onChange={handleSelectUf}
                value={selectedUf}
              >
                <option value="0">Selecione uma UF</option>
                {
                  UFs 
                    ? UFs.map(uf => (
                        <option key={uf} value={uf}>{uf}</option>
                      )) 
                    : null
                }
              </select>
            </div>
            <div className="field">
              <label htmlFor="city">Cidade</label>
              <select
                name="city"
                id="city"
                onChange={handleSelectCity}
                value={selectedCity}
              >
                <option value="0">Selecione uma cidade</option>
                {
                  cities
                    ? cities.map(city => (
                        <option key={city} value={city}>{city}</option>
                      ))
                    : null
                }
              </select>
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <h2>Ítens de coleta</h2>
            <span>Selecione um ou mais itens abaixo</span>
          </legend>

          <ul className="items-grid">
            { items ? items.map((item: Item) => (
              <li 
                key={item.id}
                onClick={ () => handleSelectItem(item.id) }
                className={ selectedItems.includes(item.id) ? 'selected' : ''}
              >
                <img src={item.image} alt={item.title} />
                <span>{item.title}</span>
              </li>
            )) : null}
          </ul>
        </fieldset>

        <button type="submit">Cadastrar ponto de coleta</button>

      </form>
    </div>
  );
}

export default CreatePoint;