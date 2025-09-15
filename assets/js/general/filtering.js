document.addEventListener("DOMContentLoaded", () => {
  const containers = document.querySelectorAll(".filter-container");

  containers.forEach(container => {
    const buttons = container.querySelectorAll(".filter-buttons button");
    const searchInput = container.querySelector(".filter-search");
    const items = container.querySelectorAll(".filter-list li");

    let activeFilter = "all";

    
    const parseCategories = (el) => {
      const raw = (el.getAttribute("data-categories") || "").toLowerCase();
      return raw.split(/[\s,]+/).filter(Boolean);
    };

    const applyFilters = () => {
      const q = (searchInput?.value || "").trim().toLowerCase();

      items.forEach(item => {
        const cats = parseCategories(item);
        const text = item.textContent.toLowerCase();

        const matchCategory = activeFilter === "all" || cats.includes(activeFilter);
        const matchSearch = q === "" || text.includes(q);

        item.style.display = (matchCategory && matchSearch) ? "" : "none";
      });
    };

    buttons.forEach(btn => {
      btn.addEventListener("click", () => {
        buttons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        activeFilter = (btn.getAttribute("data-filter") || "all").toLowerCase();
        applyFilters();
      });
    });

    if (searchInput) {
      searchInput.addEventListener("input", applyFilters);
    }

    applyFilters();
  });
});
