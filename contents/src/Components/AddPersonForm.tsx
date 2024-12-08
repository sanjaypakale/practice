import { Box, Button, TextField } from '@mui/material';
import React, { useState } from 'react'

interface AddPerosonFormProp {
    addPerson: (name: string, age: number) => void;
}

export const AddPersonForm = (props: AddPerosonFormProp) => {
    const [person, setPerson] = useState({ name: "", age: "" });
    const [errors, setErrors] = useState<{ name: string, age: string }>({ age: '', name: '' });

    const validate = () => {
        const newErrors = { name: '', age: '' };
        if (!person.name.trim()) {
            newErrors.name = "Name is required!"
        }

        if (!person.age.trim()) {
            newErrors.age = "Age is required!";
        } else if (!/^\d+$/.test(person.age)) {
            newErrors.age = "Invalid Age entered"
        } else if (parseInt(person.age) <= 0) {
            newErrors.age = "Age must be a positive non-zero number."
        }

        setErrors(newErrors);

        return !newErrors.age && !newErrors.name
    }


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            if (person.name.trim() && person.age.trim()) {
                props.addPerson(person.name, parseInt(person.age));
                setPerson({ age: "", name: "" })
                setErrors({ name: '', age: '' })
            }
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPerson((prevValues) => ({
            ...prevValues,
            [name]: value,
        }));
    }

    return (
        <Box component="form" onSubmit={handleSubmit}
            sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                maxWidth: 300,
                margin: "0 auto",
                marginBottom: 3,
            }}
        >

            <TextField label="Name"
                name='name'
                value={person.name}
                onChange={handleChange}
                error={!!errors.name}
                helperText={errors.name}
                variant='outlined' fullWidth>
            </TextField>

            <TextField label="Age"
                name='age'
                value={person.age}
                onChange={handleChange}
                error={!!errors.age}
                helperText={errors.age}
                variant='outlined' fullWidth ></TextField>
            <Button type="submit" variant="contained" color="primary" fullWidth>
                Add Person
            </Button>
        </Box>
    )
}
