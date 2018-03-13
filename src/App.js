import React, { Component } from 'react';
import './App.css';

const DEFAULT_QUERY = 'redux';
const DEFAULT_HPP = '100';

const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page=';
const PARAM_HPP = 'hitsPerPage=';

const isSearched = searchTerm => {
	return function(item) {
		return item.title.toLowerCase().includes(searchTerm.toLowerCase());
	};
};

const Button = ({ onClick, className = '', children }) => {
	return (
		<button onClick={onClick} className={className} type="button">
			{children}
		</button>
	);
};

const Table = ({ list, onDismiss }) => {
	console.log(list);
	return (
		<div className="table">
			{list.map(item => {
				return (
					<div key={item.objectID} className="table-row">
						<span style={{ width: '40%' }}>
							<a href={item.url}>{item.title}</a>
						</span>
						<span style={{ width: '30%' }}>{item.author}</span>
						<span style={{ width: '10%' }}>{item.num_comments}</span>
						<span style={{ width: '10%' }}>{item.points}</span>
						<span style={{ width: '10%' }}> </span>
						<span>
							<Button
								onClick={() => onDismiss(item.objectID)}
								classname="button-inline">
								Dismiss
							</Button>
						</span>
					</div>
				);
			})}
		</div>
	);
};

const Search = ({ value, onChange, onSubmit, children }) => {
	return (
		<form onSubmit={onSubmit}>
			<input type="text" value={value} onChange={onChange} />
			<button type="submit">{children}</button>
		</form>
	);
};

class App extends Component {
	state = {
		searchTerm: DEFAULT_QUERY,
		result: null,
	};

	onSearchSubmit = event => {
		const { searchTerm } = this.state;
		this.fetchSearchTopStories(searchTerm);
		event.preventDefault();
	};

	setSearchTopStories(result) {
		const { hits, page } = result;
		const oldHits = page !== 0 ? this.state.result.hits : [];
		const updatedHits = [...oldHits, ...hits];
		this.setState({ result: { hits: updatedHits, page } });
	}

	fetchSearchTopStories(searchTerm, page = 0) {
		fetch(
			`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`,
		)
			.then(response => response.json())
			.then(result => this.setSearchTopStories(result))
			.catch(e => e);
	}

	componentDidMount() {
		const { searchTerm } = this.state;
		this.fetchSearchTopStories(searchTerm);
	}

	onSearchChange = event => {
		this.setState({ searchTerm: event.target.value });
	};

	onDismiss = id => {
		const isNotId = item => item.objectID !== id;
		const updatedHits = this.state.result.hits.filter(isNotId);

		this.setState({
			result: { ...this.state.result, hits: updatedHits },
		});
	};

	render() {
		const { searchTerm, result } = this.state;
		const page = (result && result.page) || 0;
		return (
			<div className="page">
				<div className="interactions">
					<Search
						value={searchTerm}
						onChange={this.onSearchChange}
						onSubmit={this.onSearchSubmit}>
						Search
					</Search>
				</div>
				{result && <Table list={result.hits} onDismiss={this.onDismiss} />}
				<div className="interactions">
					<Button
						onClick={() => this.fetchSearchTopStories(searchTerm, page + 1)}>
						More
					</Button>
				</div>
			</div>
		);
	}
}

export default App;
