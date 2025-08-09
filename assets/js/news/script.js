
const slug = (s) => (s || "").toLowerCase().replace(/\s+/g, "");
const setQuery = (mutate) => {
  const p = new URLSearchParams(window.location.search);
  mutate(p);
  history.pushState(null, "", `${window.location.pathname}${p.toString() ? `?${p}` : ""}`);
};
const getQuery = () => new URLSearchParams(window.location.search);


const filterButtons    = document.getElementById("filterButtons");
const newsList         = document.getElementById("newsList");
const modal            = document.getElementById("newsModal");
const closeModalBtn    = document.getElementById("closeNewsModal");
const modalTitle       = document.querySelector(".modal-title");
const modalGameDate    = document.querySelector(".modal-game-date");
const modalBody        = document.querySelector(".modal-body");
const relatedContainer = document.querySelector(".related-news");
const modalListView    = document.getElementById("allNewsList");
const loadMoreBtn      = document.getElementById("loadMoreBtn");
const loadingOverlay   = document.getElementById("loadingOverlay");
const newsItemTemplate = document.getElementById("newsItemTemplate");
const searchInput      = document.getElementById("newsSearchInput");
const gameSelect       = document.getElementById("newsGameSelect");
const emptyMsg         = document.querySelector(".news-empty"); 


let visibleAllNews = 8;
let currentGameFilter = null; 
let currentSearchTerm = "";

function createNewsItem(item, onClick) {
  const clone = newsItemTemplate.content.cloneNode(true);
  clone.querySelector(".news-game").innerHTML  = `<div><img src="${item.gameIcon}" alt=""/><span>${item.gameName}</span></div>`;
  clone.querySelector(".news-thumb").innerHTML = `<div><img src="${item.thumb}" alt="Thumb"/></div>`;
  clone.querySelector(".news-date").textContent = item.date;
  clone.querySelector(".news-title").innerHTML  = `<p><span>${item.type}</span>${item.title}</p>`;
  const container = clone.querySelector(".news-item");
  container.dataset.id = item.id;
  container.addEventListener("click", () => onClick(item));
  return clone;
}

function filterAndSort(list) {
  const filtered = list.filter(item =>
    (!currentGameFilter || item.gameName === currentGameFilter) &&
    (!currentSearchTerm || item.title.toLowerCase().includes(currentSearchTerm.toLowerCase()))
  );
  return filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
}

function renderNewsList(list) {
  if (!newsList) return;
  const limit = parseInt(newsList.dataset.limit, 10) || list.length;
  const limited = filterAndSort(list).slice(0, limit);
  newsList.innerHTML = "";
  limited.forEach(item => newsList.appendChild(createNewsItem(item, openModal)));
}

function renderAllNewsInModal(list = newsArray) {
  modalListView.innerHTML = "";
  const sorted = filterAndSort(list);
  const itemsToShow = sorted.slice(0, visibleAllNews);

  if (itemsToShow.length === 0) {
    emptyMsg?.classList.remove("hidden");
  } else {
    emptyMsg?.classList.add("hidden");
    itemsToShow.forEach(item => {
      modalListView.appendChild(createNewsItem(item, (clicked) => openModal(clicked, true)));
    });
  }
  loadMoreBtn.classList.toggle("hidden", visibleAllNews >= sorted.length);
}


//


