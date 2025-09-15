const MODAL_PARAM = 'modal';
const SELECTORS = {
    modal: '.le__modal',
    inner: '.le__modal .modal',
    closeBtn: '.le__modal .close',
    triggers: '[data-open-modal]'
};

const state = {
    activeId: null,
    lastFocus: null
};

const $all = (sel, root = document) => Array.from(root.querySelectorAll(sel));
const $one = (sel, root = document) => root.querySelector(sel);
const getModalById = (id) => $one(`${SELECTORS.modal}[data-modal="${CSS.escape(id)}"]`);

const getHashParams = () => {
    const raw = (location.hash || '').replace(/^#/, '');
    const out = {};
    raw.split('&').forEach(kv => {
        if (!kv) return;
        const [k, v = ''] = kv.split('=');
        out[decodeURIComponent(k)] = decodeURIComponent(v);
    });
    return out;
};

const setHashParams = (obj, usePush = true) => {
    const entries = Object.entries(obj).filter(([_, v]) => v !== null && v !== undefined && v !== '');
    const next = entries.length
        ? '#' + entries.map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`).join('&')
        : '';
    if (usePush) {
        history.pushState(null, '', next || location.pathname + location.search);
    } else {
        history.replaceState(null, '', next || location.pathname + location.search);
    }
};

const mergeHash = (patch, usePush = true) => {
    const current = getHashParams();
    Object.keys(patch).forEach(k => {
        if (patch[k] === null) delete current[k];
        else current[k] = patch[k];
    });
    setHashParams(current, usePush);
};

const openingModal = (id, { updateHash = true } = {}) => {
    if (!id) return;
    const modal = getModalById(id);
    if (!modal) return;

    $all(SELECTORS.modal).forEach(m => {
        m.classList.remove('active');
        m.setAttribute('aria-hidden', 'true');
    });

    state.lastFocus = document.activeElement;
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    state.activeId = id;

    if (updateHash) mergeHash({ [MODAL_PARAM]: id }, true);
};

const closingModal = ({ updateHash = true } = {}) => {
    const modal = state.activeId
        ? getModalById(state.activeId)
        : document.querySelector(`${SELECTORS.modal}.active`);

    if (modal) {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
    }
    document.body.classList.remove('modal-open');

    if (state.lastFocus && typeof state.lastFocus.focus === 'function') {
        try { state.lastFocus.focus({ preventScroll: true }); } catch { }
    }

    state.activeId = null;
    if (updateHash) mergeHash({ [MODAL_PARAM]: null }, true);
};


document.addEventListener('click', (e) => {

    const opener = e.target.closest(SELECTORS.triggers);
    if (opener) {
        const id = opener.getAttribute('data-open-modal');
        if (id) {
            e.preventDefault();
            openingModal(id, { updateHash: true });
        }
        return;
    }


    const modalRoot = e.target.closest(SELECTORS.modal);
    if (modalRoot && !e.target.closest(SELECTORS.inner) && modalRoot.classList.contains('active')) {
        closingModal({ updateHash: true });
        return;
    }


    const closeBtn = e.target.closest(SELECTORS.closeBtn);
    if (closeBtn && closeBtn.closest(SELECTORS.modal)) {
        closingModal({ updateHash: true });
        return;
    }
});


document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && state.activeId) {
        e.preventDefault();
        closingModal({ updateHash: true });
    }
});


window.addEventListener('hashchange', () => {
    const params = getHashParams();
    const id = params[MODAL_PARAM];
    if (id) {
        if (state.activeId !== id) openingModal(id, { updateHash: false });
    } else if (state.activeId) {
        closingModal({ updateHash: false });
    }
});

const init = () => {
    const params = getHashParams();
    if (params[MODAL_PARAM]) {
        openingModal(params[MODAL_PARAM], { updateHash: false });
        return;
    }

    const preset = document.querySelector(`${SELECTORS.modal}.active`);
    if (preset) {
        preset.setAttribute('aria-hidden', 'false');
        document.body.classList.add('modal-open');
        state.activeId = preset.getAttribute('data-modal') || '__preset__';
    }
};

window.LEModal = {
    open: (id) => openingModal(id, { updateHash: true }),
    close: () => closingModal({ updateHash: true }),
    isOpen: () => !!state.activeId,
    activeId: () => state.activeId
};

init();