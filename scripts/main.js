const baseServerURL = `http://localhost:${
  import.meta.env.REACT_APP_JSON_SERVER_PORT
}`;

const baseFrontendURL = `http://localhost:${
  import.meta.env.REACT_APP_FRONTEND_SERVER_PORT
}`;

const pitchURL = `${baseServerURL}/users`;

document
  .getElementById("adminpagebutton")
  .addEventListener("click", function () {
    window.location.href = `${baseFrontendURL}/admin.html`;
  });

document
  .getElementById("userpagebutton")
  .addEventListener("click", function () {
    window.location.href = `${baseFrontendURL}/user.html`;
  });

const loginPageButton = document.getElementById("loginpagebutton");
if (loginPageButton) {
  loginPageButton.addEventListener("click", function () {
    window.location.href = `${baseFrontendURL}/login.html`;
  });
}

const datapagebutton = document.getElementById("datapagebutton");
if (datapagebutton) {
  datapagebutton.addEventListener("click", function () {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = `${baseFrontendURL}/login.html`;
    } else {
      window.location.href = `${baseFrontendURL}/data.html`;
    }
  });
}

const reportspagebutton = document.getElementById("reportspagebutton");
if (reportspagebutton) {
  reportspagebutton.addEventListener("click", function () {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = `${baseFrontendURL}/login.html`;
    } else {
      window.location.href = `${baseFrontendURL}/reports.html`;
    }
  });
}

const formUser = document.getElementById("userForm");

if (formUser) {
  formUser.addEventListener("submit", function (event) {
    event.preventDefault();

    const formData = new FormData(formUser);
    const jsonData = {};

    for (let [key, value] of formData.entries()) {
      jsonData[key] = value;
    }

    fetch(pitchURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(jsonData),
    })
      .then((response) => {
        if (response.ok) {
          alert("successfully registered");
          formUser.reset();
        } else {
          alert("Something went Wrong.");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Please try again");
      });
  });
}

const formLogin = document.getElementById("loginForm");
if (formLogin) {
  formLogin.addEventListener("submit", function (event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    fetch("https://reqres.in/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: username,
        password: password,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.token) {
          localStorage.setItem("token", data.token);
          alert("Login successful!");
          window.location.href = "data.html";
        } else {
          alert("Login failed. Invalid username or password.");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("An error occurred. Please try again.");
      });
  });
}

let currentPage = 1;
const usersPerPage = 5;

function displayUsers(users) {
  console.log("current pae", currentPage);
  const userCards = document.getElementById("userCards");
  if (userCards) {
    userCards.innerHTML = "";
  }

  const start = (currentPage - 1) * usersPerPage;
  const end = start + usersPerPage;
  const displayedUsers = users.slice(start, end);

  let cardList = document.createElement("div");
  cardList.className = "card-list";

  displayedUsers.forEach((item, index) => {
    const card = document.createElement("div");
    card.className = "card";
    card.dataset.key = item.id;
    card.dataset.id = item.id;

    const cardImg = document.createElement("div");
    cardImg.className = "card-img";
    const imgElement = document.createElement("img");
    imgElement.src =
      "https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg?size=626&ext=jpg&ga=GA1.2.1892461840.1688366714&semt=ais";
    imgElement.alt = "image";
    cardImg.appendChild(imgElement);
    card.appendChild(cardImg);

    const cardBody = document.createElement("div");
    cardBody.className = "card-body";

    const cardName = document.createElement("h4");
    cardName.className = "card-name";
    cardName.textContent = item.name;
    cardBody.appendChild(cardName);

    const cardAge = document.createElement("p");
    cardAge.className = "card-age";
    cardAge.innerHTML = item.age;
    cardBody.appendChild(cardAge);

    const cardPlace = document.createElement("p");
    cardPlace.className = "card-place";
    cardPlace.innerHTML = item.place;
    cardBody.appendChild(cardPlace);

    const cardBatchName = document.createElement("p");
    cardBatchName.className = "card-batchname";
    cardBatchName.innerHTML = item.batch_name;
    cardBody.appendChild(cardBatchName);

    const cardProfession = document.createElement("p");
    cardProfession.className = "card-profession";
    cardProfession.innerHTML = item.profession;
    cardBody.appendChild(cardProfession);

    const linkElement = document.createElement("a");
    linkElement.dataset.id = item.id;
    linkElement.className = "card-link";
    linkElement.href = "#";
    linkElement.textContent = "Edit";
    cardBody.appendChild(linkElement);

    const buttonElement = document.createElement("button");
    buttonElement.dataset.id = item.id;
    buttonElement.className = "card-button";
    buttonElement.textContent = "Delete";
    buttonElement.addEventListener("click", function () {
      deleteUser(item.id);
    });
    cardBody.appendChild(buttonElement);

    card.appendChild(cardBody);

    cardList.appendChild(card);
  });
  if (userCards) {
    userCards.appendChild(cardList);
    document.getElementById("currentPage").textContent = currentPage;
  }
}

function fetchData(query) {
  let newUrl = pitchURL;
  if (query) {
    newUrl = `${pitchURL}${query}`;
  }
  fetch(newUrl)
    .then((response) => response.json())
    .then((users) => {
      console.log("data", users);
      displayUsers(users);
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}

document.addEventListener("DOMContentLoaded", fetchData());

const prevButton = document.getElementById("prevButton");
if (prevButton) {
  prevButton.addEventListener("click", function () {
    let newUrl = pitchURL;
    fetch(newUrl)
      .then((response) => response.json())
      .then((users) => {
        console.log("data", users);
        if (currentPage > 1) {
          currentPage--;
          displayUsers(users);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  });
}

const nextButton = document.getElementById("nextButton");
if (nextButton) {
  nextButton.addEventListener("click", function () {
    let newUrl = pitchURL;
    fetch(newUrl)
      .then((response) => response.json())
      .then((users) => {
        console.log("data", users);
        const totalPages = Math.ceil(users.length / usersPerPage);
        console.log(currentPage, totalPages);
        if (currentPage < totalPages) {
          currentPage++;
          displayUsers(users);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  });
}

function generateReport() {
  fetch(pitchURL)
    .then((response) => response.json())
    .then((users) => {
      console.log("data", users);
      const totalUsers = users.length;
      const totalStudents = users.filter(
        (user) => user.profession === "student"
      ).length;
      const totalProfessionals = users.filter(
        (user) => user.profession !== "student"
      ).length;
      const totalAge = users.reduce((sum, user) => sum + Number(user.age), 0);
      const averageAge = totalAge / totalUsers;

      document.getElementById("totalUsers").textContent = totalUsers;
      document.getElementById("totalStudents").textContent = totalStudents;
      document.getElementById("totalProfessionals").textContent =
        totalProfessionals;
      document.getElementById("averageAge").textContent = averageAge.toFixed(2);
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}

document.addEventListener("DOMContentLoaded", generateReport());
