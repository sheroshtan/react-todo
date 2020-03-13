import React, { Component } from 'react';
import AppHeader from "../app-header/app-header";
import SearchPanel from "../search-panel/search-panel";
import ItemStatusFilter from "../item-status-filter/item-status-filter";
import TodoList from "../todo-list/todo-list";
import ItemAddForm from "../item-add-form/item-add-form";

export default class App extends Component {

    constructor() {
        super();
        this.state = {
            todoData: [
                this.createTodoItem('Drink Coffee'),
                this.createTodoItem('Make Awesome App'),
                this.createTodoItem('Have A Lunch'),
                this.createTodoItem('Test')
            ],
            term: '',
            filter: 'all'
        };

        this.deleteItem = (id) => {
            this.setState(({ todoData }) => {
                const index = todoData.findIndex(el => el.id === id);
                const newArray = [
                    ...todoData.slice(0, index),
                    ...todoData.slice(index + 1)
                ];

                return {
                    todoData: newArray
                }
            })
        };

        this.addItem = (text) => {
            const newItem = this.createTodoItem(text);
            this.setState(({ todoData }) => {
                const newArray = [ ...todoData, newItem ];
                return {
                    todoData: newArray
                }
            })
        };

        this.onToggleImportant = (id) => {
            this.setState(({ todoData }) => {
                return {
                    todoData: this.toggleProperty(todoData, id, 'important')
                }
            })
        };

        this.onToggleDone = (id) => {
            this.setState(({ todoData }) => {
                return {
                    todoData: this.toggleProperty(todoData, id, 'done')
                }
            })
        };

    }

    createTodoItem = (label) => {
        return {
            label,
            important: false,
            done: false,
            id: this.maxId++
        }
    };

    toggleProperty = (arr, id, propName) => {
        const index = arr.findIndex((el) => el.id === id);
        const oldItem = arr[index];
        const newItem = {...oldItem, [propName]: !oldItem[propName]};
        return [
            ...arr.slice(0, index),
            newItem,
            ...arr.slice(index + 1)
        ];
    };

    search = (items, term) => {
        if(term.length === 0) return items;

        return items.filter((item) => {
            return item.label.toLowerCase().indexOf(term.toLowerCase()) > -1;
        })
    };

    filter = (items, filter) => {
        switch (filter) {
            case 'all' : return items;
            case 'active' : return items.filter(el => !el.done);
            case 'done' : return items.filter(el => el.done);
            default: return items;
        }
    };

    onSearchChange = (term) => {
        this.setState({term})
    };

    onFilterChange = (filter) => {
        this.setState({filter})
    };

    maxId = 100;

    render() {

        const { todoData, term, filter } = this.state;
        const visibleItems = this.filter( this.search(todoData, term), filter);
        const doneCount = todoData.filter((el) => el.done).length;
        const todoCount = todoData.length - doneCount;

        return (
            <div className="todo-app">
                <AppHeader toDo={todoCount} done={doneCount}/>
                <div className="top-panel d-flex">
                    <SearchPanel onSearchChange={this.onSearchChange} />
                    <ItemStatusFilter filter={filter} onFilterChange={this.onFilterChange}/>
                </div>

                <TodoList
                    todos={ visibleItems }
                    onDeleted={ this.deleteItem }
                    onToggleImportant={ this.onToggleImportant }
                    onToggleDone={ this.onToggleDone } />

                <ItemAddForm addItem={this.addItem}/>
            </div>
        )
    }
}