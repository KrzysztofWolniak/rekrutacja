/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-async-promise-executor */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable prettier/prettier */
/* eslint-disable no-console */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/no-unescaped-entities */
import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { renderToStaticMarkup } from 'react-dom/server';

import Raport from 'renderer/components/Raport';
import LoadingDots from 'renderer/components/LoadingDots';

export interface Przedzialy {
  [key: string]: Array<any>;
}
export interface Gabaryty {
  [key: string]: number & {
    GABARYT: string;
  };
}
class PDFSaver {
  static async saveHandler(set: any, html: string, name: string) {
    set(true);
    const arr = await window.electron.ipcRenderer.downloadPdf(
      'download-pdf',
      html
    );
    const saveFileSettings = {
      buffer: arr,
      settings: {
        buttonLabel: 'Zapisz Raport',
        defaultPath: `Raport_${name}.pdf`,
      },
    };
    const te = await window.electron.ipcRenderer.saveFile(
      'save-file',
      saveFileSettings
    );
    set(false);
  }

  static async saveAllHandler(set: any, arrayOfShops: any[], gabaryty: any) {
    set(true);
    const arrOfHtml: object[] = [];
    arrayOfShops.forEach((el: any) => {
      const html = renderToStaticMarkup(
        <Raport shop={el} dimensions={gabaryty} />
      );
      arrOfHtml.push({ html, name: el.Name });
    });
    
    const test = await window.electron.ipcRenderer.downloadAllPdf(
      'download-all-pdf',
      arrOfHtml
    );
    
    const test2 = await window.electron.ipcRenderer.saveAllFiles(
      'save-all-files',
      test
    );
    
    set(false);
  }
}

export const StartPage = () => {
  const [isLoading, setLoading] = useState(false);

  // eslint-disable-next-line global-require

  // const {writeFile} = require('fs')

  const przedzialy = JSON.parse(
    window.localStorage.getItem('przedzialy') || '{}'
  );
  const gabaryty = JSON.parse(
    window.localStorage.getItem('gabaryty') || '[]'
  );

  const [listaSklepow, setListaSklepow] = useState(
    JSON.parse(window.sessionStorage.getItem('lista-sklepow') || '[]')
  );

  const changeDiscountHandler = (element: any, test: number) => {
    
    const testowySklep = [...listaSklepow];
    testowySklep.find((el: any) => {
      return el.Name === element.Name;
    }).ZNIZKA = test;

    setListaSklepow(testowySklep);
  };

  const navigate = useNavigate();

  const handlePriceCalculation = () => {
    listaSklepow.forEach((el: any) => {
      // sprawdzanie przedzialow\/
      for (let i = 1; i <= Object.keys(przedzialy).length; i += 1) {
        if (przedzialy[`PRZEDZIAL_${i}`].length === 2) {
          if (
            el.ILOSC_ZAMOWIEN > przedzialy[`PRZEDZIAL_${i}`][0] &&
            el.ILOSC_ZAMOWIEN < przedzialy[`PRZEDZIAL_${i}`][1]
          ) {
            el.PRZEDZIAL = i;
          }
        } else {
          el.ILOSC_ZAMOWIEN > przedzialy[`PRZEDZIAL_${i}`]
            ? (el.PRZEDZIAL = i)
            : null;
        }
      }
      if (!el.PRZEDZIAL) {
        el.PRZEDZIAL = 0;
      }
      // sprawdzanie przedzialow/\

      // obliczanie ceny\/

      el.CENA_CALOSC = 0;
      el.RAZEM = 0;
      gabaryty.forEach((element: any) => {
        
        if (el.PRZEDZIAL !== 0) {
          el[`CENA_NETTO_${element.GABARYT}`] =
            el[element.GABARYT] * element[`NETTO_${el.PRZEDZIAL}`];
          if (element.GABARYT.toString() === 'SZKLO') {
            el[`CENA_NETTO_${element.GABARYT}`] =
              el[element.GABARYT] * element[`NETTO_${1}`];
          }
          if(element.GABARYT.toString() !== 'SZKLO'){
            
            el.CENA_CALOSC = el[`CENA_NETTO_${element.GABARYT}`] + el.CENA_CALOSC;
            el.RAZEM = el[element.GABARYT] + el.RAZEM;
          }
        } else {
          el[`CENA_NETTO_${element.GABARYT}`] = 0;
          el.RAZEM = 0;
        }
       
      });
      // oblicznaie ceny/\
    });
    
  };

  handlePriceCalculation();

  return (
    <div>
      {!isLoading ? (
        <div>
          <button
            type="button"
            tabIndex={0}
            className="mt-2 ms-3 rounded"
          
            onClick={() => navigate('/NowyCennik')}
          >
            Nowy cennik
          </button>
          <button
            type="button"
            tabIndex={0}
            className="mt-2 ms-3 rounded"
          
            onClick={() => navigate('/ListaZamowien')}
          >
            Nowa Lista
          </button>
          <div className="text-center">
            <button
              className="mb-3 mx-1 rounded"
              type="button"
              onClick={() =>
                PDFSaver.saveAllHandler(setLoading, listaSklepow, gabaryty)
              }
            >
              Zapisz Wszystkie
            </button>
          </div>
          {listaSklepow.map((el: any, key: any) => {
            return (
              <div key={key} className="text-center">
                <Raport shop={el} dimensions={gabaryty} />
                <button
                  className="mb-3 me-1 rounded"
                  type="button"
                  onClick={() =>
                    PDFSaver.saveHandler(
                      setLoading,
                      renderToStaticMarkup(
                        <Raport shop={el} dimensions={gabaryty} />
                      ),
                      el.Name
                    )
                  }
                >
                  Zapisz
                </button>
               
                <button
                  className="mb-3 mx-1 rounded"
                  type="button"
                  onClick={() => changeDiscountHandler(el, -20)}
                >
                  Zniżka -20%
                </button>
                <button
                  className="mb-3 mx-1 rounded"
                  type="button"
                  onClick={() => changeDiscountHandler(el, 0)}
                >
                  Regularna cena
                </button>
                <button
                  className="mb-3 ms-1 rounded"
                  type="button"
                  onClick={() => changeDiscountHandler(el, 20)}
                >
                  Zwyżka +20%
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center position-absolute top-50 start-50 translate-middle">
          <LoadingDots/>
          Przetwarzanie
        </div>
      )}
    </div>
  );
};

export default StartPage;
