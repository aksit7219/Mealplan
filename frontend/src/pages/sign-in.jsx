import {
  Card,
  Input,
  Checkbox,
  Button,
  Typography,
} from "@material-tailwind/react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import api from "@/config";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";

export function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pageType, setPageType] = useState('user')
  const navigate = useNavigate();
  const location = useLocation();
  const [PasswordHide, setPasswordHide] = useState(true)


  useEffect(() => {
    location.pathname === "/sign-in/restaurants" ? setPageType("restaurants") : setPageType('user')
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      console.log('Both fields are required.');
      return;
    }

    try {
      const response = await api.post('/login', { email, password })
      if (response.data.success) {
        localStorage.setItem('authUser', JSON.stringify(response.data.user));
        localStorage.setItem('token', response.data.token);
        navigate('/');
        console.log(response);
      } else {
        console.log(response.error || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      console.error('An error occurred. Please try again.');
    }
  };
  const handleRestaurantsSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      console.log('Both fields are required.');
      return;
    }

    try {
      const response = await api.post('/restaurants/login', { email, password })
      if (response.data.success) {
        localStorage.setItem('authUser', JSON.stringify(response.data.restaurant));
        localStorage.setItem('token', response.data.token);
        navigate('/');
        console.log(response);
      } else {
        console.log(response.error || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      console.error('An error occurred. Please try again.');
    }
  };


  return (
    <section className="m-8 flex gap-4">
      <div className="w-full lg:w-5/5 mt-24">
        <div className="text-center">
          <Typography variant="h2" className="font-bold mb-4">Sign In</Typography>
          <Typography variant="paragraph" color="blue-gray" className="text-lg font-normal">
            Enter your email and password to Sign In.
          </Typography>
        </div>
        <form className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/4" onSubmit={pageType === "user" ? handleSubmit : handleRestaurantsSubmit}>
          <div className="mb-1 flex flex-col gap-6">
            <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
              Your email
            </Typography>
            <Input
              size="lg"
              placeholder="name@mail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="!border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />
            <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
              Password
            </Typography>
            <Input
              icon={PasswordHide ? <EyeIcon className="cursor-pointer" onClick={() => setPasswordHide(!PasswordHide)} /> : <EyeSlashIcon className="cursor-pointer" onClick={() => setPasswordHide(!PasswordHide)} />}
              type={PasswordHide ? "password" : "text"}
              size="lg"
              placeholder="********"
              className="!border-t-blue-gray-200 focus:!border-t-gray-900"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />
          </div>
          <Checkbox
            label={
              <Typography
                variant="small"
                color="gray"
                className="flex items-center justify-start font-medium"
              >
                I agree to the&nbsp;
                <a
                  href="#"
                  className="font-normal text-black transition-colors hover:text-gray-900 underline"
                >
                  Terms and Conditions
                </a>
              </Typography>
            }
            containerProps={{ className: "-ml-2.5" }}
          />
          <Button type="submit" className="mt-6" fullWidth>
            Sign In
          </Button>
          <div className="flex items-center justify-between gap-2 mt-6">
            <Checkbox
              label={
                <Typography
                  variant="small"
                  color="gray"
                  className="flex items-center justify-start font-medium"
                >
                  Subscribe me to the newsletter
                </Typography>
              }
              containerProps={{ className: "-ml-2.5" }}
            />
            <Typography variant="small" className="font-medium text-gray-900">
              <a href="#">Forgot Password</a>
            </Typography>
          </div>
          <Typography variant="paragraph" className="text-center text-blue-gray-500 font-medium mt-4">
            Not registered?
            <Link to="/sign-up" className="text-gray-900 ml-1">Create account</Link>
          </Typography>
        </form>
      </div>
    </section>
  );
}

export default SignIn;
