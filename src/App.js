import React, { useState, useEffect } from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css';


function App() {
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);
  const [groupBy, setGroupBy] = useState('status');
  const [sortBy, setSortBy] = useState('title');
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    // Fetch data from the API
    fetch('https://api.quicksell.co/v1/internal/frontend-assignment')
      .then((response) => response.json())
      .then((data) => {
        setTickets(data.tickets);
        setUsers(data.users);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  // Define functions to group and sort tickets
  const groupTickets = (group) => {
    setGroupBy(group);
  };

  const sortTickets = (sort) => {
    setSortBy(sort);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  // Define the options for group by and sort by
  const groupOptions = ['status', 'user', 'priority'];
  const sortOptions = ['title', 'priority'];

  const PriorityNames = {
    '4' : 'Urgent' ,
    '3' : 'High' ,
    '2' : 'Medium' ,
    '1' : 'Low' ,
    '0' : 'No priority' ,
  }
  // const getUserImage = (userId) => {
  //   // Replace this with actual logic to get user image
  //   return `https://placekitten.com/50/50?user=${userId}`;
  // };
  const groupImages = {
    'Todo': require('./icons/Todo.png'),
    'In progress': require('./icons/Inprogress_icon.png'),
    'Backlog': require('./icons/backlog.png'),
    'Anoop sharma': require('./icons/default.jpeg'),
    'Yogesh' : require('./icons/default.jpeg'),
    'Suresh' : require('./icons/default.jpeg'),
    'Shankar Kumar' : require('./icons/default.jpeg'),
    'Ramesh' : require('./icons/default.jpeg'),
    'Urgent' : require('./icons/urgent-logo.png'),
    'High' : require('./icons/High.png'),
    'Medium' : require('./icons/medium.png'),
    'Low' : require('./icons/low.png'),
    'No priority' : require('./icons/nopriority.jpg'),
    '4' : require('./icons/urgent-logo.png'),
    '3' : require('./icons/High.png'),
    '2' : require('./icons/medium.png'),
    '1' : require('./icons/low.png'),
    '0' : require('./icons/nopriority.jpg'),
    // Add more group names and image URLs as needed
  };
  

  const groupedAndSortedTickets = () => {
    // Group tickets based on the selected option
    const groupedTickets = {};
    for (const ticket of tickets) {
      const groupKey = groupBy === 'user' ? (users.find((user) => user.id === ticket.userId)?.name) : groupBy === 'priority' ? (PriorityNames[ticket.priority]) : ticket.status;
      if (!groupedTickets[groupKey]) {
        groupedTickets[groupKey] = [];
      }
      
      groupedTickets[groupKey].push(ticket);
    }

    // Sort tickets based on the selected option
    for (const key in groupedTickets) {
      groupedTickets[key] = groupedTickets[key].sort((a, b) => {
        if (sortBy === 'title') {
          return a.title.localeCompare(b.title);
        }
        return b.priority - a.priority;
      });
    }

    return groupedTickets;
  };

  // function getRandomAvatar(userId) {
  //   const size = 20; // Set the size of the avatar (in pixels)
  //   const baseUrl = `https://robohash.org/${userId}.png?size=${size}x${size}`;
  //   return baseUrl;
  // }
  

  return (
    <div className="App">
      <div className="dropdown">
        <div className='button-box'>
          <button onClick={toggleDropdown}>
          <i className={`bi bi-sliders2`} style={{paddingRight:'14px'}}/> Display <i className={`bi bi-chevron-down`} style={{paddingLeft:'6px'}}/> </button>
          {isDropdownOpen && (
            <div className="dropdown-content">
              <div style={{marginBottom:'10px'}}>
                <label>Group By:</label>
                <select onChange={(e) => groupTickets(e.target.value)} value={groupBy}>
                  {groupOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label>Sort By:</label>
                <select onChange={(e) => sortTickets(e.target.value)} value={sortBy} style={{marginLeft: '25px'}}>
                  {sortOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* <div className="options">
        <div>
          <label>Group By:</label>
          <select onChange={(e) => groupTickets(e.target.value)} value={groupBy}>
            <option value="status">Status</option>
            <option value="user">User</option>
            <option value="priority">Priority</option>
          </select>
        </div>
        <div>
          <label>Sort By:</label>
          <select onChange={(e) => sortTickets(e.target.value)} value={sortBy}>
            <option value="title">Title</option>
            <option value="priority">Priority</option>
          </select>
        </div>
      </div> */}
      <div className="kanban-board">
        {Object.keys(groupedAndSortedTickets()).map((group) => (
          <div key={group} className="group">
            <div className='group-title'> 
              <img src={groupImages[group]} alt="" className="group-photo" />
              <div style={{width: '60%', padding: '0'}}> <h2>{group}</h2> </div>
              <i className={`bi bi-plus`} style={{marginTop: '10px', width: '20px', height: '14px'}}/>
              <i className={`bi bi-three-dots`} style={{marginTop: '10px', width: '20px', height: '14px'}}/>
            </div>
            {groupedAndSortedTickets()[group].map((ticket) => (
              <div key={ticket.id} className="card">
                <div key={ticket.id} className='card-text'>
                  <h4>{ticket.id}</h4>
                  <h3>{ticket.title}</h3>
                  <div className='labels'>
                    <div className='card-label' style={{width: '21px'}}>
                      <img src={groupImages[ticket.priority]} alt="" className="label-img" />
                    </div>
                    <div className='card-label'>
                      <p style={{fontSize:'10px'}}>{ticket.tag}</p>
                    </div>
                  </div>
                  {/* <p>Status: {ticket.status}</p>
                  <p>Priority: {ticket.priority}</p>
                  <p>User: {users.find((user) => user.id === ticket.userId)?.name}</p> */}
                </div>
                <div className="user-info">
                  <div className="user-avatar-container">
                    <img src={require('./icons/default.jpeg')} alt="" className="user-photo" />
                    {users.find((user) => user.id === ticket.userId)?.available ? (
                      <div className="status-dot active"></div>
                    ) : (
                      <div className="status-dot"></div>
                    )}
                  </div>
                  
                </div>
                {/* <label>
                  <input
                    type="checkbox"
                    checked={completedTasks[ticket.id] || false}
                    onChange={() => handleCheckboxChange(ticket.id)}
                  />{' '}
                  Completed
                </label> */}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* <div className='kanban-board'>

      </div> */}
      {/* <div className="kanban-board">
        {Object.keys(groupedAndSortedTickets()).map((group) => (
          <div key={group} className="group">
            <h2>{group}</h2>
            {groupedAndSortedTickets()[group].map((ticket) => (
              <div key={ticket.id} className="card">
                <h4>{ticket.id}</h4>
                <h3>{ticket.title}</h3>
                <p>Status: {ticket.status}</p>
                <p>Priority: {ticket.priority}</p>
                <p>User: {users.find((user) => user.id === ticket.userId)?.name}</p>
              </div>
            ))}
          </div>
        ))}
      </div> */}
    </div>
  );
}

export default App;

