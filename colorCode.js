const {
  openBrowser,
  goto,
  waitFor,
  write,
  into,
  textBox,
  focus,
  click,
  $,
  closeBrowser,
} = require('taiko');

const login = async (number, password) => {
  try {
    await waitFor(textBox({ name: 'userNumber' })); // Wait for the input box to appear
    await write(number, into(textBox({ name: 'Email or username' })));
    await waitFor(1000);

    await waitFor(textBox({ placeholder: 'Password' })); // Wait for password box
    await write(password, into(textBox({ placeholder: 'Password' })));
  } catch (error) {
    console.error('Error during login:', error);
    throw error;
  }
};

const clickLogin = async () => {
  try {
    waitFor(5000)
    await waitFor('Log in'); // Wait for the 'Log in' button
    await click('Log in');
  } catch (error) {
    console.error('Error during login click:', error);
    throw error;
  }
};

const clickWinGo = async () => {
  try {
    await waitFor(2000); // Allow the page to load
    await waitFor('Win Go'); // Wait for the 'Win Go' button
    await click('Win Go');
  } catch (error) {
    console.error('Error during Win Go click:', error);
    throw error;
  }
};

const placeBet = async () => {
  try {
    await waitFor(2000); // Wait for the betting options to load
    const randomNum = Math.floor(Math.random() * 2);

    if (randomNum === 0) {
      await waitFor($('.Betting__C-foot-s')); // Wait for small bet button
      await click($('.Betting__C-foot-s'));
    } else {
      await waitFor($('.Betting__C-foot-b')); // Wait for big bet button
      await click($('.Betting__C-foot-b'));
    }

    await waitFor($('Betting__Popup-foot-s')); // Wait for bet confirmation button
    await click($('Betting__Popup-foot-s'));
  } catch (error) {
    console.error('Error during betting:', error);
    throw error;
  }
};

const automation = async () => {
  try {
    await openBrowser({ headless: false });
    await goto('https://okwin.game/#/main');
    await waitFor(2000); // Ensure the page loads
    await login('9381093006', 'umaryas123');
    await clickLogin();
    // await clickWinGo();
    // await placeBet();
  } catch (error) {
    console.error('An error occurred during automation:', error);
  } finally {
    await closeBrowser();
  }
};

automation();
