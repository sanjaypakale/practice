
import React, { useState } from 'react'
import { Person } from './Dashboard'
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'

interface PersonListProps {
    persons: Person[]
    deletePerson: (id: number) => void;
}

export const PersonList: React.FC<PersonListProps> = ({ persons, deletePerson }) => {

    const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
    const [open, setOpen] = useState<boolean>(false);

    const handleOpen = (person: Person) => {
        setSelectedPerson(person);
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
        setSelectedPerson(null);
    }

    const handleDelete = () => {
        if (selectedPerson) {
            deletePerson(selectedPerson.id)
        }

        setOpen(false);
        setSelectedPerson(null);
    }

    return (
        <>
            <TableContainer component={Paper} sx={{ maxWidth: 600, margin: "0 auto", marginTop: 3 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Age</TableCell>
                            <TableCell>Delete</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            persons.map((person) =>
                                <TableRow key={person.id}>
                                    <TableCell>{person.id}</TableCell>
                                    <TableCell>{person.name}</TableCell>
                                    <TableCell>{person.age}</TableCell>
                                    <TableCell>
                                        <IconButton
                                            aria-label="delete"
                                            color="error"
                                            onClick={() => handleOpen(person)}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            )
                        }
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Confirm Deletion"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to delete {selectedPerson?.name}?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleDelete} color="error" autoFocus>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}
