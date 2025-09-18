(() => {
  function initTabs(container) {
    const buttons = container.querySelectorAll('.tab-buttons [data-tab]');
    const contents = container.querySelectorAll('.tab-content');

    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const tabId = btn.dataset.tab;
        buttons.forEach(b => b.classList.remove('active'));
        contents.forEach(c => c.classList.remove('active'));
       
        btn.classList.add('active');
        container.querySelector(`.tab-content[data-tab="${tabId}"]`).classList.add('active');
      });
    });
  }
  
  document.querySelectorAll('[data-tabs]').forEach(initTabs);
})();
