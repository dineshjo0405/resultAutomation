const inquirer = require("inquirer");
const { openBrowser, goto, write, into, textBox, click, dropDown, evaluate, closeBrowser, waitFor } = require('taiko');

const getTableHeaderData = async (label) => {
  return await evaluate((label) => {
    const tableHeaders = document.querySelectorAll('th');
    const cell = [...tableHeaders].find((th) =>
      th.textContent.includes(label)
    );
    return cell.nextElementSibling.textContent;
  }, label);
};

const displayResult = async (pin) => {
  const grandTotal = await getTableHeaderData('Grand Total');
  console.log(pin, grandTotal);
};

const selectSemester = async (semester) => {
  await dropDown({ id: 'grade2' }).select(semester);
}

const fillPinNumber = async (pinNumber) => {
  await write(pinNumber, into(textBox({ id: 'aadhar1' })));
}

const getPinNumbers = (branch, admissionYear, collegeCode = '101') => {
  const pinNumbers = [];
  for (let id = 1; id <= 66; id++) {
    const paddedId = id < 10 ? `0${id}` : `${id}`;
    pinNumbers.push(`${admissionYear}${collegeCode}-${branch}-0${paddedId}`);
  }
  return pinNumbers;
};

const openResultPage = async (url) => {
  await openBrowser({ headless: true });
  await goto(url);
};

const getResults = async ({ resultLink, semester, admissionYear, branch }) => {
  try {
    await openResultPage(resultLink);
    const pinNumbers = getPinNumbers(branch, admissionYear);
    for (const pin of pinNumbers) {
      await fillPinNumber(pin);
      await selectSemester(semester);
      await click('submit');
      try {
        displayResult(pin);
        await click('back');
      } catch (error) {
        await clear(textBox({ id: 'aadhar1' }));
      }
    }
  } catch (error) {
    throw new Error('Error occurred during automation.');
  } finally {
    closeBrowser()
  }
};

const getInputs = async () => {
  return inquirer.prompt([
    {
      type: 'input',
      name: 'resultLink',
      message: 'Enter the link to result page:',
      default: 'https://sbtet.ap.gov.in/APSBTET/results.do',
    },
    {
      type: 'list',
      name: 'semester',
      message: 'Which semester do you want to check results for?',
      choices: ['1YEAR', '3SEM', '4SEM', '5SEM', '6SEM'],
      default: '4SEM',
    },
    {
      type: 'input',
      name: 'admissionYear',
      message: 'What is your admission year?',
      default: '22',
    },
    {
      type: 'list',
      name: 'branch',
      message: 'Which branch are you following?',
      choices: ['CM', 'EC', 'M', 'EE'],
      default: 'CM',
    },
  ]);
};

const startAutomation = async () => {
  const inputs = await getInputs();
  getResults(inputs);
};

startAutomation();
