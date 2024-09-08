'use client'

import { useState } from 'react';
import { Modal, Button } from 'antd';
import Swal from 'sweetalert2';

interface CreateRoomModalProps {
    isVisible: boolean;
    onCancel: () => void;
    onSubmit: (roomName: string, redTeamTopic: string, blueTeamTopic: string) => void;  // onSubmit 추가
}

const CreateRoomModal: React.FC<CreateRoomModalProps> = ({ isVisible, onCancel, onSubmit }) => {
    const [roomName, setRoomName] = useState('');
    const [redTeamTopic, setRedTeamTopic] = useState('');
    const [blueTeamTopic, setBlueTeamTopic] = useState('');

    const handleCreateRoom = () => {
        if (!roomName || !redTeamTopic || !blueTeamTopic) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Please fill in all fields!',
            });
            return;
        }

        // onSubmit으로 부모에게 값 전달
        onSubmit(roomName, redTeamTopic, blueTeamTopic);
        onCancel();
    };

    return (
        <Modal
            visible={isVisible}
            onCancel={onCancel}
            footer={null}
            className="flex"
            centered
            bodyStyle={{
                backgroundColor: 'rgba(25, 25, 25, 0.7)',
                padding: '20px',
                borderRadius: '15px'
            }}
        >
            <div className="flex flex-col items-center justify-center h-auto p-4 text-white font-serif shadow-md rounded-lg">
                <h2 className="text-3xl font-bold mb-6 neon-text text-center">Update Room Information</h2>

                <label htmlFor="roomName" className="text-lg mb-2 neon-text-normal">Room Name</label>
                <input
                    id="roomName"
                    type="text"
                    placeholder="Enter the room name"
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                    className="border p-2 mb-4 w-72 text-black rounded text-center"
                />

                <label htmlFor="redTeamTopic" className="text-lg mb-2 neon-text-normal">Red Team Topic</label>
                <input
                    id="redTeamTopic"
                    type="text"
                    placeholder="Enter Red Team's topic"
                    value={redTeamTopic}
                    onChange={(e) => setRedTeamTopic(e.target.value)}
                    className="border p-2 mb-4 w-72 text-black rounded text-center"
                />

                <label htmlFor="blueTeamTopic" className="text-lg mb-2 neon-text-normal">Blue Team Topic</label>
                <input
                    id="blueTeamTopic"
                    type="text"
                    placeholder="Enter Blue Team's topic"
                    value={blueTeamTopic}
                    onChange={(e) => setBlueTeamTopic(e.target.value)}
                    className="border p-2 mb-6 w-72 text-black rounded text-center"
                />

                <Button
                    className="bg-emerald-500 text-white px-4 py-2 rounded-full w-48 mb-4 hover:bg-emerald-600 transition"
                    onClick={handleCreateRoom}
                >
                    Update Room
                </Button>
                <Button
                    className="bg-gray-500 text-white px-4 py-2 rounded-full w-48 hover:bg-gray-600 transition"
                    onClick={onCancel}
                >
                    Cancel
                </Button>
            </div>
        </Modal>
    );
};

export default CreateRoomModal;