const inquirer = require("inquirer");
const { openBrowser, goto, write, into, textBox, click, dropDown, evaluate, closeBrowser, waitFor, clear } = require('taiko');

// Function to extract Grand Total, Student Name, and the official Result status
const getResultDetails = async () => {
    return await evaluate(() => {
        const tableHeaders = Array.from(document.querySelectorAll('th'));

        let grandTotal = 'N/A';
        // Find the 'Grand Total' header and get its sibling content
        const grandTotalHeader = tableHeaders.find((th) =>
            th.textContent.includes('Grand Total')
        );
        if (grandTotalHeader && grandTotalHeader.nextElementSibling) {
            grandTotal = grandTotalHeader.nextElementSibling.textContent.trim();
        }

        let studentName = 'N/A';
        // Attempt to find the student's name. Common headers could be 'Name', 'Student Name', 'Candidate Name', etc.
        const nameHeader = tableHeaders.find((th) =>
            th.textContent.includes('Name') || th.textContent.includes('Student Name')
        );
        if (nameHeader && nameHeader.nextElementSibling) {
            studentName = nameHeader.nextElementSibling.textContent.trim();
        } else {
            // Fallback: If not found in headers, try to find a common element for student name.
            // This is a generic fallback; you might need to adjust this selector based on the actual page structure.
            const studentNameElement = document.querySelector('.student-name-class') || document.querySelector('#studentNameId');
            if (studentNameElement) {
                studentName = studentNameElement.textContent.trim();
            }
        }

        let officialResult = 'N/A';
        // Find the 'Result' header and get its sibling content
        const resultHeader = tableHeaders.find((th) =>
            th.textContent.includes('Result')
        );
        if (resultHeader && resultHeader.nextElementSibling) {
            officialResult = resultHeader.nextElementSibling.textContent.trim();
        }

        // Determine a simplified status (Pass/Fail) based on the official result
        let status = 'Unknown'; // Default to unknown
        if (officialResult.toUpperCase() === 'PROMOTED' || officialResult.toUpperCase() === 'F' || officialResult.toUpperCase() === 'FAILED') {
            status = 'Fail';
        } else if (officialResult.toUpperCase() === 'PASS' || officialResult.toUpperCase() === 'P') {
            status = 'Pass';
        }


        return { grandTotal, studentName, officialResult, status };
    });
};

// Function to display the extracted results including the official result and simplified status
const displayResult = async (pin) => {
    const { grandTotal, studentName, officialResult, status } = await getResultDetails();
    console.log(`${pin} : ${studentName} : ${grandTotal} : ${status}`);
};

// Selects the specified semester from the dropdown
const selectSemester = async (semester) => {
    await dropDown({ id: 'grade2' }).select(semester);
}

// Fills the pin number into the designated text box
const fillPinNumber = async (pinNumber) => {
    await write(pinNumber, into(textBox({ id: 'aadhar1' })));
}

// Generates a list of potential pin numbers based on branch, admission year, and college code
const getPinNumbers = (branch, admissionYear, collegeCode = '155') => {
    const pinNumbers = [];
    for (let id = 1; id <= 66; id++) {
        const paddedId = id < 10 ? `0${id}` : `${id}`;
        pinNumbers.push(`${admissionYear}${collegeCode}-${branch}-0${paddedId}`);
    }
    return pinNumbers;
};

// Opens the result page in a headless browser
const openResultPage = async (url) => {
    await openBrowser({ headless: true });
    await goto(url);
};

// Main function to get results for all generated pin numbers
const getResults = async ({ resultLink, semester, admissionYear, branch }) => {
    try {
        await openResultPage(resultLink);
        const pinNumbers = getPinNumbers(branch, admissionYear);
        for (const pin of pinNumbers) {
            await fillPinNumber(pin);
            await selectSemester(semester);
            await click('submit');
            try {
                await displayResult(pin);
                await click('back'); // Navigate back to the input form for the next pin
            } catch (error) {
                // If an error occurs (e.g., result not found), clear the input and proceed
                await clear(textBox({ id: 'aadhar1' }));
                // Depending on the page behavior, you might need to click 'back' here too
                // or ensure the form is ready for the next input.
                // If 'back' is not always available after an error, you might need a more robust navigation strategy.
            }
        }
    } catch (error) {
        console.error('An unhandled error occurred during automation:', error);
    } finally {
        await closeBrowser(); // Ensure browser is closed even if errors occur
    }
};

// Prompts the user for necessary inputs using Inquirer.js
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
            default: '5SEM',
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
            choices: ['CM', 'EC', 'M', 'EE','AIM'],
            default: 'EC',
        },
    ]);
};

// Starts the automation process by getting inputs and then fetching results
const startAutomation = async () => {
    const inputs = await getInputs();
    await getResults(inputs);
};

// Execute the automation
startAutomation();
