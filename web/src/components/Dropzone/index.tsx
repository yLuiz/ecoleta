import React, {useCallback, useState} from 'react';
import {useDropzone} from 'react-dropzone';
import { FiUpload } from 'react-icons/fi';

import './style.css';

interface Props {
  onFileUploaded: (file: File) => void;
}

const Dropzone: React.FC<Props> = ({ onFileUploaded }) => {

  const [selectedFileUrl, setSelectedFileUrl] = useState<string>('');
  const onDrop = useCallback((acceptedFiles: any) => {
    const file = acceptedFiles[0];

    const fileUrl = URL.createObjectURL(file);

    setSelectedFileUrl(fileUrl);
    onFileUploaded(file);
  }, [onFileUploaded]);
  
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/png': ['.png'],
      'image/jgp': ['.jgp'],
      'image/jpeg': ['.jpeg'],
    }
  })

  return (
    <div className='dropzone' {...getRootProps()}>
      <input accept='image/*' {...getInputProps()} />

      { selectedFileUrl 
        ? <img src={selectedFileUrl} alt="Point thumbnail"/> 
        : <p>
            <FiUpload />
            Imagem do estabelecimento
          </p> 
      }
    </div>
  )
}

export default Dropzone;