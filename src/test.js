import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

const DEFAULT_QUERY = 'redux';
const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const url = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${DEFAULT_QUERY}`;
const list=[
    {
        title:'react',
        url: 'https://facebook.github.io/react/',
        author: 'Jordan Walke',
        num_comments: 3,
        points: 4,
        objectID: 0,
    },
    {
        title: 'Redux',
        url: 'https://github.com/reactjs/redux',
        author: 'Dan Abramov, Andrew Clark',
        num_comments: 2,
        points: 5,
        objectID: 1,
    },
];


const isSearched = searchTerm => item => item.title.toLowerCase().includes(searchTerm.toLowerCase());
class App extends Component {

    constructor(props) {

        super(props);
        this.state={
            list:list,
            searchTerm:'',
        };
        this.onDismiss=this.onDismiss.bind(this);
        this.onSearchChange=this.onSearchChange.bind(this);
    }

    onDismiss(id){
        const isNotId = item => item.objectID !== id;
        const updatedList=this.state.list.filter(isNotId);
        this.setState({list:updatedList});
    }
    onSearchChange(event){
        this.setState({searchTerm:event.target.value});
    }

    render() {
        const {list,searchTerm} = this.state;
        return (
            <div className='page'>
                <div className='interactions'>
                    <Search value={searchTerm} onChange={this.onSearchChange}>
                        search
                    </Search>
                </div>
                <Table   pattern={searchTerm}
                         list={list}
                         onDismiss={this.onDismiss}
                />
            </div>
        );
    }
}
const Search=({ value, onChange,children })=>{
    // alert('a');
    return (
        <form>
            {children}
            <input
                type="text"
                value={value}
                onChange={onChange}/>
        </form>
    )
}

const Table=({ list, pattern, onDismiss })=>{
    return (
        <div className='table'>
            {list.filter(isSearched(pattern)).map(item =>
                <div key={item.objectID} className="table-row">
                        <span>
                            <a href={item.url}>{item.title}</a>
                        </span>
                    <span>{item.author}</span>
                    <span>{item.num_comments}</span>
                    <span>{item.points}</span>
                    <span>
                            <Button
                                onClick={() => onDismiss(item.objectID)}
                                className="button-inline"

                            >
                              Dismiss
                            </Button>
                        </span>
                </div> )}
        </div> )
}

// class Table extends Component {
//     render() {
//         const { list, pattern, onDismiss } = this.props;
//         return (
//             <div>
//                 {list.filter(isSearched(pattern)).map(item =>
//                      <div key={item.objectID}>
//                         <span>
//                             <a href={item.url}>{item.title}</a>
//                         </span>
//                         <span>{item.author}</span>
//                         <span>{item.num_comments}</span>
//                         <span>{item.points}</span>
//                         <span>
//                             <button
//                                 onClick={() => onDismiss(item.objectID)}
//                                 type="button"
//                             >
//                               Dismiss
//                             </button>
//                         </span>
//                       </div> )}
//             </div> );
//                 } }
const Button=({onClick, className='', children,})=>{
    return (
        <button
            onClick={onClick}
            className={className}
        >
            {children}
        </button>
    )



}


// ()=>this.onDismiss(item.objectID)
export default App;
