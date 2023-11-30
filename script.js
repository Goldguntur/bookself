const rak = [];

const PROGRAM_EVENT = "event-program";
SAVED_DATA = "saved-book";
STORAGE_EVENT = "buku-apps";

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("format");
  const waktuSelesai = document.getElementById("waktu");

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    tambahBuku();
    waktuSelesai.value = "";
  });
});

const checkKomplit = document.getElementById("tanda-sudah-dibaca");
const divDate = document.querySelector(".date");
const checkKed = document.querySelector("#bookSubmit");

checkKomplit.addEventListener("change", function () {
  if (checkKomplit.checked == true) {
    divDate.removeAttribute("hidden");
    checkKed.innerHTML = `Masukkan Buku ke rak <span> selesai dibaca</span>`;
  } else {
    divDate.setAttribute("hidden", true);
    checkKed.innerHTML = `Masukkan Buku ke rak <span>Belum selesai dibaca</span>`;
  }
});

function tambahBuku() {
  const txtNama = document.getElementById("nama").value;
  const txtPenulis = document.getElementById("penulis").value;
  const txtRilis = parseInt(document.getElementById("rilis").value);
  const waktuSelesai = document.getElementById("waktu").value;
  const newCheck = document.getElementById("tanda-sudah-dibaca").checked;

  const uncompletedBook = document.querySelector(".uncompleted");
  const completedBook = document.querySelector(".completed");

  const waktuBaRu = waktuBaru();

  const objekBuku = buatBuku(waktuBaRu, txtNama, txtPenulis, txtRilis, waktuSelesai, newCheck);

  if (newCheck == true) {
    completedBook.append(objekBuku);
  } else {
    uncompletedBook.append(objekBuku);
  }

  rak.push(objekBuku);
  saveStorage();
  document.dispatchEvent(new Event(PROGRAM_EVENT));
}

function waktuBaru() {
  return +new Date();
}

function buatBuku(id, title, author, year, komplit, isComplete) {
  return {
    id,
    title,
    author,
    year,
    komplit,
    isComplete,
  };
}

document.addEventListener(PROGRAM_EVENT, function () {
  const uncompletedBook = document.querySelector(".uncompleted");
  uncompletedBook.innerHTML = "";

  const completedBook = document.querySelector(".completed");
  completedBook.innerHTML = "";
  for (const rakBuku of rak) {
    const barangBuku = buku(rakBuku);
    if (!rakBuku.isComplete) uncompletedBook.append(barangBuku);
    else completedBook.append(barangBuku);
  }
});

function buku(objekBuku) {
  const judul = document.createElement("h3");
  judul.innerText = objekBuku.title;

  const author = document.createElement("h4");
  author.innerText = `penulis: ${objekBuku.author}`;

  const rilis = document.createElement("p");
  rilis.innerText = `rilis: ${objekBuku.year}`;

  let sudahDibaca = document.createElement("p");
  sudahDibaca.innerText = objekBuku.komplit;

  const contain = document.createElement("div");
  contain.classList.add("konten");
  contain.append(judul, author, rilis, sudahDibaca);
  contain.setAttribute("id", `buku-${objekBuku.id}`);

  if (objekBuku.isComplete) {
    const btnCmplt = document.createElement("button");
    btnCmplt.innerText = "belum dibaca";
    btnCmplt.classList.add("button-mundur");
    btnCmplt.addEventListener("click", function () {
      bukuBLmDibaca(objekBuku.id);
    });
    const hapusBtn = document.createElement("button");
    hapusBtn.innerText = "hapus";
    hapusBtn.classList.add("hapus");
    hapusBtn.addEventListener("click", function () {
      hapusBuku(objekBuku.id);
      alert(`kamu telah menghapus: ${objekBuku.title}`);
    });
    contain.append(btnCmplt, hapusBtn);
  } else {
    const btnselesai = document.createElement("button");
    btnselesai.innerText = "selesai dibaca";
    btnselesai.classList.add("checkBtn");

    btnselesai.addEventListener("click", function () {
      bukuDibaca(objekBuku.id);
    });
    const hapusBtn = document.createElement("button");
    hapusBtn.innerText = "hapus";
    hapusBtn.classList.add("hapus");
    hapusBtn.addEventListener("click", function () {
      hapusBuku(objekBuku.id);
      alert(`kamu telah menghapus: ${objekBuku.title}`);
    });
    contain.append(btnselesai, hapusBtn);
  }
  return contain;
}

function bukuDibaca(bukuId) {
  const targetBuku = cariBuku(bukuId);

  if (targetBuku == null) return;

  targetBuku.isComplete = true;
  document.dispatchEvent(new Event(PROGRAM_EVENT));
  saveStorage();
}

function cariBuku(bukuId) {
  for (const rakBuku of rak) {
    if (rakBuku.id === bukuId) {
      return rakBuku;
    }
  }
  return null;
}

//
function cariBukuIndex(bukuId) {
  for (const index in rak) {
    if (rak[index].id === bukuId) {
      return index;
    }
  }
  return -1;
}

function hapusBuku(bukuId) {
  const targetBuku = cariBukuIndex(bukuId);

  if (targetBuku === -1) return;

  rak.splice(targetBuku, 1);
  document.dispatchEvent(new Event(PROGRAM_EVENT));
  saveStorage();
}

function bukuBLmDibaca(bukuId) {
  const targetBuku = cariBuku(bukuId);

  if (targetBuku == null) return;
  targetBuku.isComplete = false;
  document.dispatchEvent(new Event(PROGRAM_EVENT));
  saveStorage();
}

function saveStorage() {
  if (ifStorageExist()) {
    const parsed = JSON.stringify(rak);
    localStorage.setItem(STORAGE_EVENT, parsed);
    document.dispatchEvent(new Event(SAVED_DATA));
  }
}

function ifStorageExist() {
  if (typeof Storage === undefined) {
    alert("Browser kamu tidak mendukung local storage");
    return false;
  }
  return true;
}

document.addEventListener(SAVED_DATA, function () {
  console.log(localStorage.getItem(STORAGE_EVENT));
  // alert(localStorage.getItem(STORAGE_EVENT));
});

function loadDataFromUserStorage() {
  const serializedData = localStorage.getItem(STORAGE_EVENT);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const buku of data) {
      rak.push(buku);
    }
  }

  document.dispatchEvent(new Event(PROGRAM_EVENT));
}

document.addEventListener("DOMContentLoaded", function () {
  if (ifStorageExist()) {
    loadDataFromUserStorage();
  }
});
