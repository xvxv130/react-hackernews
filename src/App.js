import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

const DEFAULT_QUERY = '';
const DEFAULT_HPP = '100';
const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page=';
const PARAM_HPP = 'hitsPerPage=';
const url = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${DEFAULT_QUERY}&${PARAM_PAGE}`;
// const isSearched = searchTerm => item => item.title.toLowerCase().includes(searchTerm.toLowerCase());
class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            results: null,
            searchKey:'',
            searchTerm: DEFAULT_QUERY,
            error:null,
            isLoading: false,
        };
        this.setSearchTopStories = this.setSearchTopStories.bind(this);
        this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
        this.onSearchChange = this.onSearchChange.bind(this);
        this.onDismiss=this.onDismiss.bind(this);
        this.onSearchSubmit = this.onSearchSubmit.bind(this);
        this.needsToSearchTopStories = this.needsToSearchTopStories.bind(this);//阻止api请求
   }
    onSearchSubmit(event) {
        console.log('关键字搜索');
        const { searchTerm } = this.state;
        this.setState({searchKey:searchTerm});
        if (this.needsToSearchTopStories(searchTerm)) {
            this.fetchSearchTopStories(searchTerm);
        }
        event.preventDefault();
    }
    needsToSearchTopStories(searchTerm) {
        return !this.state.results[searchTerm];
    }

    setSearchTopStories(result) {
        console.log('page判断，hits合并,setState');
        const { hits, page } = result;
        const {searchKey,results}=this.state;
        const oldHits = results && results[searchKey] ?
            results[searchKey].hits
            : [];
        const updatedHits = [
            ...oldHits,
            ...hits
        ];
        console.log(hits);
        this.setState({
            results:{
                ...results,
                [searchKey]: { hits: updatedHits, page }
            },
            isLoading: false
        });
    }

    fetchSearchTopStories(searchTerm, page = 0) {
        console.log('api请求数据');
        this.setState({ isLoading: true });
        fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
            .then(response => response.json())
            .then(result => this.setSearchTopStories(result))
            .catch(e => this.setState({ error: e }));
    }

    componentDidMount() {
        console.log("组件加载后DidMount");
        const {searchTerm} = this.state;
        this.setState({searchKey:searchTerm});
        this.fetchSearchTopStories(searchTerm);
    }

      onDismiss(id){
        console.log('删除记录');
        const { searchKey, results } = this.state;
        const { hits, page } = results[searchKey];
        console.log(results);

        const isNotId = item => item.objectID !== id;
        const updatedHits=hits.filter(isNotId);

        this.setState({
            results: {
                ...results,
                [searchKey]: { hits: updatedHits, page }
            }
        });
      }
  onSearchChange(event){
    this.setState({searchTerm:event.target.value});
  }

  render() {
        console.log('渲染组件');
    const {
        results,
        searchTerm,
        searchKey,
        error,
        isLoading
    } = this.state;
    const page = (
        results &&
        results[searchKey] &&
        results[searchKey].page
    ) || 0;
    const list = (
        results &&
        results[searchKey] &&
        results[searchKey].hits
    ) || [];
    return (
       <div className='page'>
           <div className='interactions'>
               <Search value={searchTerm}
                       onChange={this.onSearchChange}
                        onSubmit={this.onSearchSubmit}
               >
                   search
               </Search>
           </div>
           { error
               ? <div className="interactions">
                   <p>Something went wrong.</p>
               </div>
               : <Table
                   list={list}
                   onDismiss={this.onDismiss}
               /> }
           <div className="interactions">
               { isLoading
                   ? <Loading />
                   : <Button
                       onClick={() => this.fetchSearchTopStories(searchKey, page + 1)}>
                       More
                   </Button>
               }
            </div>
       </div>
    );
  }
}
// class Search extends Component {
//     componentDidMount() {
//         if(this.input) {
//             this.input.focus();
//         }
//     }
//
//     render() {
//         const {
//             value,
//             onChange,
//             onSubmit,
//             children
//         } = this.props;
//         return (
//             <form onSubmit={onSubmit}>
//                 <input
//                     type="text"
//                     value={value}
//                     onChange={onChange}
//                     ref={(node) => { this.input = node; }}
//
//                 />
//                 <button type="submit">
//                     {children}
//                 </button>
//             </form>
//         ); }
// }
const Search = ({
                    value,
                    onChange,
                    onSubmit,
                    children
                }) => {
    let input;
    return (
        <form onSubmit={onSubmit}>
            <input
                type="text"
                value={value} onChange={onChange} ref={(node) => input = node}
            />
            <button type="submit">
                {children}
            </button>
        </form> );
}
const Loading = () => <div>Loading ...</div>

const Table=({ list, pattern, onDismiss })=>{
    return (
        <div className='table'>
            {list.map(item =>
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
