const state = {
  todos: []
}

const types = {
  ADD_TODO: 'ADD_TODO'
}

const getters = {
  todos: (state) => state.todos
}

const actions = {
  addTodo({ commit }, todo) {
    commit(types.ADD_TODO, { todo })
  }
}

const mutations = {
  [types.ADD_TODO](state, { todo }) {
    state.todos.push(todo)
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
