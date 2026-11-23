function landing() {
  return {
    lang: 'uk',
    mobileOpen: false,
    contact: window.CONTACT,
    tx(key) {
      return window.DICT[this.lang][key];
    },
  };
}
