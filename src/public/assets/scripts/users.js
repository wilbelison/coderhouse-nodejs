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

// Função para obter um ou todos os usuários
async function getUsers(id = null) {
  return await fetchAPI(id ? `/${id}` : "");
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

  // Seleciona o template Handlebars
//   const templateSource = document.getElementById("users-template").innerHTML;

  const usersTemplate = `
    {{#each users}}
        <tr>
        <td>{{this.id}}</td>
        <td><input
            type="text"
            class="name"
            required
            disabled
            value="{{this.name}}"
            /></td>
        <td><input
            type="text"
            class="last_name"
            required
            disabled
            value="{{this.last_name}}"
            /></td>
        <td><input
            type="number"
            class="age"
            required
            disabled
            value="{{this.age}}"
            /></td>
        <td><input
            type="email"
            class="email"
            required
            disabled
            value="{{this.email}}"
            /></td>
        <td>
            <button class="edit">Editar</button>
            <button class="delete">Excluir</button>
            <button class="save">Salvar</button>
            <button class="cancel">Cancelar</button>
        </td>
        </tr>
    {{/each}}
  `;

  const template = Handlebars.compile(usersTemplate);

  // Passa os dados dos usuários para o template
  const html = template({ users });

  // Insere o HTML gerado na tabela
  document.getElementById("users-tbody").innerHTML = html;
}

// Renderiza a tabela quando a página for carregada
window.onload = renderUsersTable;