function openModal(item = null, updateURL = true, filterGame = null) {
  modal.style.display = "flex";
  const modalSingle = document.querySelector(".modal-single");
  const modalList   = document.querySelector(".modal-list");
  const modalHeader = document.querySelector(".modal-header");

  if (item) {
    modalSingle.style.display = "block";
    modalList.style.display   = "none";
    modalHeader?.classList.add("back");
  } else {
    modalSingle.style.display = "none";
    modalList.style.display   = "block";
    modalHeader?.classList.remove("back");
  }

  if (!item) {
    loadingOverlay.classList.remove("hidden");
    setTimeout(() => {
      visibleAllNews = 6; 
      currentGameFilter = filterGame || null;
      if (gameSelect) gameSelect.value = filterGame || "";
      currentSearchTerm = searchInput?.value || "";
      renderAllNewsInModal(newsArray);

      if (updateURL) {
        setQuery((p) => {
          p.set("modal", "news");
          if (filterGame) p.set("game", slug(filterGame)); else p.delete("game");
          p.delete("news"); p.delete("id");
        });
      }
      loadingOverlay.classList.add("hidden");
    }, 400);
    return;
  }

  loadingOverlay.classList.remove("hidden");
  setTimeout(() => {
    modalTitle.textContent = item.title;
    modalGameDate.innerHTML = `<div><img src="${item.gameIcon}" alt=""/></div> <div>${item.date}</div>`;
    modalBody.innerHTML = item.content;

    const related = newsArray.filter(n => n.gameName === item.gameName && n.id !== item.id).slice(0, 4);
    relatedContainer.innerHTML = "";
    related.forEach(rel => relatedContainer.appendChild(createNewsItem(rel, openModal)));

    if (updateURL) {
      setQuery((p) => {
        p.set("news", slug(item.gameName));
        p.set("id", item.id);
        p.delete("modal"); p.delete("game");
      });
    }
    loadingOverlay.classList.add("hidden");
  }, 400);
}

function closeModal(updateURL = true) {
  modal.style.display = "none";
  if (updateURL) {
    setQuery((p) => {
      p.delete("modal"); p.delete("news"); p.delete("id"); p.delete("game");
    });
  }
}

function loadMoreNews() {
  loadingOverlay.classList.remove("hidden");
  setTimeout(() => {
    visibleAllNews += 8;
    renderAllNewsInModal(newsArray);
    loadingOverlay.classList.add("hidden");
  }, 400);
}

//

function handleQueryParams() {
  const params = getQuery();
  const modalType = params.get("modal");
  const news = params.get("news");
  const id = parseInt(params.get("id"), 10);

  if (modalType === "news") {
    const game = params.get("game");
    const matchName = game ? (newsArray.find(n => slug(n.gameName) === game)?.gameName || null) : null;
    openModal(null, false, matchName);
    return;
  }

  if (news && id) {
    const item = newsArray.find(n => slug(n.gameName) === news && n.id === id);
    if (item) { openModal(item, false); return; }
  }

  closeModal(false);
}

window.addEventListener("popstate", handleQueryParams);



//


function renderFilterButtons() {
  if (!filterButtons) return;
  const gameNames = [...new Set(newsArray.map(n => n.gameName))];
  filterButtons.innerHTML = `<button data-filter="all" class="active">All</button>`;
  gameNames.forEach(game => {
    const btn = document.createElement("button");
    btn.dataset.filter = game;
    btn.innerHTML = game;
    filterButtons.appendChild(btn);
  });
  filterButtons.querySelectorAll("button").forEach(btn => {
    btn.addEventListener("click", () => {
      filterButtons.querySelectorAll("button").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const filter = btn.dataset.filter;
      const filtered = filter === "all" ? newsArray : newsArray.filter(n => n.gameName === filter);
      renderNewsList(filtered);
    });
  });
}

//

closeModalBtn.addEventListener("click", () => closeModal());

//

document.querySelectorAll(".openAllNewsBtn").forEach(btn => {
  btn.addEventListener("click", () => openModal(null));
});

loadMoreBtn?.addEventListener("click", loadMoreNews);

window.addEventListener("DOMContentLoaded", () => {
  renderFilterButtons();
  renderNewsList(newsArray);
  handleQueryParams();

  document.querySelectorAll(".news-list[data-game]").forEach(container => {
    const game  = container.dataset.game;
    const limit = parseInt(container.dataset.limit, 10) || newsArray.length;
    const items = newsArray
      .filter(n => n.gameName === game)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, limit);

    container.innerHTML = "";
    items.forEach(item => container.appendChild(createNewsItem(item, openModal)));
  });

  modal.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });

  searchInput?.addEventListener("input", () => {
    currentSearchTerm = searchInput.value;
    renderAllNewsInModal(newsArray);
  });
  gameSelect?.addEventListener("change", () => {
    currentGameFilter = gameSelect.value || null;
    renderAllNewsInModal(newsArray);
  });

  document.querySelectorAll(".open-game-news").forEach(btn => {
    btn.addEventListener("click", () => openModal(null, true, btn.dataset.game));
  });
});
