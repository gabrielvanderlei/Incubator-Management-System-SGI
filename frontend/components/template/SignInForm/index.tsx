import loginUser from "@/services/auth/login";

import { useState } from "react";

export default function SignInForm() {
    const [formValues, setFormValues] = useState({
      email: '',
      password: '',
    });

    const [message, setMessage] = useState("");

    const handleChange = (event) => {
      setFormValues({
        ...formValues,
        [event.target.name]: event.target.value
      });
    }

    const handleSubmit = async (event) => {
      event.preventDefault();
      console.log(formValues);

      let data = (await loginUser(formValues));

      if(data.message){
        setMessage(data.message);
      }
      
      if(data.token){
        localStorage.setItem('token', data.token);

        setMessage("");
        window.location.href = ('./workspace');
      }
    }

    return (
      <>
        <div className="mt-10 flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            {/* <img
              className="mt-10 mx-auto h-10 w-auto"
              src="https://tailwindui.com/img/logos/mark.svg?color=blue&shade=600"
              alt="Your Company"
            /> */}
            <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
              Sign in to your account
            </h2>
            <h4 className="mt-10 text-center text-2xs font-bold leading-9 tracking-tight text-gray-900">
              {message}
            </h4>
          </div>
  
          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                  Email address
                </label>
                <div className="mt-2">
                  <input
                    id="email" 
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={formValues.email} onChange={handleChange}
                    required
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
  
              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                    Password
                  </label>
                </div>
                <div className="mt-2">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={formValues.password} onChange={handleChange}
                    autoComplete="current-password"
                    required
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
  
              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                >
                  Sign in
                </button>
              </div>
            </form>
          </div>
        </div>
      </>
    )
  }
  