import { debounseFrame } from './utils.js';

const React = (function () {
  let root = null;
  let components = null;
  let stateKey = 0;
  let states = [];
  let unmount = undefined;
  let injectedEvent = {
    event: undefined,
    unmount: undefined,
  };

  const reactRenderer = debounseFrame(() => {
    if (!root || !components) return;
    console.log(root);
    // if (root.childNodes) {
    //   root.insertAdjacentHTML('beforeend', components());
    // } else {
    // }
    root.innerHTML = components();
    stateKey = 0;
    if (injectedEvent.event) {
      injectedEvent.unmount = injectedEvent.event();
    }
  });

  function render(component, node) {
    if (!node || !component) return;
    root = node;
    components = component;
    reactRenderer();
  }

  function useState(initState) {
    if (states.length === 0) states.push(initState);
    const state = states[stateKey];
    const setState = (newState) => {
      if (newState === state) return;
      if (JSON.stringify(newState) === JSON.stringify(state)) return;
      states[stateKey] = newState;
      reactRenderer();
    };
    stateKey += 1;
    return [state, setState];
  }

  function useEffect(effect, depsArray) {
    const hasNoDeps = !depsArray;
    const deps = states[stateKey];
    const hasChangedDeps = deps
      ? !depsArray?.every((el, i) => el === depsArray[i])
      : true;
    if (hasNoDeps || hasChangedDeps) {
      unmount = effect();
      states[stateKey] = depsArray;
    }
    stateKey++;
  }

  function useDocument(callback) {
    injectedEvent.event = callback;
  }

  function routerRender() {
    states = [];
    if (unmount) {
      unmount();
    }
    if (injectedEvent.unmount) {
      injectedEvent.unmount();
    }
    reactRenderer();
  }

  return {
    useState,
    useEffect,
    useDocument,
    render,
    routerRender,
  };
})();

export const { useState, useEffect, useDocument, render } = React;

export default React;
