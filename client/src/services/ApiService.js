export default {
    get(url, authenticated = true) {
        const headers = new Headers()
        if (authenticated) {
            headers.set(
                'Authorization',
                `Bearer ${localStorage.getItem('user-token')}`
            )
        }

        return fetch(`/api${url}`, {
            headers,
        }).then(response => response.json())
    },

    post(
        url,
        params = {},
        authenticated = true
    ) {
        const headers = new Headers({
            'content-type': 'application/json',
        })
        if (authenticated) {
            headers.set(
                'Authorization',
                `Bearer ${localStorage.getItem('user-token')}`
            )
        }

        return fetch(`/api${url}`, {
            headers,
            method: 'POST',
            mode: 'cors',
            cache: 'default',
            body: JSON.stringify(params),
        }).then(response => response.json())
    },

    put(
        url,
        params = {},
        authenticated = true
    ) {
        const headers = new Headers({
            'content-type': 'application/json',
        })
        if (authenticated) {
            headers.set(
                'Authorization',
                `Bearer ${localStorage.getItem('user-token')}`
            )
        }

        return fetch(`/api${url}`, {
            headers,
            method: 'PUT',
            mode: 'cors',
            cache: 'default',
            body: JSON.stringify(params),
        }).then(response => response.json())
    },

    delete(url, id) {
        const headers = new Headers({
            'content-type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('user-token')}`,
        })
        return fetch(`/api${url}/${id}`, {
            method: 'DELETE',
            headers,
        }).then(response => response.json())
    },
}
