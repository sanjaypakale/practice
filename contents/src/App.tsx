
import { useState } from 'react';
import './App.css';
import { AddPersonForm } from './Components/AddPersonForm';
import { PersonList } from './Components/PersonList';
import { Link, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { AppBar, Button, Container, Toolbar, Typography } from '@mui/material';
import { Login } from './Components/Login';

export interface Person {
  id: number;
  name: string;
  age: number;
}
function App() {
  const [persons, setPersons] = useState<Person[]>([]);
  const [loggedIn, setLoggedIn] = useState(false);
  // const navigate = useNavigate();

  const handleLogin = () => {
    setLoggedIn(true);
  }

  const addPerson = (name: string, age: number) => {
    const person: Person = { id: Date.now(), name: name, age: age };
    setPersons([...persons, person]);
  }

  const deletePerson = (id: number) => {
    setPersons(persons.filter((person) => person.id !== id));
  }
  const handleLogout = () => {
    setLoggedIn(false)
    // navigate("/")

  }
  return (
    <Router>
      {loggedIn && (
        <AppBar position='static'>
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Person Management
            </Typography>
            <Button color="inherit" component={Link} to="/create-person">
              Create Person
            </Button>
            <Button color="inherit" component={Link} to="/list-person">
              List Persons
            </Button>
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          </Toolbar>
        </AppBar>
      )};
      <Container sx={{ marginTop: 4 }}>
        <Routes>
          <Route path="/" element={<Login handleLogin={handleLogin} />} />
          <Route path="/create-person" element={<AddPersonForm addPerson={addPerson} />} />
          <Route path="/list-person" element={<PersonList persons={persons} deletePerson={deletePerson} />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
