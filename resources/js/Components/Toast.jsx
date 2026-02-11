import { useEffect, useState } from 'react';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';

export default function Toast({ message, type = 'success', onClose = () => {} }) {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            onClose();
        }, 4000);

        return () => clearTimeout(timer);
    }, [onClose]);

    if (!isVisible) return null;

    const bgColor = type === 'success' ? 'bg-green-50' : 'bg-red-50';
    const borderColor = type === 'success' ? 'border-green-200' : 'border-red-200';
    const textColor = type === 'success' ? 'text-green-800' : 'text-red-800';
    const Icon = type === 'success' ? CheckCircleIcon : XCircleIcon;

    return (
        <div className={`fixed top-4 right-4 ${bgColor} ${borderColor} border rounded-lg shadow-lg p-4 flex items-center gap-3 z-50 animate-fade-in`}>
            <Icon className={`h-5 w-5 ${type === 'success' ? 'text-green-600' : 'text-red-600'}`} />
            <p className={`${textColor} font-medium`}>{message}</p>
        </div>
    );
}
