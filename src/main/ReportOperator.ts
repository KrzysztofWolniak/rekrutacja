/* eslint-disable prettier/prettier */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-async-promise-executor */



const puppeteer = require('puppeteer');



export default class ReportOperator {
  static async generatePDF(html: string) {
    return new Promise(async (resolve,reject)=>{
      const browser = await puppeteer.launch({ headless: true });
      const page = await browser.newPage();
      await page.setContent(html);
      await page.emulateMediaType("screen");
      const pdfConfig = {
        format: "A4",
        printBackground: true,
      };
      const pdf = await page.pdf(pdfConfig);
      await browser.close();
      resolve(pdf)
    })
    
  }

  static async generateAllPDF(arrayOfHtml:Array<any>) {
    return new Promise<any[]>(async (resolve,reject)=>{
      const arrayOfPdf:any[]=[]
      console.time("start")
      const browser = await puppeteer.launch({ headless: true });
      for(const element of arrayOfHtml){
        const page = await browser.newPage();
        await page.setContent(element.html);
        await page.emulateMediaType("screen");
        const pdfConfig = {
          format: "A4",
          printBackground: true,
        };
        const pdf = await page.pdf(pdfConfig);
        arrayOfPdf.push({buffer:pdf, name:element.name})
       
      }
      await browser.close();
     console.timeEnd("start")
      resolve(arrayOfPdf)
    })
    
  }
}
