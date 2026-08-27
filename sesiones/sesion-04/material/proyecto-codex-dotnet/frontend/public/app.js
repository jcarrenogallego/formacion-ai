const elements = {
  total: document.querySelector("#total"),
  pending: document.querySelector("#pending"),
  inProgress: document.querySelector("#in-progress"),
  completed: document.querySelector("#completed"),
  items: document.querySelector("#work-items"),
  form: document.querySelector("#work-item-form"),
  message: document.querySelector("#message")
};

const priorityNames = { Low: "Baja", Medium: "Media", High: "Alta" };

function escapeHtml(value) {
  return value.replace(/[&<>'"]/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character]);
}

function render(data) {
  elements.total.textContent = data.total;
  elements.pending.textContent = data.pending;
  elements.inProgress.textContent = data.inProgress;
  elements.completed.textContent = data.completed;
  elements.items.innerHTML = data.items.length
    ? data.items.map(item => `
      <div class="work-item ${item.priority.toLowerCase()}">
        <div><strong>${escapeHtml(item.title)}</strong><small>${escapeHtml(item.owner)} · ${new Date(item.createdAt).toLocaleDateString("es-ES")}</small></div>
        <span class="badge">${priorityNames[item.priority]}</span>
      </div>`).join("")
    : '<p class="empty">Aún no hay tareas. Añade la primera desde el formulario.</p>';
}

async function loadDashboard() {
  const response = await fetch("/api/work-items/dashboard");
  if (!response.ok) throw new Error("No se pudo cargar el tablero.");
  render(await response.json());
}

elements.form.addEventListener("submit", async event => {
  event.preventDefault();
  elements.message.textContent = "Guardando…";
  const formData = new FormData(elements.form);
  const response = await fetch("/api/work-items", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(Object.fromEntries(formData))
  });

  if (!response.ok) {
    const problem = await response.json();
    elements.message.textContent = problem.detail ?? "No se pudo crear la tarea.";
    return;
  }

  elements.form.reset();
  elements.message.textContent = "Tarea creada correctamente.";
  await loadDashboard();
});

document.querySelector("#refresh").addEventListener("click", loadDashboard);
loadDashboard().catch(error => { elements.message.textContent = error.message; });
