/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable prettier/prettier */
/* eslint-disable no-console */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/no-unescaped-entities */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Dropzone from 'react-dropzone';

export interface Przedzialy {
  [key: string]: Array<any>;
}
export interface Gabaryty {
  [key: string]: number & {
    GABARYT: string;
  };
}

export const StartPage = () => {
  const [przedzialy, setPrzedzialy] = useState<Przedzialy>({});
  const [gabaryty, setGabaryty] = useState<Gabaryty[]>([]);
  const navigate = useNavigate();
  class FileDownload {
    static sendFileToMain(acceptedFiles: Array<File>) {
      acceptedFiles.forEach((file: Blob) => {
        const reader = new FileReader();
        reader.onabort = () => console.log('File reading was aborted');
        reader.onerror = () => console.log('file reading has failed');
        reader.onload = () => {
          const binaryStr = reader.result;
          window.electron.ipcRenderer.sendPriceList('price-list', binaryStr);
        };
        reader.readAsArrayBuffer(file);
      });
    }

    static getRanges() {
      window.electron.ipcRenderer.sendRanges('price-ranges', (arg: any) => {
        setPrzedzialy(arg);
        console.log(typeof arg);
        console.log(arg);
        window.electron.ipcRenderer.deleteListners('price-ranges');
      });
    }

    static getDimensions() {
      window.electron.ipcRenderer.sendDimensions('price-list', (arg: any) => {
        setGabaryty(arg);
        console.log(typeof arg);
        console.log(arg);
        window.electron.ipcRenderer.deleteListners('price-list');
      });
    }
  }

  const onDropHandler = async (files: Array<File>) => {
    FileDownload.sendFileToMain(files);
    FileDownload.getRanges();
    FileDownload.getDimensions();
  };

  return (
    <div>
      <div
        onClick={() => {
          navigate(-1);
        }}
        onKeyPress={() => {
          navigate(-1);
        }}
        role="button"
        tabIndex={0}
      >
        StartPage
      </div>
      <Dropzone
        onDrop={(acceptedFiles) => {
          onDropHandler(acceptedFiles);
        }}
      >
        {({ getRootProps, getInputProps }) => (
          <section>
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              <p>Drag 'n' drop some files here, or click to select files</p>
            </div>
          </section>
        )}
      </Dropzone>
      {gabaryty.map((el, key) => {
        // eslint-disable-next-line react/no-array-index-key
        return <p key={key}>{el.GABARYT ? el.GABARYT : ''}</p>;
      })}
      {Object.keys(przedzialy).length!==0?<p>{przedzialy.PRZEDZIAL_1[0]} asdasda {przedzialy.PRZEDZIAL_1[1]} {Object.keys(przedzialy).length}</p>:''}
      
      <button
        type="button"
        onClick={() => {
          setPrzedzialy({});
          setGabaryty([]);
        }}
      >
        zero
      </button>
    </div>
  );
};

export default StartPage;
