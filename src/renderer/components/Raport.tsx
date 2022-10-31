/* eslint-disable prettier/prettier */
/* eslint-disable react/no-array-index-key */
import React, { useState } from 'react';
import { renderIntoDocument } from 'react-dom/test-utils';

const Raport = (props: any) => {
  const { dimensions, shop } = props;
  let szklo: any;
  let znizka = 0;

  if (shop.ZNIZKA === 100 || -100) {
    znizka = shop.ZNIZKA / 100;
  }
  if (shop.ZNIZKA < 0) {
    znizka = +`0.${shop.ZNIZKA * -1}`;
  }
  if (shop.ZNIZKA >= 0) {
    znizka = +`-0.${shop.ZNIZKA}`;
  }
  const font = {
    fontSize: '11px',
  };
  const A4Style: any = {
    fontSize: '12px',
    minWidth: '900px ',
    maxWidth: '900px ',
    backgroundColor: 'white',
  };
  if (shop.Name) {
    return (
      <>
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/css/bootstrap.min.css"
          rel="stylesheet"
          integrity="sha384-Zenh87qX5JnK2Jl0vWa8Ck2rdkQ2Bzep5IDxbcnCeuOxjzrPF/et3URy9Bv1WTRi"
          crossOrigin="anonymous"
        />
        <script
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/js/bootstrap.bundle.min.js"
          integrity="sha384-OERcA2EqjJCMA+/3y+gxIOqMEjwtxJY7qPCqsdltbNJuaOe923+mo//f6V8Qbsw3"
          crossOrigin="anonymous"
        />
        <div className="container-sm mb-3 mt-2 rounded" style={A4Style}>
          <div className="row text-center pt-3">
            <div className="col-5 pe-0">{shop.Name} </div>
            <div className="col d-flex ps-0 ">
              {shop.ZNIZKA === 0 ? (
                <>
                  <div className="col-3   ">{}</div>
                  <div className="col-1 border border-dark  border-bottom-0 border-start-0 border-top-0 ">{}</div>
                </>
              ) : (
                <>
                  <div className="col-3 border border-dark  border-bottom-0">
                    Zniżka/Zwyżka
                  </div>
                  <div className="col-1 border border-dark border-start-0 border-bottom-0 ">{shop.ZNIZKA} %</div>
                </>
              )}

              <div className="col border border-dark border-start-0 border-bottom-0">
                Liczba zleceń w miesiącu
              </div>
              <div className="col-3 border border-dark border-start-0 border-bottom-0">
                {shop.ILOSC_ZAMOWIEN}
              </div>
            </div>
          </div>
          <div className="row text-center ">
            <div className="col-5 d-flex pe-0 text-center  justify-content-end ">
              <div className="col-5 border border-dark  d-flex bg-secondary bg-opacity-75">
                <p style={font} className="w-100 mb-0 align-self-end fw-bold">
                  Obsługa fulfilment{' '}
                </p>
              </div>
              <div className="col border border-dark border-start-0 d-flex bg-secondary bg-opacity-50">
                <p style={font} className="w-100 mb-0 align-self-end fw-bold">
                  Ilość{' '}
                </p>
              </div>
              <div className="col border border-dark border-start-0 border-end-0 d-flex bg-secondary bg-opacity-25 ">
                <p style={font} className="w-100 mb-0 align-self-end fw-bold">
                  {' '}
                  Cena netto
                </p>
              </div>
            </div>
            <div className="col d-flex ps-0">
              <div className="col-3 border border-dark  d-flex bg-secondary bg-opacity-25">
                <p style={font} className="w-100 mb-0 align-self-end fw-bold">
                  Cena Brutto{' '}
                </p>
              </div>
              <div className="col-1 border border-dark border-start-0 d-flex bg-secondary bg-opacity-25">
                <p style={font} className="w-100 mb-0 align-self-end fw-bold">
                  VAT[%]{' '}
                </p>
              </div>
              <div className="col border border-dark border-start-0 d-flex bg-secondary bg-opacity-25">
                <p
                  style={font}
                  className="w-100 mb-0 align-self-end text-wrap fw-bold "
                >
                  Wartość VAT
                </p>
              </div>

              <div className="col border border-dark border-start-0 d-flex bg-secondary bg-opacity-25">
                <p style={font} className="w-100 mb-0 align-self-end fw-bold ">
                  Wartość netto
                </p>
              </div>
              <div className="col-3 border border-dark border-start-0 f-flex bg-secondary bg-opacity-25">
                <p style={font} className="w-100 mb-0 align-self-end fw-bold">
                  Wartość brutto
                </p>
              </div>
            </div>
          </div>
          {/* Osobny komponent */}
          {dimensions.map((el: any, key: any) => {
            if (el.GABARYT.toString() === 'SZKLO') {
              szklo = el;
              return null;
            }
            return (
              <div key={`dimension_${key}`} className="row text-center ">
                <div className="col-5 d-flex pe-0 text-center  justify-content-end ">
                  <div className="col-5 border border-dark  d-flex border-top-0">
                    <p
                      style={font}
                      className="w-100 mb-0 align-self-end border-top-0"
                    >
                      {el.GABARYT}
                    </p>
                  </div>
                  <div className="col border border-dark border-start-0 border-top-0 d-flex ">
                    <p style={font} className="w-100 mb-0 align-self-end">
                      {shop[el.GABARYT]}
                    </p>
                  </div>
                  <div className="col border border-dark border-start-0 border-end-0  border-top-0 d-flex">
                    <p style={font} className="w-100 mb-0 align-self-end">
                      {' '}
                      {shop.PRZEDZIAL
                        ? (
                            +el[`NETTO_${shop.PRZEDZIAL}`].toFixed(2) -
                            znizka * +el[`NETTO_${shop.PRZEDZIAL}`].toFixed(2)
                          ).toFixed(2)
                        : 0}
                      {' zł'}
                    </p>
                  </div>
                </div>
                <div className="col d-flex ps-0">
                  <div className="col-3 border border-dark  border-top-0 d-flex">
                    <p style={font} className="w-100 mb-0 align-self-end">
                      {shop.PRZEDZIAL
                        ? (
                            +(
                              +el[`NETTO_${shop.PRZEDZIAL}`].toFixed(2) +
                              el[`NETTO_${shop.PRZEDZIAL}`] * 0.23
                            ).toFixed(2) -
                            znizka *
                              +(
                                +el[`NETTO_${shop.PRZEDZIAL}`].toFixed(2) +
                                el[`NETTO_${shop.PRZEDZIAL}`] * 0.23
                              )
                          ).toFixed(2)
                        : 0}
                      {' zł'}
                    </p>
                  </div>
                  <div className="col-1 border border-dark border-start-0 border-top-0 d-flex">
                    <p style={font} className="w-100 mb-0 align-self-end">
                      23{' '}
                    </p>
                  </div>
                  <div className="col border border-dark border-start-0 border-top-0 d-flex ">
                    <p
                      style={font}
                      className="w-100 mb-0 align-self-end text-wrap "
                    >
                      {(
                        +(
                          shop[`CENA_NETTO_${el.GABARYT}`].toFixed(2) * 0.23
                        ).toFixed(2) -
                        +(
                          shop[`CENA_NETTO_${el.GABARYT}`].toFixed(2) * 0.23
                        ).toFixed(2) *
                          znizka
                      ).toFixed(2)}{' '}
                      zł
                    </p>
                  </div>

                  <div className="col border border-dark border-start-0  border-top-0 d-flex">
                    <p style={font} className="w-100 mb-0 align-self-end ">
                      {(
                        +shop[`CENA_NETTO_${el.GABARYT}`].toFixed(2) -
                        znizka * +shop[`CENA_NETTO_${el.GABARYT}`].toFixed(2)
                      ).toFixed(2)}
                      {' zł'}
                    </p>
                  </div>
                  <div className="col-3 border border-dark border-start-0 border-top-0 f-flex">
                    <p style={font} className="w-100 mb-0 align-self-end">
                      {(
                        (+(
                          +shop[`CENA_NETTO_${el.GABARYT}`].toFixed(2) +
                          0.23*(+shop[`CENA_NETTO_${el.GABARYT}`].toFixed(2))  
                        ).toFixed(2) - znizka*(+(
                          +shop[`CENA_NETTO_${el.GABARYT}`].toFixed(2) +
                          0.23*(+shop[`CENA_NETTO_${el.GABARYT}`].toFixed(2))  
                        ).toFixed(2)) )
                        
                      ).toFixed(2)}{' '}
                      zł
                    </p>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Osobny komponent */}
          {}
          <div className="row text-center ">
            <div className="col-5 d-flex pe-0 text-center  justify-content-end ">
              <div className="col-5 border border-dark  d-flex border-top-0 bg-primary text-white">
                <p
                  style={font}
                  className="w-100 mb-0 align-self-end border-top-0 fw-bold"
                >
                  RAZEM{' '}
                </p>
              </div>
              <div className="col border border-dark border-start-0 border-top-0 d-flex bg-primary text-white ">
                <p style={font} className="w-100 mb-0 align-self-end fw-bold">
                  {shop.RAZEM}{' '}
                </p>
              </div>
              <div className="col border border-dark border-start-0 border-end-0  border-top-0 d-flex bg-primary text-white">
                <p style={font} className="w-100 mb-0 align-self-end fw-bold">
                  {' '}
                  x
                </p>
              </div>
            </div>
            <div className="col d-flex ps-0">
              <div className="col-3 border border-dark  border-top-0 d-flex bg-primary text-white">
                <p style={font} className="w-100 mb-0 align-self-end fw-bold">
                  x{' '}
                </p>
              </div>
              <div className="col-1 border border-dark border-start-0 border-top-0 d-flex bg-primary text-white">
                <p style={font} className="w-100 mb-0 align-self-end fw-bold">
                  23%{' '}
                </p>
              </div>
              <div className="col border border-dark border-start-0 border-top-0 d-flex bg-primary text-white">
                <p
                  style={font}
                  className="w-100 mb-0 align-self-end text-wrap  fw-bold"
                >
                  {(
                    +(shop.CENA_CALOSC * 0.23).toFixed(2) -
                    znizka * +(shop.CENA_CALOSC * 0.23).toFixed(2)
                  ).toFixed(2)}{' '}
                  zł
                </p>
              </div>

              <div className="col border border-dark border-start-0  border-top-0 d-flex bg-primary text-white">
                <p style={font} className="w-100 mb-0 align-self-end fw-bold">
                  {(
                    +shop.CENA_CALOSC.toFixed(2) -
                    znizka * +shop.CENA_CALOSC.toFixed(2)
                  ).toFixed(2)}{' '}
                  zł
                </p>
              </div>
              <div className="col-3 border border-dark border-start-0 border-top-0 f-flex bg-primary text-white">
                <p style={font} className="w-100 mb-0 align-self-end fw-bold">
                  {(
                    +(
                      +shop.CENA_CALOSC.toFixed(2) +
                      +shop.CENA_CALOSC.toFixed(2) * 0.23
                    ).toFixed(2) -
                    znizka *
                      +(
                        +shop.CENA_CALOSC.toFixed(2) +
                        +shop.CENA_CALOSC.toFixed(2) * 0.23
                      ).toFixed(2)
                  ).toFixed(2)}{' '}
                  zł
                </p>
              </div>
            </div>
          </div>
          {/* Dopłata za produkt szklany */}
          <div className="row text-center pb-3 ">
            <div className="col-5 d-flex pe-0 text-center  justify-content-end ">
              <div className="col-5 border border-dark  d-flex border-top-0">
                <p
                  style={font}
                  className="w-100 mb-0 align-self-end border-top-0"
                >
                  dopłata za produkt szklany
                </p>
              </div>
              <div className="col border border-dark border-start-0 border-top-0 d-flex ">
                <p style={font} className="w-100 mb-0 align-self-end">
                  {shop.SZKLO}{' '}
                </p>
              </div>
              <div className="col border border-dark border-start-0 border-end-0  border-top-0 d-flex">
                <p style={font} className="w-100 mb-0 align-self-end">
                  {' '}
                  {(
                    +szklo.NETTO_1.toFixed(2) 
                  ).toFixed(2)}{' '}
                  zł
                </p>
              </div>
            </div>
            <div className="col d-flex ps-0">
              <div className="col-3 border border-dark  border-top-0 d-flex">
                <p style={font} className="w-100 mb-0 align-self-end">
                  {' '}
                  {(
                    +(+szklo.NETTO_1 + 0.23 * szklo.NETTO_1).toFixed(2) 
                  ).toFixed(2)}{' '}
                  zł{' '}
                </p>
              </div>
              <div className="col-1 border border-dark border-start-0 border-top-0 d-flex">
                <p style={font} className="w-100 mb-0 align-self-end">
                  23%{' '}
                </p>
              </div>
              <div className="col border border-dark border-start-0 border-top-0 d-flex ">
                <p
                  style={font}
                  className="w-100 mb-0 align-self-end text-wrap "
                >
                  {(
                    +(0.23 * shop.CENA_NETTO_SZKLO).toFixed(2) 
                  ).toFixed(2)}{' '}
                  zł
                </p>
              </div>

              <div className="col border border-dark border-start-0  border-top-0 d-flex">
                <p style={font} className="w-100 mb-0 align-self-end ">
                  {(
                    +shop.CENA_NETTO_SZKLO.toFixed(2) 
                  ).toFixed(2)}{' '}
                  zł
                </p>
              </div>
              <div className="col-3 border border-dark border-start-0 border-top-0 f-flex">
                <p style={font} className="w-100 mb-0 align-self-end">
                  {(
                    +(
                      +shop.CENA_NETTO_SZKLO.toFixed(2) +
                      0.23 * shop.CENA_NETTO_SZKLO
                    ).toFixed(2) 
                    
                  ).toFixed(2)}{' '}
                  zł
                </p>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return null;
};

export default Raport;
