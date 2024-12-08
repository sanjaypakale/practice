import { Box, Button, TextField } from '@mui/material';
import React, { FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom';

interface LoginProps {
    handleLogin: () => void;
}

export const Login = ({ handleLogin }: LoginProps) => {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [errors, setErrors] = useState<{ username: string, password: string }>({ username: "", password: "" })
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {

        }
    }

    const validate = () => {
        const newErrors = { username: "", password: "" };
        if (!username.trim()) {
            newErrors.username = "Username is required!"
        }

        if (!password.trim()) {
            newErrors.password = "Password is required!";
        }

        if (username === "admin" && password === "password") {
            handleLogin();
            navigate("/create-person")
        } else {
            alert("Invalid username or Password")
        }

        setErrors(newErrors);

        return !newErrors.username && !newErrors.password
    }


    return (
        <>
            <Box component="form" onSubmit={handleSubmit} sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                maxWidth: 300,
                margin: '0 auto',
                marginTop: 5,
            }}>
                <TextField
                    variant='outlined'
                    label="Username"
                    name='username'
                    value={username}
                    error={!!errors.username}
                    helperText={errors.username}
                    onChange={(e) => setUsername(e.target.value)}
                    fullWidth > </TextField>
                <TextField
                    variant='outlined'
                    label="Password"
                    type='password'
                    name='password'
                    value={password}
                    error={!!errors.password}
                    helperText={errors.password}
                    onChange={(e) => setPassword(e.target.value)}
                    fullWidth >
                </TextField>
                <Button type="submit" variant="contained" color="primary" fullWidth>
                    Login
                </Button>
            </Box>
        </>
    )
}
