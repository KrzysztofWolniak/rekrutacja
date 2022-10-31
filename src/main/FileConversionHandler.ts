/* eslint-disable prettier/prettier */
/* eslint-disable consistent-return */
/* eslint-disable array-callback-return */
/* eslint-disable no-restricted-globals */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable no-underscore-dangle */
/* eslint-disable global-require */
import React, { Component } from 'react'
import { Gabaryty, Przedzialy } from 'renderer/pages/AddFile';

export default class FileConversionHandler {
    static async handleListOfOrdersConvertion(arg: any){
        return new Promise<Array<any>>((resolve, reject) => {
           
            console.time('Przetwarzanie excela na jsona');
        
            const XLSX = require('xlsx');
            const workbook = XLSX.read(arg);
            const workSheets: any = {};
            // eslint-disable-next-line no-restricted-syntax
            for (const sheetName of workbook.SheetNames) {
              workSheets[sheetName] = XLSX.utils.sheet_to_json(
                workbook.Sheets[sheetName]
              );
            }
            console.timeEnd('Przetwarzanie excela na jsona');
            if(workSheets.Zlecenia){
                console.time('Tworzenie bazy danych');
                // event.reply('file', JSON.stringify(workSheets.Zlecenia));
            const sklep = {
                Name: '',
                KSIAZKA: 0,
                XS: 0,
                S: 0,
                M: 0,
                L: 0,
                XL: 0,
                SZKLO: 0,
                ILOSC_ZAMOWIEN: new Set(),
                ZNIZKA: 0,
              };
          
              const db: any = {
                sklepy: [],
              };
              console.timeEnd('Tworzenie bazy danych');
              console.time('Zdobywanie nazwy sklepow');
              workSheets.Magazyn.forEach((obj: any) => {
                const cloneOfsklep = JSON.parse(JSON.stringify(sklep));
                cloneOfsklep.Name = obj.Departament;
                cloneOfsklep.ILOSC_ZAMOWIEN = new Set();
                db.sklepy.push(cloneOfsklep);
              });
              
              console.timeEnd('Zdobywanie nazwy sklepow');
              console.time('Glowny algorytm');
          
              workSheets.Zlecenia.forEach((obj: any) => {
                obj.gabaryt = obj.gabaryt.split('_');
                const test = db.sklepy.find((x: any) => {
                  return x.Name === obj.Departament;
                });
                if (test !== undefined) {
                  if (obj.gabaryt.length === 2) {
                    test[obj.gabaryt[0]] += obj.quantity;
                    test[obj.gabaryt[1]] += obj.quantity;
                    test.ILOSC_ZAMOWIEN.add(obj.order_id);
                  } else {
                    test[obj.gabaryt[0]] += obj.quantity;
                    test.ILOSC_ZAMOWIEN.add(obj.order_id);
                  }
                }
              });
              db.sklepy.forEach((obj: any) => {
                obj.ILOSC_ZAMOWIEN = obj.ILOSC_ZAMOWIEN.size;
              });
             
              console.timeEnd('Glowny algorytm');
              resolve(db);
            }
            else{
                reject
            }
        
        
            
          });
    }
    
    static async handlePriceListConvertion(arg:any): Promise<Array<Przedzialy | Gabaryty>>{
        return new Promise<Array<Przedzialy & Gabaryty>>((resolve, reject) => {
            const PriceListArray: Array<Przedzialy & Gabaryty> = [];
            console.time('Przetwarzanie na JSONA');
            
            const XLSX = require('xlsx');
            const workbook = XLSX.read(arg);
            const workSheets: any = {};
            // eslint-disable-next-line no-restricted-syntax
            for (const sheetName of workbook.SheetNames) {
              workSheets[sheetName] = XLSX.utils.sheet_to_json(
                workbook.Sheets[sheetName]
              );
            }
            console.timeEnd('Przetwarzanie na JSONA');
            
            const SetOfDimensions: Set<any> = new Set();
            
            let StartCopying = false;
            if(workSheets[`Cennik fulfilment`]){
                console.time('Dodawanie gabarytow i przedziałow');
                workSheets['Cennik fulfilment'].forEach((obj: any) => {
                    
                    if (obj.__EMPTY_2) {
                      obj.__EMPTY_2.toString().includes('od 1')
                        ? SetOfDimensions.add(obj)
                        : null;
                    }
              
                    if (obj.__EMPTY) {
                      123;
                      if (obj.__EMPTY.toString().includes('kompletacja')) {
                        StartCopying = true;
                      } else if (obj.__EMPTY.toString().includes('*')) {
                        StartCopying = false;
                      }
                    }
                    StartCopying ? SetOfDimensions.add(obj) : null;
                    if (obj.__EMPTY_1) {
                      if (obj.__EMPTY_1.toString().includes('szk')) {
                        SetOfDimensions.add(obj);
                      }
                    }
                  });
                  console.timeEnd('Dodawanie gabarytow i przedziałow');
                  console.time('Tworzenie listy obiektow');
                  if (SetOfDimensions !== undefined) {
                    const aaa = Array.from(SetOfDimensions);
              
                    aaa.shift();
                    const DimensionsObject: any = {};
                    for (let index = 1; index < Object.keys(aaa[0]).length + 1; index+=1) {
                      DimensionsObject[`PRZEDZIAL_${index}`] = aaa[0][`__EMPTY_${index * 2}`]
                        .split(' ')
                        .filter((el: any) => {
                          if (!isNaN(el)) {
                            return el;
                          }
                        });
              
                      DimensionsObject[`PRZEDZIAL_${index}`] = DimensionsObject[
                        `PRZEDZIAL_${index}`
                      ].map((el: string) => {
                        return Number(el);
                      });
                    }
                    PriceListArray.push(DimensionsObject);
                    aaa.forEach((el: any) => {
                      const ArrayElement: any = {};
                      if (el.__EMPTY_1) {
                        if (el.__EMPTY) {
                          delete el.__EMPTY;
                        }
              
                        const elementDemension = el.__EMPTY_1.toString().split('\n');
              
                        ArrayElement.GABARYT = elementDemension[0].split('\r').join('');
              
                        if (elementDemension[0].split('\r').join().includes('szk')) {
                          ArrayElement.GABARYT = 'SZKLO';
                        }
              
                        // el.__EMPTY_1 = elementDemension[0];
                        for (let index = 1; index < Object.keys(el).length / 2; index+=1) {
                          ArrayElement[`NETTO_${index}`] = el[`__EMPTY_${index * 2}`];
                          ArrayElement[`BRUTTO_${index}`] = el[`__EMPTY_${index * 2 + 1}`];
                        }
                        PriceListArray.push(ArrayElement);
                      }
                    });
                    console.timeEnd('Tworzenie listy obiektow');
                    
                  }
                  resolve(PriceListArray);
            }
            else{
                reject
            }
            
          });
    }
}
