import './App.css'
import PropTypes from 'prop-types'
import {useState, useEffect} from 'react'

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
    ))

function App() {
  const [searchTerm, setSearchTerm] = useStorageState('search', 'React');
  const [stories, setStories] = useState([])
  
  useEffect(() => {
    getAsyncStories().then(result => {
      setStories(result.data.stories)
    })
  },[])

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  }

  const handleRemoveStory = (item) => {
    const newStories = stories.filter(
      (story) => item.objectID !== story.objectID
    )
    setStories(newStories)
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
