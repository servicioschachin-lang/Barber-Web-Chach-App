export class ElementToolbar {
  constructor(doc, handlers) {
    this.doc = doc;
    this.handlers = handlers || {};
    this.el = null;
    this.node = null;
    this.colorOpen = false;
    this.colorInputs = null;
  }
  show(target) {
    this.hide();
    this.el = target;
    this.colorOpen = false;
    const isImg = target.tagName === 'IMG';
    const bar = this.doc.createElement('div');
    bar.className = 'cw-toolbar';
    bar.setAttribute('data-cw', '1');
    const makeBtn = (icon, title, onClick) => {
      const b = this.doc.createElement('button');
      b.type = 'button';
      b.className = 'cw-toolbar-btn';
      b.title = title;
      b.textContent = icon;
      b.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); onClick(); });
      return b;
    };
    bar.appendChild(makeBtn('✏️', 'Editar', () => this.handlers.onEdit && this.handlers.onEdit(this.el)));
    if (isImg) bar.appendChild(makeBtn('🖼️', 'Cambiar imagen', () => this.handlers.onChangeImage && this.handlers.onChangeImage(this.el)));
    bar.appendChild(makeBtn('🎨', 'Colores', () => this.toggleColors()));
    bar.appendChild(makeBtn('🗑️', 'Borrar', () => this.handlers.onDelete && this.handlers.onDelete(this.el)));
    const pop = this.doc.createElement('div');
    pop.className = 'cw-color-pop';
    pop.setAttribute('data-cw', '1');
    pop.style.display = 'none';
    const bgLabel = this.doc.createElement('label'); bgLabel.textContent = 'Fondo';
    const bgInput = this.doc.createElement('input'); bgInput.type = 'color'; bgInput.value = '#ffffff';
    bgInput.addEventListener('input', () => { if (this.handlers.onColor) this.handlers.onColor(this.el, 'bg', bgInput.value); });
    const txtLabel = this.doc.createElement('label'); txtLabel.textContent = 'Texto';
    const txtInput = this.doc.createElement('input'); txtInput.type = 'color'; txtInput.value = '#000000';
    txtInput.addEventListener('input', () => { if (this.handlers.onColor) this.handlers.onColor(this.el, 'text', txtInput.value); });
    pop.appendChild(bgLabel); pop.appendChild(bgInput); pop.appendChild(txtLabel); pop.appendChild(txtInput);
    bar.appendChild(pop);
    this.doc.body.appendChild(bar);
    this.node = bar;
    this.colorInputs = { bg: bgInput, text: txtInput };
    this.position();
    try {
      const st = this.doc.defaultView.getComputedStyle(target);
      bgInput.value = rgbToHexSafe(st.backgroundColor) || '#ffffff';
      txtInput.value = rgbToHexSafe(st.color) || '#000000';
    } catch (e) {}
  }
  toggleColors() {
    this.colorOpen = !this.colorOpen;
    const pop = this.node && this.node.querySelector('.cw-color-pop');
    if (pop) pop.style.display = this.colorOpen ? 'flex' : 'none';
  }
  position() {
    if (!this.node || !this.el) return;
    const r = this.el.getBoundingClientRect();
    const scrollX = this.doc.defaultView.scrollX || 0;
    const scrollY = this.doc.defaultView.scrollY || 0;
    let top = r.top + scrollY - 46;
    let left = r.left + scrollX;
    if (top < scrollY + 4) top = r.bottom + scrollY + 6;
    this.node.style.top = top + 'px';
    this.node.style.left = left + 'px';
  }
  hide() {
    if (this.node && this.node.parentNode) this.node.parentNode.removeChild(this.node);
    this.node = null;
    this.el = null;
  }
}
function rgbToHexSafe(rgb) {
  if (!rgb || rgb === 'rgba(0, 0, 0, 0)') return null;
  const m = rgb.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (!m) return null;
  return '#' + [m[1], m[2], m[3]].map(x => parseInt(x).toString(16).padStart(2, '0')).join('');
}
