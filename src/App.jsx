import './App.css'
import PropTypes from 'prop-types'
import {useState, useEffect, useReducer} from 'react'

const SET_STORIES = 'SET_STORIES';
const REMOVE_STORY = 'REMOVE_STORY';

const useStorageState = (key, initialState) => {
  const [value, setValue] = useState(
    localStorage.getItem(key) || initialState
  );
  
  useEffect(() => {
    localStorage.setItem(key, value);
  }, [value, key]);

  return [value, setValue];
};

const initialStories = [
  {
    title: 'React',
    url: 'https://reactjs.org/',
    author: 'Jordan Walke',
    num_comments: 3,
    points: 4,
    objectID: 0,
  },
  {
    title: 'Redux',
    url: 'https://redux.js.org/',
    author: 'Dan Abramov, Andrew Clark',
    num_comments: 2,
    points: 5,
    objectID: 1,
  },
];

const getAsyncStories = () => 
  new Promise((resolve) => 
    setTimeout(
      () => resolve({data: {stories: initialStories}}),
      2000
    ));

const storiesReducer = (state, action) => {
  switch(action.type) {
    case SET_STORIES:
      return action.payload
    case REMOVE_STORY:
      return state.filter(
        (story) => story.objectID !== action.payload.objectID
      )
    default:
      throw new Error()
  }
}

function App() {
  const [searchTerm, setSearchTerm] = useStorageState('search', 'React');
  const [stories, dispatchStories] = useReducer(
    storiesReducer,
    []
  )
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false);
  
  useEffect(() => {
    getAsyncStories().then(result => {
      dispatchStories({
        type: SET_STORIES,
        payload: result.data.stories
      })
      setIsLoading(false);
    })
    .catch(() => setIsError(true))
    setIsLoading(true)
  },[])

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  }

  const handleRemoveStory = (item) => {
    dispatchStories({
      type: REMOVE_STORY,
      payload: item,
    })
  }

  const searchedStories = stories.filter((item) => item.title.toLowerCase().includes(searchTerm.toLowerCase()))
  
  return (
    <div>
      <h1>My Hacker Stories</h1>
      <InputWithLabel 
      id="search"
      value={searchTerm}
      onInputChange={handleSearch}
      >
        <strong>Search: </strong>
      </InputWithLabel>

      <hr />
      {/* this is comment */}
      {isError && <p>Something went wrong...</p>}
      {isLoading && <div>Loading...</div>}
      <List list={searchedStories} onRemoveItem={handleRemoveStory} />
    </div>
  )
}

function InputWithLabel({id, value, type="text", onInputChange, children}) {
  return (
    <div>
      <label htmlFor={id}>{children}: </label>
      <input 
        id={id}
        type={type}
        value={value}
        onChange={onInputChange} 
      />

    </div>
   
  )
}

InputWithLabel.propTypes = {
  id: PropTypes.string,
  children: PropTypes.string,
  value: PropTypes.string,
  type: PropTypes.string,
  onInputChange: PropTypes.func
}

function List({ list, onRemoveItem }) {
  
  return (
    <ul>
      {list.map((item) => (
        <Item
         key={item.objectID}
         item={item}
         onRemoveItem={onRemoveItem}
        />
      ))}
    </ul>
  );
}

List.propTypes = {
  list: PropTypes.array,
  onRemoveItem: PropTypes.func
}
 
function Item({item, onRemoveItem}) {
  const handleRemoveItem = () => {
    onRemoveItem(item)
  }

  return (
    <li>
      <span>
        <a href={item.url}>{item.title}</a>
      </span>
      <span>{item.author}</span>
      <span>{item.num_comments}</span>
      <span>{item.points}</span>
      <span>
        <button type="button" onClick={handleRemoveItem}>
          Dismiss
        </button>
      </span>
    </li>
  );
}

Item.propTypes = {
  item: PropTypes.object,
  onRemoveItem: PropTypes.func
}

export default App
