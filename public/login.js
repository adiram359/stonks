const loginButton = document.getElementById('loginButton');
const registerButton = document.getElementById('registerButton');
const loginBar = document.getElementById('userNameBar');
const registerBar = document.getElementById('registerBar')
const status = document.getElementById('status');
const statusDiv = document.getElementById('statusDiv');
loginBar.onfocus = () => {
  loginBar.value = "";
  loginBar.style.color = "black";
}
registerBar.onfocus = () => {
  registerBar.value = "";
  registerBar.style.color = "black";
}
loginButton.onclick = async () => {
  const data = {
    username: loginBar.value,
  }
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data),
  };
  const response = await fetch('/validateUser', options);
  const responseJSON = await response.json();
  if (responseJSON.isValid) {
    var value1 = data.username;
    var queryString =`?para1=${data.username}`;
    window.location.href = `dashboard.html${queryString}`;
  } else {
    loginBar.style.color = "#E74C3C";
    loginBar.value = `No username ${loginBar.value} found`;
  }
}

registerButton.onclick = async () => {
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({username:registerBar.value}),
  };
  const response = await fetch('/createUser', options)
  const responseJSON = await response.json()
  if (responseJSON.availible) {
    registerBar.style.color = "#2ECC71";
    registerBar.value = `Success, user ${registerBar.value} created!`;
  } else {
    registerBar.style.color = "#E74C3C";
    registerBar.value = `Username ${registerBar.value} is taken`}
}
