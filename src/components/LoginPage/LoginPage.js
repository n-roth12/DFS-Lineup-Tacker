import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import axios from 'axios'
import './LoginPage.css'

const LoginPage = ({ setToken, setUserId }) => {

	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')

	const loginUser = async (credentials) => {
		await axios.post('/users/login', credentials)
		.then((res) => {
			alert('Succesfully logged in!')
			setToken(res.data.token)
    		window.location.href = "/lineups";
		})
		.catch((error) => {
			if (error.response && error.response.status === 403) {
				alert('Incorrect username or password!')
			} else {
				alert('An error occured!')
			}
			setPassword('')
		})
	}

	const handleSubmit = async () => {
		const token = await loginUser({
			username, password
		})
	}

	return (
		<div className="login-page">
			<div className="login-form-wrapper">
				<h1>Login</h1>
				<form className="login-form" onSubmit={handleSubmit}>
			    	<div>
			    		<input className="form-control" type="text" placeholder="Username" value={username}
			    			onChange={(e) => setUsername(e.target.value)} />
			    		<input className="form-control" type="text" placeholder="Password" value={password}
			    		onChange={(e) => setPassword(e.target.value)} />
			    	</div>
			    </form>
			    <button className="form-submit-btn form-control" onClick={() => handleSubmit()}>Login</button>
			    <div className="register-page-link-wrapper">
			    	<h4>Don't have an account?      
			    	<Link to='/register' className="register-page-link">Register</Link></h4>
			    </div>
			</div>
		</div>
	)
}

export default LoginPage

LoginPage.propTypes = {
	setToken: PropTypes.func.isRequired
}