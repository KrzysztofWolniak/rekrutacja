/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable prettier/prettier */
/* eslint-disable no-console */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/jsx-props-no-spreading */
import { useEffect, useState } from 'react';
import Dropzone from 'react-dropzone';
import { useNavigate } from 'react-router-dom';
import LoadingDots from 'renderer/components/LoadingDots';

export interface Przedzialy {
  [key: string]: Array<number>;
}
export interface Gabaryty {
  [key: string]: number & {
    GABARYT: string;
  };
}
export interface Sklepy {
  [key: string]: number & {
    Name: string;
  };
}
const AddFile = (props: any) => {
  const [isLoading, setLoading] = useState(false);
  const { firstTime, fileType } = props;
  const navigate = useNavigate();

  const handlePriceListFile = (file: Blob) => {
    return new Promise<Array<Przedzialy | Gabaryty> | any>(
      (resolve, reject) => {
        setLoading(true)
        const reader = new FileReader();
        reader.onabort = () => {
          reject;
        };
        reader.onerror = () => {
          reject;
        };
        reader.onload = async () => {
          const binaryStr = reader.result;
          if (fileType === 'cennik') {
            const arr = window.electron.ipcRenderer.sendPriceList(
              'price-list',
              binaryStr
            );
            resolve(arr);
          } else {
            const arr = window.electron.ipcRenderer.sendListOfOrders(
              'file',
              binaryStr
            );
        

            resolve(arr);
          }
        };

        reader.readAsArrayBuffer(file);
      }
    );
  };

  class FileOperations {
    static sendFileToMain(acceptedFiles: Array<Blob>) {
      return new Promise<void>((resolve, reject) => {
        setLoading(true)

        acceptedFiles.forEach(async (file: Blob) => {
          const arr = await handlePriceListFile(file).catch(() =>
            console.log('cos nie bangla')
          );
          if (fileType === 'cennik') {
            if (arr) {
              FileOperations.setRanges(arr[0]);
              arr.shift();
              FileOperations.setDimensions(arr);
              
              resolve();
            } else {
              
              reject;
            }
          } else {
            FileOperations.setListOfShops(arr);
        

            resolve();
          }
        });
      });
    }

    static sendListOfOrdersToMain(acceptedFiles: Array<Blob>) {
      return new Promise<void>((resolve, reject) => {
        setLoading(true)

        acceptedFiles.forEach(async (file: Blob) => {
          const arr = await handlePriceListFile(file).catch(() =>
            console.log('cos nie bangla')
          );
          if (arr) {
            FileOperations.setRanges(arr[0]);
            arr.shift();
            FileOperations.setDimensions(arr);
        
            
            resolve();
          } else {
        

            reject;
          }
        });
      });
    }

    static setRanges(arg: Przedzialy) {
      window.localStorage.setItem('przedzialy', JSON.stringify(arg));
    }

    static setDimensions(arg: Gabaryty[]) {
      window.localStorage.setItem('gabaryty', JSON.stringify(arg));
    }

    static setListOfShops(arg: any) {
      window.sessionStorage.setItem(
        'lista-sklepow',
        JSON.stringify(arg.sklepy)
      );
    }
  }
  const onDropHandler = async (files: Array<File>) => {
    await FileOperations.sendFileToMain(files);
    window.sessionStorage.getItem('lista-sklepow')
      ? navigate('/start')
      : navigate('/ListaZamowien');
  };

  useEffect(() => {
    if (window.localStorage.getItem('gabaryty') && firstTime) {
      navigate('/ListaZamowien');
    }
  });

  return (
    <div>
      {isLoading ? (
        <div className="text-center position-absolute top-50 start-50 translate-middle">
          <LoadingDots />
          Przetwarzanie
        </div>
      ) : (
        <div className="container-sm align-middle vh-100 d-flex flex-column justify-content-around">
          {firstTime ? (
            ''
          ) : (
            <button
              type="button"
              tabIndex={0}
              className="mt-2 ms-3 rounded position-absolute top-0 start-0"
              onClick={() => navigate('/NowyCennik')}
            >
              Nowy cennik
            </button>
          )}

          <div className="row position-relative justify-content-center  align-items-center">
            {fileType === 'cennik' ? (
              <p className="text-center">Prosze przesłać cennik</p>
            ) : (
              <p className="text-center">Prosze przesłać liste zamówień</p>
            )}
            <Dropzone
              onDrop={(acceptedFiles) => {
                onDropHandler(acceptedFiles);
              }}
              multiple={false}
              accept={{
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
                  ['.xlsx'],
              }}
            >
              {({ getRootProps, getInputProps }) => (
                <section>
                  <div {...getRootProps()}>
                    <input {...getInputProps()} />
                    <p className="rounded border border-primary py-5 text-center">
                      Drag and drop some files here, or click to select files
                    </p>
                  </div>
                </section>
              )}
            </Dropzone>
          </div>
        </div>
      )}
    </div>
  );
};
export default AddFile;
