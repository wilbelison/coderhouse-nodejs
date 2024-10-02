const baseUrl = "/api/users/array";

// Função para fazer uma requisição genérica (GET, POST, PUT, DELETE)
async function fetchAPI(endpoint = "", method = "GET", body = null) {
  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${baseUrl}${endpoint}`, options);
    const data = await response.json();

    if (response.ok) {
      return data;
    } else {
      console.error(`Erro: ${data.message || "Erro desconhecido"}`);
      return false;
    }
  } catch (error) {
    console.error(`Erro: ${error.message}`);
    return false;
  }
}

// Função para obter todos os usuários
async function getUsers() {
  return await fetchAPI();
}

// Função para criar um novo usuário
async function createUser(user) {
  return await fetchAPI("", "POST", user);
}

// Função para editar um usuário existente
async function updateUser(id, updatedUser) {
  return await fetchAPI(`/${id}`, "PUT", updatedUser);
}

// Função para deletar um usuário
async function deleteUser(id) {
  return await fetchAPI(`/${id}`, "DELETE");
}

// Função para renderizar a tabela usando Handlebars
async function renderUsersTable() {
  const users = await getUsers();

  if (!users || users.length === 0) {
    console.log("Nenhum usuário encontrado.");
    return;
  }

  const templateSource = `
    {{#each users}}
      <tr data-id="{{this.id}}">
        <td>{{this.id}}</td>
        <td><input type="text" class="name" required disabled value="{{this.name}}"/></td>
        <td><input type="text" class="last_name" required disabled value="{{this.last_name}}"/></td>
        <td><input type="number" class="age" required disabled value="{{this.age}}"/></td>
        <td><input type="email" class="email" required disabled value="{{this.email}}"/></td>
        <td>
          <button class="edit">Editar</button>
          <button class="delete">Excluir</button>
          <button class="save">Salvar</button>
          <button class="cancel">Cancelar</button>
        </td>
      </tr>
    {{/each}}
  `;
  const template = Handlebars.compile(templateSource);

  const html = template({ users });
  document.getElementById("users-tbody").innerHTML = html;

  // Adiciona eventos aos botões de edição, exclusão, salvar e cancelar
  document.querySelectorAll(".edit").forEach(button => {
    button.addEventListener("click", enableEditing);
  });

  document.querySelectorAll(".delete").forEach(button => {
    button.addEventListener("click", handleDelete);
  });

  document.querySelectorAll(".save").forEach(button => {
    button.addEventListener("click", handleSave);
  });

  document.querySelectorAll(".cancel").forEach(button => {
    button.addEventListener("click", cancelEditing);
  });
}

// Função para habilitar a edição de um usuário
function enableEditing(event) {
  const row = event.target.closest("tr");
  row.classList.add("editing");
  row.querySelectorAll("input").forEach(input => input.disabled = false);
}

// Função para cancelar a edição de um usuário
function cancelEditing(event) {
  const row = event.target.closest("tr");
  row.classList.remove("editing");
  row.querySelectorAll("input").forEach(input => input.disabled = true);
}

// Função para salvar as alterações de um usuário
async function handleSave(event) {
  const row = event.target.closest("tr");
  const id = row.dataset.id;

  const updatedUser = {
    name: row.querySelector(".name").value,
    last_name: row.querySelector(".last_name").value,
    age: row.querySelector(".age").value,
    email: row.querySelector(".email").value
  };

  const success = await updateUser(id, updatedUser);

  if (success) {
    row.classList.remove("editing");
    row.querySelectorAll("input").forEach(input => input.disabled = true);
  }
}

// Função para excluir um usuário
async function handleDelete(event) {
  const row = event.target.closest("tr");
  const id = row.dataset.id;

  const success = await deleteUser(id);

  if (success) {
    row.remove();
  }
}

// Função para adicionar um novo usuário
document.querySelector(".create").addEventListener("submit", async function(event) {
  event.preventDefault();

  const newUser = {
    name: document.getElementById("name").value,
    last_name: document.getElementById("last_name").value,
    age: document.getElementById("age").value,
    email: document.getElementById("email").value
  };

  const success = await createUser(newUser);

  if (success) {
    renderUsersTable();
    event.target.reset();
  }
});

// Renderiza a tabela quando a página for carregada
window.onload = renderUsersTable;
