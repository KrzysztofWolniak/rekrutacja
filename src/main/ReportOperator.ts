/* eslint-disable prettier/prettier */
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
}
