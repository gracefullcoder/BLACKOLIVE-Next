"use client";
import React, { useEffect, useState } from 'react';

function TopBarMessages() {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [editIndex, setEditIndex] = useState<any>(null);
    const [editMessage, setEditMessage] = useState('');

    useEffect(() => {
        fetch('/api/admin/features/message')
            .then((res) => res.json())
            .then((data) => {
                if (data.success) setMessages(data.topBarMessages);
            });
    }, []);

    const handleAddMessage = async () => {
        const res = await fetch('/api/admin/features/message', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: newMessage }),
        });
        const data = await res.json();
        if (data.success) {
            setMessages(data.topBarMessages);
            setNewMessage('');
        }
    };

    const handleEditMessage = async (index: any) => {
        const res = await fetch('/api/admin/features/message', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ index, newMessage: editMessage }),
        });
        const data = await res.json();
        if (data.success) {
            setMessages(data.topBarMessages);
            setEditIndex(null);
            setEditMessage('');
        }
    };

    const handleDeleteMessage = async (index: any) => {
        const res = await fetch('/api/admin/features/message', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ index }),
        });
        const data = await res.json();
        if (data.success) {
            setMessages(data.topBarMessages);
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-xl font-bold mb-4">Top Bar Messages</h1>

            {/* Add Message */}
            <div className="mb-4">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="border p-2 mr-2"
                    placeholder="New message"
                />
                <button
                    onClick={handleAddMessage}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    Add
                </button>
            </div>

            <ul>
                {messages.map((message, index) => (
                    <li key={index} className="mb-2 flex items-center">
                        {editIndex === index ? (
                            <>
                                <input
                                    type="text"
                                    value={editMessage}
                                    onChange={(e) => setEditMessage(e.target.value)}
                                    className="border p-2 mr-2"
                                />
                                <button
                                    onClick={() => handleEditMessage(index)}
                                    className="bg-green-500 text-white px-3 py-1 rounded mr-2"
                                >
                                    Save
                                </button>
                                <button
                                    onClick={() => setEditIndex(null)}
                                    className="bg-gray-500 text-white px-3 py-1 rounded"
                                >
                                    Cancel
                                </button>
                            </>
                        ) : (
                            <>
                                <span className="mr-4">{message}</span>
                                <button
                                    onClick={() => {
                                        setEditIndex(index);
                                        setEditMessage(message);
                                    }}
                                    className="bg-yellow-500 text-white px-3 py-1 rounded mr-2"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDeleteMessage(index)}
                                    className="bg-red-500 text-white px-3 py-1 rounded"
                                >
                                    Delete
                                </button>
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default TopBarMessages;
