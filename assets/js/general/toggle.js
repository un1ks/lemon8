(() => {

    function createDataToggle({
        triggerAttr = 'data-toggle-target',
        targetAttr = 'data-toggle',
        groupAttr = 'data-toggle-group',
        closeAttr = 'data-toggle-close',
        activeClass = 'active',
        closeOnEsc = true,
        closeOnOutside = true,
        root = document
    } = {}) {
        const state = new Set();

        const qsAll = (sel, scope = root) => Array.from(scope.querySelectorAll(sel));
        const findTarget = (value) => root.querySelector(`[${targetAttr}="${CSS.escape(value)}"]`);
        const findTriggers = (value) => qsAll(`[${triggerAttr}="${CSS.escape(value)}"]`);
        const isInsideAnyActive = (node) => {
            for (const el of state) if (el.contains(node)) return true;
            return false;
        };

        function openTarget(target, value) {
            if (!target) return;

            const group = target.getAttribute(groupAttr);
            if (group) {
                qsAll(`[${groupAttr}="${CSS.escape(group)}"].${activeClass}`).forEach(el => {
                    if (el !== target) closeTarget(el, el.getAttribute(targetAttr));
                });
            }

            target.classList.add(activeClass);
            findTriggers(value).forEach(btn => btn.classList.add(activeClass));
            state.add(target);
        }

        function closeTarget(target, value) {
            if (!target) return;
            target.classList.remove(activeClass);
            findTriggers(value).forEach(btn => btn.classList.remove(activeClass));
            state.delete(target);
        }

        function toggleTargetByValue(value) {
            const target = findTarget(value);
            if (!target) return;
            if (target.classList.contains(activeClass)) {
                closeTarget(target, value);
            } else {
                openTarget(target, value);
            }
        }

        function closeAll() {
            Array.from(state).forEach(el => closeTarget(el, el.getAttribute(targetAttr)));
        }

        
        function onClick(e) {
            const trigger = e.target.closest(`[${triggerAttr}]`);
            if (trigger) {
                e.preventDefault();
                const value = trigger.getAttribute(triggerAttr) || '';
                toggleTargetByValue(value);
                return;
            }

            const closer = e.target.closest(`[${closeAttr}]`);
            if (closer) {
                const host = e.target.closest(`[${targetAttr}]`);
                if (host) closeTarget(host, host.getAttribute(targetAttr));
                return;
            }

            if (closeOnOutside && state.size) {
                if (!isInsideAnyActive(e.target)) closeAll();
            }
        }

        function onKeyDown(e) {
            if (closeOnEsc && e.key === 'Escape' && state.size) closeAll();
        }

        root.addEventListener('click', onClick);
        root.addEventListener('keydown', onKeyDown);

        return {
            open: (value) => openTarget(findTarget(value), value),
            close: (value) => closeTarget(findTarget(value), value),
            toggle: toggleTargetByValue,
            closeAll,
            destroy: () => {
                root.removeEventListener('click', onClick);
                root.removeEventListener('keydown', onKeyDown);
                closeAll();
            }
        };
    }

    window.createDataToggle = createDataToggle;
    window._dataToggle = createDataToggle();
})();