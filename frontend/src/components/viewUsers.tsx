import { useEffect, useState } from 'react'
import { listUsers, createUser, type User } from '../api'

export default function ViewUsers() {
    const [users, setUsers] = useState<User[]>([])
    const [createNewUser, setCreateNewUser] = useState(false)
    
    useEffect(() => {
        listUsers().then(setUsers)
    }, [])

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.target as HTMLFormElement)
        const email = formData.get('email') as string
        console.log(`Email: ${email}`);
        createUser(email).then(() => {
            setCreateNewUser(false)
            listUsers().then(setUsers)
        })
        .catch((error) => {
            console.error('Error creating user:', error);
        });
    }

    return <div className="flex flex-col h-full gap-8">
        <h1 className="m-0">Users</h1>
        <div className="flex-1 overflow-auto">
            <table className="w-full border-collapse">
                <thead>
                    <tr className="border-b">
                        <th className="text-left p-4 font-semibold">ID</th>
                        <th className="text-left p-4 font-semibold">Email</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.id} className="border-b hover:bg-gray-100 dark:hover:bg-gray-800">
                            <td className="p-4">{user.id}</td>
                            <td className="p-4">{user.email}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        <div className="mt-auto">
            {createNewUser ? (
                <form onSubmit={handleSubmit} className="flex gap-2 items-center">
                    <input 
                        type="email" 
                        name="email" 
                        placeholder="Email" 
                        className="flex-1 px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
                    />
                    <button type="submit">Create</button>
                </form>
            ) : (
                <button onClick={() => setCreateNewUser(true)}>Create new</button>
            )}
        </div>
    </div>
}