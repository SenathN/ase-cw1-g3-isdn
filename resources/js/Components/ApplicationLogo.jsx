export default function ApplicationLogo({ className = '' }) {
    return (
        <div className={`flex items-center ${className}`}>
            <svg
                className="h-10 w-10 text-indigo-600"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                {/* Island/Distribution icon */}
                <path
                    d="M12 2L2 7L12 12L22 7L12 2Z"
                    fill="currentColor"
                    opacity="0.8"
                />
                <path
                    d="M2 17L12 22L22 17"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <path
                    d="M2 12L12 17L22 12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
            <div className="ml-2">
                <span className="text-xl font-bold text-gray-800">Island</span>
                <span className="text-xl font-bold text-indigo-600">Link</span>
            </div>
        </div>
    );
}
