/**
 * Pre-selecciona un área en el formulario de contacto. El scroll real lo
 * dispara la navegación nativa del `<a href="#contacto">`, que honra el
 * `scroll-padding-top` de `html`. Replica el comportamiento del prototipo
 * (data-area): el href queda intacto para que funcione sin JS; el handler
 * solo sincroniza el select cuando JS está disponible.
 */
export function preselectArea(area: string) {
  const select = document.getElementById("f-area") as HTMLSelectElement | null;
  if (!select) return;
  select.value = area;
  select.dispatchEvent(new Event("change", { bubbles: true }));
}
