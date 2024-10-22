const inquirer = require("inquirer");
const { openBrowser, goto, write, into, textBox } = require('taiko');

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
  await openBrowser({ headless: false });
  await goto(url);
};

const getResults = async ({ resultLink, semester, admissionYear, branch }) => {
  await openResultPage(resultLink);
  const pinNumbers = getPinNumbers(branch, admissionYear);
  pinNumbers.forEach(async pin => {
    await fillPinNumber(pin);
  })
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
