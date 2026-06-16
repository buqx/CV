const apiUrl = "https://jsonplaceholder.typicode.com";
const todosContainer = document.getElementById("todos");

async function fetchTodos() {
    try {
        const response = await fetch(apiUrl + "/todos?_limit=10");
        const todos = await response.json();

        todos.forEach(todo => {
            const template = `
            <div class="card" style="width: 18rem;">
                <div class="card-body">
                    <h5 class="card-title">Tarea #${todo.id}</h5>
                    <p class="card-text">${todo.title}</p>
                    <p class="card-text">
                        <span class="badge ${todo.completed ? 'bg-success' : 'bg-warning'}">
                            ${todo.completed ? 'Completada' : 'Pendiente'}
                        </span>
                    </p>
                    <p class="card-text"><small class="text-muted">User ID: ${todo.userId}</small></p>
                </div>
            </div>
            `;
            todosContainer.innerHTML += template;
        });
    } catch (error) {
        console.error("Error fetching todos:", error);
    }
}

fetchTodos();