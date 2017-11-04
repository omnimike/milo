
function html(tag, props, children) {
    return {tag: tag, props: props || {}, children: children || []};
}

function createElement(node) {
    if (typeof node.tag === 'string') {
        const el = document.createElement(node.tag);
        for (const name in node.props) {
            setProp(el, name, node.props[name]);
        }
        for (const i in node.children) {
            el.appendChild(createElement(node.children[i]));
        }
        return el;
    } else {
        return document.createTextNode(node);
    }
}

function changed(oldNode, newNode) {
    return typeof oldNode !== typeof newNode ||
        typeof oldNode !== 'object' && oldNode !== newNode ||
        oldNode.tag !== newNode.tag;
}

function isEventProp(name) {
  return name.startsWith('on');
}

function extractEventName(name) {
  return name.slice(2).toLowerCase();
}

function setProp(el, name, val) {
    if (isEventProp(name)) {
        el.addEventListener(extractEventName(name), val);
    } else {
        el.setAttribute(name, val);
    }
}

function removeProp(el, name, oldVal) {
    if (isEventProp(name)) {
        el.removeEventListener(extractEventName(name), oldVal);
    } else {
        el.removeAttribute(name);
    }
}

function updateProps(el, newProps, oldProps) {
    for (const prop in oldProps) {
        if (newProps[prop] !== oldProps[prop]) {
            removeProp(el, prop, oldProps[prop]);
        }
    }
    for (const prop in newProps) {
        if (newProps[prop] !== oldProps[prop]) {
            setProp(el, prop, newProps[prop]);
        }
    }
}

function updateElement(parent, newNodes, oldNodes) {
    for (let i = 0; i < newNodes.length && i < oldNodes.length; i++) {
        const oldNode = oldNodes[i];
        const newNode = newNodes[i];
        if (changed(oldNode, newNode)) {
            parent.replaceChild(
                createElement(newNode),
                parent.childNodes[i]
            );
        } else if (newNode.tag) {
            updateProps(parent.childNodes[i], newNode.props, oldNode.props);
            updateElement(parent.childNodes[i], newNode.children, oldNode.children);
        }
    }
    for (let i = oldNodes.length; i < newNodes.length; i++) {
        parent.appendChild(createElement(newNodes[i]));
    }
    for (let i = newNodes.length; i < oldNodes.length; i++) {
        parent.removeChild(parent.childNodes[newNodes.length]);
    }
}

function render(el, nodes) {
    let oldNodes = [];
    if (el._renderRoot) {
        oldNodes = el._renderRoot;
    }
    if (!Array.isArray(nodes)) {
        nodes = [nodes];
    }
    el._renderRoot = nodes;
    updateElement(el, nodes, oldNodes);
}

function app(el, initialState, update, view) {
    let state = initialState || {};
    function dispatch(action) {
        state = update(action, state);
        render(el, view(state, dispatch));
    }
    render(el, view(initialState, dispatch));
    return {
        state: () => state,
        dispatch: dispatch
    };
}

export default {
    html,
    app
};
