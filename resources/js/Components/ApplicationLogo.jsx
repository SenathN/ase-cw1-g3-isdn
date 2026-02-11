export default function ApplicationLogo({ className = '' }) {
    return (
        <div className={`flex items-center ${className}`}>
            <img
                src="/images/logo.svg"
                alt="IslandLink Logo"
                className="h-10 w-10"
            />
            <div className="ml-2">
                <span className="text-xl font-bold text-gray-800">Island</span>
                <span className="text-xl font-bold text-rose-600">Link</span>
            </div>
        </div>
    );
}
