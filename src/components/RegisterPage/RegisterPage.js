import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import './RegisterPage.css'

const LandingPage = ({ setToken }) => {

	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	const [passwordCheck, setPasswordCheck] = useState('')
	const [alert, setAlert] = useState('')

	const onSubmit = async () => {
		if (password === passwordCheck) {
			const params = {'username': username, 'password': password}
			await axios.post('/users/register', params)
			.then((res) => {
				setToken(res.data.token)
	    		window.location.href = "/lineups";
			})
			.catch((error) => {
				if (error.response && error.response.status === 409) {
					setAlert('Username is already in use!')
				} else {
					setAlert('An error occured!')
				}
				setPassword('')
				setPasswordCheck('')
			})
		} else {
			setAlert('Passwords do not match!')
			setPassword('')
			setPasswordCheck('')
		}
	}

	return (
		<div className="register-page">
			<h1 className="website-title">DFSTracker</h1>
			<div className="register-form-wrapper">
				<h1>Register</h1>
				<form className="register-form" onSubmit={onSubmit}>
		    	<div>
		    		<input className="form-control" type="text" placeholder="Enter a username" value={username}
		    			onChange={(e) => setUsername(e.target.value)} />
		    		<input className="form-control" type="text" placeholder="Enter a password" value={password}
		    		onChange={(e) => setPassword(e.target.value)} />
		    		<input className="form-control" type="text" placeholder="Re-enter password" value={passwordCheck}
		    		onChange={(e) => setPasswordCheck(e.target.value)} />
		    		{alert.length > 0 &&
		    			<>
		    				<p className="alert">{alert}</p>
		    			</>
		    		}
		    	</div>
		    </form>
		    <button className="form-submit-btn form-control" onClick={() => onSubmit()}>Register</button>
		    <div className="login-page-link-wrapper">
		    	<h4>Have an account?      
		    	<Link to='/login' className="login-page-link">Login</Link></h4>
		    </div>
		  </div>
		</div>
	)
}

export default LandingPage