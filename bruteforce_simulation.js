const readline = require("readline");
// const chalk = require('chalk');
require("dotenv").config();
const { Builder, Browser, By,} = require("selenium-webdriver");
const fs = require("fs");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let key = "";
let isBackEnd = "";

const question = (pertanyaan) => {
  return new Promise((resolve, reject) => {
    rl.question(`${pertanyaan} : `, (cb) => {
      resolve(cb);
    });
  });
};
const main = async () => {
  key = await question("Masukan Password");
  isBackEnd = await question("isBackEnd");
}

key = process.env.KEY;
isBackEnd = process.env.isBackEnd;


(async function example() {
    const readRock = fs.readFileSync("rock4.txt", "utf-8");
    const arrayData = readRock.split("\n");
    let hasil = "";
    const run = true;
    let i = 0;
    let driver = await new Builder().forBrowser(Browser.CHROME).build();
    const curentPath = process.cwd();
    try {
      await driver.get(
        `${curentPath}/index.html`
      );
      await driver.manage().window().maximize();
      await driver.findElement(By.id("username")).sendKeys("admin");
      // const pw = await br.BruteForce(character);
      let pw = arrayData[i];
      if (isBackEnd == "true") {
        while (pw != key) {
          i++;
          pw = arrayData[i];
          console.log(i, arrayData[i]);
          if (pw == key) {
            console.log("\nGotchaa!! Password kamu adalah : " + pw);
            await driver.sleep(2000);
          }
        }
      }
      await driver.findElement(By.id("password")).sendKeys(pw);
      await driver.executeScript(`
    const submit = document.querySelector('a');
    const pass = document.querySelector('#password');
    submit.addEventListener('click', (a) => {
      if (pass.value !== '${key}') {
        alert("Wrong Password!");
        a.preventDefault();
      }
    });
    `);
      await driver.sleep(1000);
      await driver.findElement(By.id("submit")).click();
      try {
        do {
          // await driver.sleep(1000);
          await driver.switchTo().alert().accept();
          await driver.findElement(By.id("password")).clear();
          const pw = arrayData[i];
          console.log(i, arrayData[i]);
          await driver.findElement(By.id("password")).sendKeys(pw);
          await driver.findElement(By.id("submit")).click();
          hasil = "";
          if (pw == key) {
            console.log("\nGotchaa!! Password kamu adalah : " + pw);
            await driver.sleep(2000);
            run = false;
          } else {
            i++;
          }
        } while (run);
      } catch (err) {}
      await driver.sleep(10000);
      rl.close();
    } finally {
      await driver.quit();
    }
  })();
// console.time("execute");
// console.timeEnd("execute");
