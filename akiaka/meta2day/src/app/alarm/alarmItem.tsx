import React from 'react';

interface AlarmItemProps {
    alarm: {
        id: number;
        title: string;
        description: string;
        isNew: boolean;
        type: string;
        relatedLink: string;
    };
}

const AlarmItem: React.FC<AlarmItemProps> = ({ alarm }) => {
    return (
        <li className={`neon-text ${alarm.isNew ? 'new-alarm' : ''}`}>
            <div className="alarm-title">
                {alarm.title}
            </div>
            <div className="alarm-description">
                {alarm.description}
            </div>
            <a href={alarm.relatedLink} className="alarm-link">
                자세히 보기
            </a>
        </li>
    );
};

export default AlarmItem;
