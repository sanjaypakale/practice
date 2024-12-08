
import { useState } from 'react';
import './App.css';
import { AddPersonForm } from './AddPersonForm';
import { PersonList } from './PersonList';
import { Link, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { AppBar, Button, Container, Toolbar, Typography } from '@mui/material';
export interface Person {
    id: number;
    name: string;
    age: number;
}
export const Dashboard = () => {
    const [persons, setPersons] = useState<Person[]>([]);

    const addPerson = (name: string, age: number) => {
        const person: Person = { id: Date.now(), name: name, age: age };
        setPersons([...persons, person]);
    }

    const deletePerson = (id: number) => {
        setPersons(persons.filter((person) => person.id !== id));
    }
    return (
        <Router>
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
                </Toolbar>
            </AppBar>
            <Container sx={{ marginTop: 4 }}>
                <Routes>
                    <Route path="/create-person" element={<AddPersonForm addPerson={addPerson} />} />
                    <Route path="/list-person" element={<PersonList persons={persons} deletePerson={deletePerson} />} />
                    {/* <Route path="/view-person/:id" element={<ViewPerson />} /> */}
                </Routes>
            </Container>
        </Router>
        // <div className="App">
        //   <AddPersonForm addPerson={addPerson} />
        //   <PersonList persons={persons} deletePerson={deletePerson} />
        // </div>
    );
}


