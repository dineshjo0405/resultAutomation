const inquirer = require("inquirer");

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
  console.log('automation started...');
  const inputs = await getInputs();
  console.log(inputs)
};

startAutomation();
