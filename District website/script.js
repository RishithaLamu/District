function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  firebase.auth().signInWithEmailAndPassword(email, password)
    .then(() => {
      window.location.href = "districts.html";
    })
    .catch((error) => {
      alert("Login failed: " + error.message);
    });
}

function goToDetails(district, info) {
  localStorage.setItem("districtName", district);
  localStorage.setItem("districtInfo", info);
  window.location.href = "details.html";
}

function saveTruckData() {
  const db = firebase.firestore();
  const district = localStorage.getItem("districtName");

  const truckNumber = document.getElementById("truckNumber").value;
  const driverName = document.getElementById("driverName").value;
  const loadType = document.getElementById("loadType").value;

  if (!truckNumber || !driverName) {
    alert("Please fill all fields!");
    return;
  }

  db.collection("trucks").add({
    district,
    truckNumber,
    driverName,
    loadType,
    timestamp: new Date()
  }).then(() => {
    alert("Truck data saved!");
    loadTrucks();
  });
}

function loadTrucks() {
  const db = firebase.firestore();
  const district = localStorage.getItem("districtName");
  const list = document.getElementById("truckList");
  list.innerHTML = "";

  db.collection("trucks").where("district", "==", district)
    .get()
    .then(snapshot => {
      snapshot.forEach(doc => {
        const data = doc.data();
        const li = document.createElement("li");
        li.textContent = `${data.truckNumber} - ${data.driverName} (${data.loadType})`;
        list.appendChild(li);
      });
    });
}

if (window.location.pathname.includes("details.html")) {
  document.getElementById("districtName").innerText = 
    "District: " + localStorage.getItem("districtName");
  document.getElementById("districtInfo").innerText = 
    localStorage.getItem("districtInfo");
  loadTrucks();
}
