import Configuration from "../lib/config"

export default async function loginUser(data) {
    return await (await fetch(Configuration.endpoints.auth.login, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(data)
    })).json();
}