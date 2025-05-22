const backendEndpoint =  process.env.NEXT_PUBLIC_BACKEND_URL;

const Configuration = {
    backendEndpoint,
    getAuthenticationToken: () => { return localStorage.getItem("token") },
    endpoints: {
        auth: { 
            login: `${backendEndpoint}/login`
        }
    }
}

export default Configuration